import {
    timeToMinutes,
    minutesToTime,
    formatTimeDisplay,
    isTimeMatched,
    isValidEmployeeId,
    isValidVehicleNo
} from './utils';

describe('Utils', () => {
    describe('timeToMinutes', () => {
        it('should convert time string to minutes from midnight', () => {
            expect(timeToMinutes('00:00')).toBe(0);
            expect(timeToMinutes('01:30')).toBe(90);
            expect(timeToMinutes('23:59')).toBe(1439);
        });

        it('should return 0 for empty string', () => {
            expect(timeToMinutes('')).toBe(0);
        });
    });

    describe('minutesToTime', () => {
        it('should convert minutes to HH:mm string', () => {
            expect(minutesToTime(0)).toBe('00:00');
            expect(minutesToTime(90)).toBe('01:30');
            expect(minutesToTime(1439)).toBe('23:59');
        });
    });

    describe('formatTimeDisplay', () => {
        it('should format 24h time to 12h AM/PM', () => {
            expect(formatTimeDisplay('09:00')).toBe('09:00 AM');
            expect(formatTimeDisplay('12:00')).toBe('12:00 PM');
            expect(formatTimeDisplay('13:30')).toBe('01:30 PM');
            expect(formatTimeDisplay('00:15')).toBe('12:15 AM');
        });
    });

    describe('isTimeMatched', () => {
        it('should return true if times are within buffer', () => {
            expect(isTimeMatched('09:00', '10:00', 60)).toBe(true);
            expect(isTimeMatched('09:00', '08:00', 60)).toBe(true);
            expect(isTimeMatched('09:00', '09:30', 60)).toBe(true);
        });

        it('should return false if times are outside buffer', () => {
            expect(isTimeMatched('09:00', '10:01', 60)).toBe(false);
            expect(isTimeMatched('09:00', '07:59', 60)).toBe(false);
        });

        it('should return true if no filter time is provided', () => {
            expect(isTimeMatched('09:00', null)).toBe(true);
        });
    });

    describe('isValidEmployeeId', () => {
        it('should validate correct employee ID format', () => {
            expect(isValidEmployeeId('EMP-123')).toBe(true);
            expect(isValidEmployeeId('emp-9999')).toBe(true);
            expect(isValidEmployeeId('  EMP-456  ')).toBe(true);
        });

        it('should invalidate incorrect formats', () => {
            expect(isValidEmployeeId('ABC-123')).toBe(false);
            expect(isValidEmployeeId('EMP123')).toBe(false);
            expect(isValidEmployeeId('EMP-12')).toBe(false);
            expect(isValidEmployeeId('')).toBe(false);
        });
    });

    describe('isValidVehicleNo', () => {
        it('should validate common Indian vehicle plate formats', () => {
            expect(isValidVehicleNo('KA-01-MG-1234')).toBe(true);
            expect(isValidVehicleNo('KA 05 MT 1122')).toBe(true);
            expect(isValidVehicleNo('KA01RS9988')).toBe(true);
        });

        it('should invalidate incorrect formats', () => {
            expect(isValidVehicleNo('KA-01-1234')).toBe(false);
            expect(isValidVehicleNo('A-01-MG-1234')).toBe(false);
            expect(isValidVehicleNo('')).toBe(false);
        });
    });
});
