import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render branding', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('RideShare');
  });

  describe('handleBookRide', () => {
    it('should prevent booking own ride', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      const rideId = app.rides()[0].id;
      const ownerId = app.rides()[0].employeeId;

      const result = app.handleBookRide(rideId, ownerId);
      expect(result).toBe('Cannot book your own ride.');
    });

    it('should prevent duplicate booking', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      const rideId = app.rides()[0].id;
      const bookerId = 'EMP-999';

      app.handleBookRide(rideId, bookerId);
      const result = app.handleBookRide(rideId, bookerId);
      expect(result).toBe('Already booked.');
    });

    it('should decrement vacant seats on success', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      const rideId = app.rides()[0].id;
      const initialSeats = app.rides()[0].vacantSeats;
      const bookerId = 'EMP-888';

      const result = app.handleBookRide(rideId, bookerId);
      expect(result).toBeNull();
      expect(app.rides().find(r => r.id === rideId)?.vacantSeats).toBe(initialSeats - 1);
    });
  });
});
