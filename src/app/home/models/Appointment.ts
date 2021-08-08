export interface Appointment {
  id: number;
  patientId: string;
  patientName: string;
  service: string;
  date: Date;
  isCancelled: boolean;
  isCompleted: boolean;
}
