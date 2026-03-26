import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StatisticsService } from './statistics.service';
import { Statistic, StatisticsResponse } from '../../../shared/models';
import { ChangeTypeEnum } from '../../../shared/enums';
import { invalidateCache } from '../../../core/interceptors/caching.interceptor';

function makeStat(overrides: Partial<Statistic> = {}): Statistic {
  return {
    id: 'stat-1',
    title: 'Total Tasks',
    icon: '📊',
    value: 10,
    change: '+2',
    changeLabel: 'this week',
    changeType: ChangeTypeEnum.Positive,
    color: '#1976D2',
    ...overrides,
  };
}

function makeResponse(stats: Statistic[] = []): StatisticsResponse {
  return { statistics: stats, lastUpdated: '2026-01-01T00:00:00Z' };
}

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpMock: HttpTestingController;

  async function flushInitial(stats: Statistic[] = []): Promise<void> {
    TestBed.tick();
    httpMock.expectOne('/api/statistics').flush(makeResponse(stats));
    await TestBed.inject(ApplicationRef).whenStable();
  }

  async function stabilize(): Promise<void> {
    await TestBed.inject(ApplicationRef).whenStable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatisticsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(StatisticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    invalidateCache();
  });

  describe('initial load', () => {
    it('should fetch from /api/statistics on creation', async () => {
      const stat = makeStat();
      await flushInitial([stat]);

      expect(service.statistics()).toEqual([stat]);
    });

    it('should default statistics to [] before response arrives', async () => {
      expect(service.statistics()).toEqual([]);
      await flushInitial();
    });
  });

  describe('isLoading', () => {
    it('should be true while the request is in flight', async () => {
      TestBed.tick();
      expect(service.isLoading()).toBe(true);
      await flushInitial();
    });

    it('should be false after response is received', async () => {
      await flushInitial();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('error signal', () => {
    it('should be undefined when no error has occurred', async () => {
      await flushInitial();
      expect(service.error()).toBeUndefined();
    });
  });

  describe('reload', () => {
    it('should trigger a new GET request to /api/statistics', async () => {
      await flushInitial([makeStat()]);

      service.reload();
      TestBed.tick();

      const req = httpMock.expectOne('/api/statistics');
      expect(req.request.method).toBe('GET');

      const updated = makeStat({ value: 42 });
      req.flush(makeResponse([updated]));
      await stabilize();

      expect(service.statistics()[0].value).toBe(42);
    });
  });

  describe('statistics computed', () => {
    it('should map all fields from the API response', async () => {
      const stat = makeStat({ title: 'Completed', value: 89, changeType: ChangeTypeEnum.Positive });
      await flushInitial([stat]);

      expect(service.statistics()[0]).toMatchObject({ title: 'Completed', value: 89 });
    });

    it('should return empty array when statistics array is empty', async () => {
      await flushInitial([]);
      expect(service.statistics()).toHaveLength(0);
    });
  });
});
