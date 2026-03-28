import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be closed initially', () => {
    expect(service.isOpen()).toBe(false);
  });

  it('toggle() should open when closed', () => {
    service.toggle();
    expect(service.isOpen()).toBe(true);
  });

  it('toggle() should close when open', () => {
    service.toggle();
    service.toggle();
    expect(service.isOpen()).toBe(false);
  });

  it('close() should set isOpen to false', () => {
    service.toggle();
    service.close();
    expect(service.isOpen()).toBe(false);
  });
});
