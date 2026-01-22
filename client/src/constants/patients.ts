export type Patient = {
  id: string;
  name: string;
  status: "For Watch" | "Stable" | "Critical";
  lastCheck: string;
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    status: "Stable",
    lastCheck: "2026-01-22 10:30 AM",
  },
  {
    id: "2",
    name: "Jane Smith",
    status: "Critical",
    lastCheck: "2026-01-22 02:45 PM",
  },
  {
    id: "3",
    name: "Robert Brown",
    status: "For Watch",
    lastCheck: "2026-01-21 09:00 AM",
  },
  {
    id: "4",
    name: "Alice Johnson",
    status: "Stable",
    lastCheck: "2026-01-22 11:15 AM",
  },
  {
    id: "5",
    name: "Charlie Davis",
    status: "Stable",
    lastCheck: "2026-01-22 12:00 PM",
  },
  {
    id: "6",
    name: "Eva Elfi",
    status: "Critical",
    lastCheck: "2026-01-22 01:20 PM",
  },
  {
    id: "7",
    name: "Frank Green",
    status: "For Watch",
    lastCheck: "2026-01-21 03:30 PM",
  },
];
