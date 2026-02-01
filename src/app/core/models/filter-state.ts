import { VehicleType } from "./vehicle-type";

export interface FilterState {
  vehicleType: VehicleType | 'All';
  searchTime: string;
}