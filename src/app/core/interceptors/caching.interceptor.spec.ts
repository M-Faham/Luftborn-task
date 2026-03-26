import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cachingInterceptor, invalidateCache } from './caching.interceptor';

describe('cachingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([cachingInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    invalidateCache(); // wipe cache between tests
  });

  describe('GET requests', () => {
    it('should pass the first request through to the network', () => {
      http.get('/api/tasks').subscribe();
      const req = httpMock.expectOne('/api/tasks');
      expect(req.request.method).toBe('GET');
      req.flush({ tasks: [] });
    });

    it('should return the cached response for a second identical GET', () => {
      const mockBody = { tasks: [{ id: '1' }] };

      // First call — goes to network
      http.get('/api/tasks').subscribe();
      httpMock.expectOne('/api/tasks').flush(mockBody);

      // Second call — should be served from cache (no pending request)
      let result: unknown;
      http.get('/api/tasks').subscribe((r) => (result = r));
      httpMock.expectNone('/api/tasks');
      expect(result).toEqual(mockBody);
    });

    it('should NOT cache 4xx / 5xx responses', () => {
      http.get('/api/tasks').subscribe({ error: () => {} });
      httpMock.expectOne('/api/tasks').flush('Not Found', { status: 404, statusText: 'Not Found' });

      // Second call must still go to the network
      http.get('/api/tasks').subscribe({ error: () => {} });
      httpMock.expectOne('/api/tasks').flush({ tasks: [] });
    });

    it('should cache responses per unique URL (including query params)', () => {
      http.get('/api/tasks', { params: { status: 'done' } }).subscribe();
      httpMock.expectOne('/api/tasks?status=done').flush({ tasks: [] });

      // Different params — different cache key → new network request
      http.get('/api/tasks', { params: { status: 'todo' } }).subscribe();
      httpMock.expectOne('/api/tasks?status=todo').flush({ tasks: [] });
    });
  });

  describe('non-GET requests', () => {
    it('should never cache POST requests', () => {
      const body = { title: 'New Task' };

      http.post('/api/tasks', body).subscribe();
      httpMock.expectOne('/api/tasks').flush({});

      // Second identical POST must hit the network too
      http.post('/api/tasks', body).subscribe();
      httpMock.expectOne('/api/tasks').flush({});
    });

    it('should never cache PATCH requests', () => {
      http.patch('/api/tasks/1', {}).subscribe();
      httpMock.expectOne('/api/tasks/1').flush({});
    });

    it('should never cache DELETE requests', () => {
      http.delete('/api/tasks/1').subscribe();
      httpMock.expectOne('/api/tasks/1').flush({});
    });
  });

  describe('invalidateCache', () => {
    it('should remove entries matching the given prefix', () => {
      const mockBody = { tasks: [] };

      // Populate cache
      http.get('/api/tasks').subscribe();
      httpMock.expectOne('/api/tasks').flush(mockBody);

      // Verify it is cached
      http.get('/api/tasks').subscribe();
      httpMock.expectNone('/api/tasks');

      // Invalidate and verify cache miss
      invalidateCache('/api/tasks');
      http.get('/api/tasks').subscribe();
      httpMock.expectOne('/api/tasks').flush(mockBody);
    });

    it('should clear all entries when called without arguments', () => {
      const mockBody = { tasks: [] };

      // Populate two entries
      http.get('/api/tasks').subscribe();
      httpMock.expectOne('/api/tasks').flush(mockBody);
      http.get('/api/statistics').subscribe();
      httpMock.expectOne('/api/statistics').flush({});

      invalidateCache();

      // Both must hit the network again
      http.get('/api/tasks').subscribe();
      httpMock.expectOne('/api/tasks').flush(mockBody);
      http.get('/api/statistics').subscribe();
      httpMock.expectOne('/api/statistics').flush({});
    });
  });
});
