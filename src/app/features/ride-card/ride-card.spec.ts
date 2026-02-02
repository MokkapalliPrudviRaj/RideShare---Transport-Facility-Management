import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideCard } from './ride-card';

describe('RideCard', () => {
  let component: RideCard;
  let fixture: ComponentFixture<RideCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideCard]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RideCard);
    component = fixture.componentInstance;
    component.ride = {
      id: '1',
      employeeId: 'EMP-123',
      vehicleType: 'Car' as any,
      vehicleNo: 'KA-01-1234',
      vacantSeats: 4,
      time: '09:00',
      pickupPoint: 'A',
      destination: 'B',
      passengers: []
    };
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
