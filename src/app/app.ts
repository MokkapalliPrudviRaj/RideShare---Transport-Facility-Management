import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ride } from './core/models/ride';
import { VehicleType } from './core/models/vehicle-type';
import { generateId, isTimeMatched, minutesToTime } from './core/utils/utils';
import { AddRideForm } from './features/add-ride-form/add-ride-form';
import { RideCard } from './features/ride-card/ride-card';
import { Icons } from './shared/icons/icons';
import { RouterOutlet } from '@angular/router';

const STORAGE_KEY = 'rides_v1';

const SEED_DATA: Ride[] = [
  {
    id: generateId(),
    employeeId: 'EMP-101',
    vehicleType: VehicleType.CAR,
    vehicleNo: 'KA-05-MT-1122',
    vacantSeats: 4,
    time: '09:00',
    pickupPoint: 'North Campus',
    destination: 'Downtown HQ',
    passengers: ['EMP-505', 'EMP-606'],
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    employeeId: 'EMP-102',
    vehicleType: VehicleType.BIKE,
    vehicleNo: 'KA-01-RS-9988',
    vacantSeats: 1,
    time: '10:30',
    pickupPoint: 'Main Station',
    destination: 'Innovation Lab',
    passengers: [],
    createdAt: new Date().toISOString()
  }
];

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, AddRideForm, RideCard, Icons],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('transport-facility');
  protected readonly currentYear = new Date().getFullYear();



  activeTab = signal<'browse' | 'offer'>('browse');
  rides = signal<Ride[]>([]);
  vehicleFilter = signal<string>('All');
  searchTime = signal<string>('');
  timeMinutes = signal<number | null>(null);

  constructor() {
    this.rides.set(this.loadRides());

    effect(() => {
      try {
        const current = this.rides();
        if (current && Array.isArray(current)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        }
      } catch (e) {
        console.error('Failed to save state to localStorage', e);
      }
    });
  }

  private loadRides(): Ride[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (typeof saved === 'string' && saved.trim().startsWith('[') && saved.trim().endsWith(']')) {
        const parsed = JSON.parse(saved) as Ride[];
        if (Array.isArray(parsed)) {
          // Enforcement: Only show rides from today
          const today = new Date().toDateString();
          return parsed.filter(r => {
            if (!r.createdAt) return true; // Legacy support
            return new Date(r.createdAt).toDateString() === today;
          });
        }
      }
    } catch (e) {
      console.warn('LocalStorage data was invalid JSON. Reverting to seed data.', e);
      localStorage.removeItem(STORAGE_KEY);
    }
    return SEED_DATA;
  }

  filteredRides = computed(() => {
    return this.rides().filter(ride => {
      const typeMatch = this.vehicleFilter() === 'All' || ride.vehicleType === this.vehicleFilter();
      const timeMatch = isTimeMatched(ride.time, this.searchTime() || null);
      return typeMatch && timeMatch;
    });
  });

  stats = computed(() => {
    const currentRides = this.rides();
    const activeCarpools = currentRides.length;
    const totalPassengers = currentRides.reduce((sum, ride) => sum + (ride.passengers?.length || 0), 0);
    return {
      activeCarpools,
      co2SavedKg: (totalPassengers * 4.2).toFixed(1),
      totalPassengers
    };
  });

  windowStart = computed(() => this.timeMinutes() !== null ? minutesToTime(Math.max(0, this.timeMinutes()! - 60)) : '');
  windowEnd = computed(() => this.timeMinutes() !== null ? minutesToTime(Math.min(1439, this.timeMinutes()! + 60)) : '');

  handleAddRide(newRide: Ride) {
    const rideWithTimestamp = { ...newRide, createdAt: new Date().toISOString() };
    this.rides.update(prev => [rideWithTimestamp, ...prev]);
    this.activeTab.set('browse');
  }

  handleBookRide(rideId: string, bookerId: string): string | null {
    const trimmedId = bookerId.trim().toUpperCase();
    const currentRides = this.rides();
    const rideIndex = currentRides.findIndex(r => r.id === rideId);
    if (rideIndex === -1) return "Ride not found.";
    const ride = currentRides[rideIndex];
    if (ride.employeeId.toUpperCase() === trimmedId) return "Cannot book your own ride.";
    if (ride.passengers?.some(p => p.toUpperCase() === trimmedId)) return "Already booked.";
    if (currentRides.some(r => r.id !== rideId && r.passengers?.some(p => p.toUpperCase() === trimmedId))) return "Already have a booking.";
    if (ride.vacantSeats <= 0) return "Ride is full.";

    this.rides.update(prev => {
      const next = [...prev];
      next[rideIndex] = { ...ride, vacantSeats: ride.vacantSeats - 1, passengers: [...(ride.passengers || []), trimmedId] };
      return next;
    });
    return null;
  }

  handleBookRideBound = this.handleBookRide.bind(this);

  onTimeSliderChange(event: Event) {
    const val = (event.target as HTMLInputElement).valueAsNumber;
    this.timeMinutes.set(val);
    this.searchTime.set(minutesToTime(val));
  }

  onSliderStart() {
    if (this.timeMinutes() === null) {
      this.timeMinutes.set(540); // 09:00 default
      this.searchTime.set('09:00');
    }
  }

  resetTimeFilter() {
    this.timeMinutes.set(null);
    this.searchTime.set('');
  }

  resetAllFilters() {
    this.vehicleFilter.set('All');
    this.resetTimeFilter();
  }
}
