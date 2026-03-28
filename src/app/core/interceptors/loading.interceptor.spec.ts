import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

describe('loadingInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show loading when request starts', () => {
    http.get('/api/test').subscribe();
    expect(loadingService.loading).toBe(true);
    httpMock.expectOne('/api/test').flush({});
  });

  it('should hide loading when request completes', () => {
    http.get('/api/test').subscribe();
    httpMock.expectOne('/api/test').flush({});
    expect(loadingService.loading).toBe(false);
  });

  it('should hide loading when request errors', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush('fail', { status: 500, statusText: 'Error' });
    expect(loadingService.loading).toBe(false);
  });

  it('should track multiple concurrent requests', () => {
    http.get('/api/a').subscribe();
    http.get('/api/b').subscribe();

    expect(loadingService.loading).toBe(true);

    httpMock.expectOne('/api/a').flush({});
    expect(loadingService.loading).toBe(true);

    httpMock.expectOne('/api/b').flush({});
    expect(loadingService.loading).toBe(false);
  });
});
