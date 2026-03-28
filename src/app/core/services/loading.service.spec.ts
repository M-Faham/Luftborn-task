import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be loading initially', () => {
    expect(service.loading).toBe(false);
  });

  it('should be loading after show()', () => {
    service.show();
    expect(service.loading).toBe(true);
  });

  it('should not be loading after show() then hide()', () => {
    service.show();
    service.hide();
    expect(service.loading).toBe(false);
  });

  it('should remain loading when multiple requests are active', () => {
    service.show();
    service.show();
    service.hide();
    expect(service.loading).toBe(true);
  });

  it('should stop loading when all requests are complete', () => {
    service.show();
    service.show();
    service.hide();
    service.hide();
    expect(service.loading).toBe(false);
  });

  it('should not go below zero active requests', () => {
    service.hide();
    service.hide();
    expect(service.loading).toBe(false);
  });
});
