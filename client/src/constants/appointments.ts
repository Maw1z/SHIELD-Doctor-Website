export type Appointment = {
  id: string;
  patientName: string;
  time: string;
  regarding: string;
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    patientName: "John Doe",
    time: "10:30 AM",
    regarding: "Checkup",
  },
  {
    id: "a2",
    patientName: "Jane Smith",
    time: "11:45 AM",
    regarding: "Blood Test",
  },
  {
    id: "a3",
    patientName: "Robert Brown",
    time: "02:00 PM",
    regarding: "Follow-up",
  },
  {
    id: "a4",
    patientName: "Emily Davis",
    time: "10:00 PM",
    regarding: "Checkup",
  },
  {
    id: "a5",
    patientName: "Michael Wilson",
    time: "03:15 PM",
    regarding: "Consultation",
  },
  {
    id: "a6",
    patientName: "Sarah Johnson",
    time: "01:30 PM",
    regarding: "Blood Test",
  },
  {
    id: "a7",
    patientName: "David Lee",
    time: "09:00 AM",
    regarding: "Follow-up",
  },
];
