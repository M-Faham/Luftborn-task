import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    fixture.detectChanges();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the spinner container', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.spinner-container')).not.toBeNull();
  });

  it('should render the progress spinner', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('p-progress-spinner')).not.toBeNull();
  });

  it('should render the logo image', () => {
    const el: HTMLElement = fixture.nativeElement;
    const img = el.querySelector('.spinner-image img') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('imgs/logo.jpg');
  });
});
