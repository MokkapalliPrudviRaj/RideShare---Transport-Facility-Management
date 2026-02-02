import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ride } from '../models/ride';
import { VehicleType } from '../models/vehicle-type';

@Injectable({ providedIn: 'root' })
export class RideService {
    private readonly STORAGE_KEY = 'rides_v1';
    private ridesSubject = new BehaviorSubject<Ride[]>(this.loadRides());
    rides$ = this.ridesSubject.asObservable();

    private loadRides(): Ride[] {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : []; // Add your SEED_DATA here
    }

    addRide(ride: Ride) {
        const current = [ride, ...this.ridesSubject.value];
        this.save(current);
    }

    updateRide(updatedRide: Ride) {
        const current = this.ridesSubject.value.map(r => r.id === updatedRide.id ? updatedRide : r);
        this.save(current);
    }

    private save(rides: Ride[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rides));
        this.ridesSubject.next(rides);
    }
}