import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SplashScreenService } from './splash-screen.service';

describe('SplashScreenService', () => {
  let service: SplashScreenService;

  beforeEach(() => {
    document.body.classList.remove('splash-screen-hidden');

    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: class {} as any }])],
    });
  });

  it('should be created', () => {
    service = TestBed.inject(SplashScreenService);
    expect(service).toBeTruthy();
  });

  it('should remove splash-screen-hidden on creation (show called in constructor)', () => {
    document.body.classList.add('splash-screen-hidden');
    service = TestBed.inject(SplashScreenService);
    expect(document.body.classList.contains('splash-screen-hidden')).toBe(false);
  });

  it('show() should only remove hidden class on first call (counter === 1)', () => {
    service = TestBed.inject(SplashScreenService);
    // Constructor already called show() (counter=1), class is already removed.
    // Calling show() again (counter=2) should NOT remove the class if re-added externally.
    service.hide(); // counter=0, adds hidden class
    expect(document.body.classList.contains('splash-screen-hidden')).toBe(true);

    service.show(); // counter=1 → removes hidden class
    expect(document.body.classList.contains('splash-screen-hidden')).toBe(false);
  });

  it('hide() should add hidden class when counter reaches 0', () => {
    service = TestBed.inject(SplashScreenService);

    // Constructor calls show() once (counter=1), so we need one hide to reach 0
    service.hide();
    expect(document.body.classList.contains('splash-screen-hidden')).toBe(true);
  });

  it('hide() should not add hidden class when counter is still positive', () => {
    service = TestBed.inject(SplashScreenService);

    // Constructor: counter=1. show() again: counter=2
    service.show();
    service.hide(); // counter=1
    expect(document.body.classList.contains('splash-screen-hidden')).toBe(false);
  });

  it('hide() should throw when counter goes below 0', () => {
    service = TestBed.inject(SplashScreenService);

    service.hide(); // counter=0
    expect(() => service.hide()).toThrow('Splash screen counter is less than 0');
  });
});
