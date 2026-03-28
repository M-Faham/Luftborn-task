import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([ErrorInterceptor])),
        provideHttpClientTesting(),
        MessageService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    messageService = TestBed.inject(MessageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through successful requests', () => {
    const spy = vi.spyOn(messageService, 'add');

    http.get('/api/test').subscribe();
    httpMock.expectOne('/api/test').flush({ data: 'ok' });

    expect(spy).not.toHaveBeenCalled();
  });

  it('should show error message on HTTP error', () => {
    const spy = vi.spyOn(messageService, 'add');

    http.get('/api/test').subscribe({ error: () => {} });
    httpMock
      .expectOne('/api/test')
      .flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'Error' }),
    );
  });

  it('should re-throw the error', () => {
    let caughtError: any;

    http.get('/api/test').subscribe({ error: (err) => (caughtError = err) });
    httpMock.expectOne('/api/test').flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(caughtError).toBeTruthy();
    expect(caughtError.status).toBe(404);
  });
});
