export interface Appointment {
  id: number;
  patientId: string;
  patientName: string;
  service: string;
  date: string;
  isCancelled: boolean;
  isCompleted: boolean;
}
