
/**
 * Standard Employee ID regex: Starts with EMP- followed by at least 3 digits.
 * Case insensitive.
 */
export const EMP_ID_REGEX = /^EMP-\d{3,}$/i;

/**
 * Standard Vehicle Number regex: Supports formats like KA-01-MG-1234 or KA01MG1234
 * Requires 2 letters, 2 digits, 1-2 letters, and 4 digits.
 */
export const VEHICLE_NO_REGEX = /^[A-Z]{2}[ -]?\d{1,2}[ -]?[A-Z]{1,2}[ -]?\d{4}$/i;

/**
 * Validates if an Employee ID follows the standard corporate format.
 */
export const isValidEmployeeId = (id: string): boolean => {
    return EMP_ID_REGEX.test(id.trim());
};

/**
 * Validates if a Vehicle Number follows a standard plate format.
 */
export const isValidVehicleNo = (no: string): boolean => {
    return VEHICLE_NO_REGEX.test(no.trim());
};

/**
 * Converts a time string (HH:mm) to total minutes from midnight.
 */
export const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

/**
 * Converts total minutes from midnight to a time string (HH:mm).
 */
export const minutesToTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Converts HH:mm to hh:mm AM/PM
 */
export const formatTimeDisplay = (timeStr: string): string => {
    if (!timeStr) return '';
    const minutes = timeToMinutes(timeStr);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Checks if two times are within a specified buffer (default 60 mins).
 */
export const isTimeMatched = (rideTime: string, filterTime: string | null, bufferMinutes: number = 60): boolean => {
    if (!filterTime) return true;
    const rideMin = timeToMinutes(rideTime);
    const filterMin = timeToMinutes(filterTime);
    return Math.abs(rideMin - filterMin) <= bufferMinutes;
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => Math.random().toString(36).substring(2, 9);
