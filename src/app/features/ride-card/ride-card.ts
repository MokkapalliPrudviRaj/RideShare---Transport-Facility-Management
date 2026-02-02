import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ride } from '../../core/models/ride';
import { VehicleType } from '../../core/models/vehicle-type';
import { isValidEmployeeId } from '../../core/utils/utils';
import { Icons } from '../../shared/icons/icons';

@Component({
  selector: 'app-ride-card',
  standalone: true,
  imports: [CommonModule, FormsModule, Icons],
  templateUrl: './ride-card.html',
  styleUrl: './ride-card.css'
})
export class RideCard {
  @Input() ride!: Ride;
  @Input() onBook!: (rideId: string, employeeId: string) => string | null;

  bookingEmpId: string = '';
  error: string | null = null;
  success: boolean = false;
  isFocused: boolean = false;
  isHovered = false;

  VehicleType = VehicleType;

  get totalCapacity(): number {
    return this.ride.vacantSeats + (this.ride.passengers?.length || 0);
  }

  get isInputValidFormat(): boolean {
    return this.bookingEmpId.length === 0 || isValidEmployeeId(this.bookingEmpId);
  }

  get passengers(): string[] {
    return this.ride.passengers || [];
  }

  get vacantSeatsArray(): number[] {
    return Array(this.ride.vacantSeats).fill(0);
  }

  handleBook() {
    const trimmedId = this.bookingEmpId.trim();

    if (!trimmedId) {
      this.error = "Employee ID is required.";
      return;
    }

    if (!isValidEmployeeId(trimmedId)) {
      this.error = "Format Error: Must be EMP-XXXX.";
      return;
    }

    this.error = null;
    const resultMessage = this.onBook(this.ride.id, trimmedId);

    if (resultMessage) {
      this.error = resultMessage;
      this.success = false;
    } else {
      this.success = true;
      this.bookingEmpId = '';
      this.error = null;
      setTimeout(() => this.success = false, 5000);
    }
  }
}