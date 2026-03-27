import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DashboardComponent } from './dashboard.component';
import { invalidateCache } from '../../core/interceptors/caching.interceptor';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({ fallbackLang: 'en' }),
        MessageService,
        DialogService,
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock
      .match('/api/tasks')
      .forEach((r) => r.flush({ tasks: [], meta: { totalCount: 0, lastUpdated: '' } }));
    httpMock.match('/api/statistics').forEach((r) => r.flush({ statistics: [], lastUpdated: '' }));
    httpMock.verify();
    invalidateCache();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render lb-tasks element', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('lb-tasks')).toBeTruthy();
  });
});
