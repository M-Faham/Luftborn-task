import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let fixture: ComponentFixture<LoadingComponent>;

  async function createComponent(isLoading: boolean): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    fixture.componentRef.setInput('isLoading', isLoading);
    fixture.detectChanges();
  }

  afterEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    await createComponent(false);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the spinner wrapper when isLoading is true', async () => {
    await createComponent(true);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.spinner-wrapper')).not.toBeNull();
  });

  it('should show lb-loader when isLoading is true', async () => {
    await createComponent(true);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('lb-loader')).not.toBeNull();
  });

  it('should hide the spinner wrapper when isLoading is false', async () => {
    await createComponent(false);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.spinner-wrapper')).toBeNull();
  });

  it('should hide lb-loader when isLoading is false', async () => {
    await createComponent(false);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('lb-loader')).toBeNull();
  });

  it('should reactively show the loader when isLoading changes to true', async () => {
    await createComponent(false);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner-wrapper')).not.toBeNull();
  });

  it('should reactively hide the loader when isLoading changes to false', async () => {
    await createComponent(true);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner-wrapper')).toBeNull();
  });
});
