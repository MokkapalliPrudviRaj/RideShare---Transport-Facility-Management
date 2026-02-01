import { VehicleType } from "./vehicle-type";

export interface Ride {
  id: string;
  employeeId: string; 
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number;
  time: string; 
  pickupPoint: string;
  destination: string;
  passengers: string[]; 
}