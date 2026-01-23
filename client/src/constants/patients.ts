export type Patient = {
  id: string;
  name: string;
  dob: string;
  gender: string;
  phone_number: string;
  email: string;
  height: number;
  weight: number;
  status: "For Watch" | "Stable" | "Critical";
  lastCheck: string;
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    dob: "1985-03-15",
    gender: "Male",
    phone_number: "+1234567890",
    email: "john.doe@email.com",
    height: 175,
    weight: 70,
    status: "Stable",
    lastCheck: "2026-01-22 10:30 AM",
  },
  {
    id: "2",
    name: "Jane Smith",
    dob: "1990-07-22",
    gender: "Female",
    phone_number: "+1234567891",
    email: "jane.smith@email.com",
    height: 165,
    weight: 60,
    status: "Critical",
    lastCheck: "2026-01-22 02:45 PM",
  },
  {
    id: "3",
    name: "Robert Brown",
    dob: "1978-11-30",
    gender: "Male",
    phone_number: "+1234567892",
    email: "robert.brown@email.com",
    height: 180,
    weight: 85,
    status: "For Watch",
    lastCheck: "2026-01-21 09:00 AM",
  },
  {
    id: "4",
    name: "Alice Johnson",
    dob: "1995-05-18",
    gender: "Female",
    phone_number: "+1234567893",
    email: "alice.j@email.com",
    height: 168,
    weight: 58,
    status: "Stable",
    lastCheck: "2026-01-22 11:15 AM",
  },
  {
    id: "5",
    name: "Charlie Davis",
    dob: "1982-09-05",
    gender: "Male",
    phone_number: "+1234567894",
    email: "charlie.d@email.com",
    height: 177,
    weight: 75,
    status: "Stable",
    lastCheck: "2026-01-22 12:00 PM",
  },
  {
    id: "6",
    name: "Eva Elfi",
    dob: "1988-12-12",
    gender: "Female",
    phone_number: "+1234567895",
    email: "eva.elfi@email.com",
    height: 162,
    weight: 55,
    status: "Critical",
    lastCheck: "2026-01-22 01:20 PM",
  },
  {
    id: "7",
    name: "Frank Green",
    dob: "1992-04-25",
    gender: "Male",
    phone_number: "+1234567896",
    email: "frank.g@email.com",
    height: 183,
    weight: 90,
    status: "For Watch",
    lastCheck: "2026-01-21 03:30 PM",
  },
];
