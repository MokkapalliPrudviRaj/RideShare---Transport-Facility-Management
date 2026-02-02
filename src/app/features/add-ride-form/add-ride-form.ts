import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ride } from '../../core/models/ride';
import { VehicleType } from '../../core/models/vehicle-type';
import { generateId, isValidEmployeeId, isValidVehicleNo, minutesToTime, timeToMinutes, formatTimeDisplay } from '../../core/utils/utils';

import { Icons } from '../../shared/icons/icons';

@Component({
  selector: 'app-add-ride-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Icons],
  templateUrl: './add-ride-form.html',
  styleUrls: ['./add-ride-form.css']
})
export class AddRideForm implements OnInit {
  @Input() existingRides: Ride[] = [];
  @Output() onAdd = new EventEmitter<Ride>();

  rideForm!: FormGroup;
  error: string | null = null;
  VehicleType = VehicleType; // Export for template use

  readonly commonShifts = [
    { label: '08:00 AM', value: '08:00' },
    { label: '09:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '05:00 PM', value: '17:00' },
    { label: '06:00 PM', value: '18:00' },
    { label: '07:00 PM', value: '19:00' },
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.rideForm = this.fb.group({
      employeeId: ['', [Validators.required, this.employeeIdValidator.bind(this)]],
      vehicleType: [VehicleType.CAR, Validators.required],
      vehicleNo: ['', [Validators.required, this.vehicleNoValidator]],
      vacantSeats: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      time: ['09:00', Validators.required],
      pickupPoint: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  // Custom Validators
  private employeeIdValidator(control: any) {
    if (!control.value) return null;
    const isValid = isValidEmployeeId(control.value);
    const isUnique = !this.existingRides.some(
      r => r.employeeId.toUpperCase() === control.value.trim().toUpperCase()
    );
    return isValid && isUnique ? null : { invalidId: true };
  }

  private vehicleNoValidator(control: any) {
    if (!control.value) return null;
    return isValidVehicleNo(control.value) ? null : { invalidVehicle: true };
  }

  // Getters for template logic
  get currentMinutes(): number {
    return timeToMinutes(this.rideForm.get('time')?.value || '00:00');
  }

  get displayTime(): string {
    return formatTimeDisplay(this.rideForm.get('time')?.value);
  }

  // Actions
  adjustSeats(delta: number) {
    const current = this.rideForm.get('vacantSeats')?.value;
    const next = Math.min(10, Math.max(1, current + delta));
    this.rideForm.patchValue({ vacantSeats: next });
  }

  setTime(time: string) {
    this.rideForm.patchValue({ time });
  }

  onSliderChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.rideForm.patchValue({ time: minutesToTime(parseInt(val)) });
  }

  handleSubmit() {
    if (this.rideForm.invalid) {
      this.error = "Please ensure all fields are correctly filled.";
      return;
    }

    const rawData = this.rideForm.value;
    const newRide: Ride = {
      ...rawData,
      employeeId: rawData.employeeId.trim().toUpperCase(),
      vehicleNo: rawData.vehicleNo.trim().toUpperCase(),
      id: generateId(),
      passengers: []
    };

    this.onAdd.emit(newRide);
    this.rideForm.reset({
      vehicleType: VehicleType.CAR,
      vacantSeats: 1,
      time: '09:00'
    });
    this.error = null;
  }
}