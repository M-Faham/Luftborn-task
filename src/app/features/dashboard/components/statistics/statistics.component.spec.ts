import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { StatisticsService } from '../../services/statistics.service';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;

  const mockStatisticsService = {
    statistics: signal([]).asReadonly(),
    isLoading: signal(false).asReadonly(),
    error: signal(undefined).asReadonly(),
    reload: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
    })
      .overrideComponent(StatisticsComponent, {
        set: { providers: [{ provide: StatisticsService, useValue: mockStatisticsService }] },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide StatisticsService', () => {
    const fixture = TestBed.createComponent(StatisticsComponent);
    const service = fixture.debugElement.injector.get(StatisticsService);
    expect(service).toBeTruthy();
  });
});
