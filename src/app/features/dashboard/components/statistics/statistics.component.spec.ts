import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StatisticsComponent } from './statistics.component';
import { StatisticsService } from '../../services/statistics.service';
import { invalidateCache } from '../../../../core/interceptors/caching.interceptor';

describe('StatisticsComponent', () => {
  let fixture: ComponentFixture<StatisticsComponent>;
  let component: StatisticsComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock
      .expectOne('/api/statistics')
      .flush({ statistics: [], lastUpdated: '2026-01-01T00:00:00Z' });
    httpMock.verify();
    invalidateCache();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide StatisticsService', () => {
    const service = fixture.debugElement.injector.get(StatisticsService);
    expect(service).toBeTruthy();
  });
});
