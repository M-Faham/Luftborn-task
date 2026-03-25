import { TestBed } from '@angular/core/testing';
import { CoreModule } from './core.module';

describe('CoreModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule],
    });
  });

  it('should create the module', () => {
    const module = TestBed.inject(CoreModule);
    expect(module).toBeTruthy();
  });
});
