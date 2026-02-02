import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRideForm } from './add-ride-form';

describe('AddRideForm', () => {
  let component: AddRideForm;
  let fixture: ComponentFixture<AddRideForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRideForm]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddRideForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
