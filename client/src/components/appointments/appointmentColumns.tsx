import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export interface Appointment {
  appointment_id: number;
  patient_name: string;
  doctor_id: string;
  patient_id: string;
  title: string;
  appointment_datetime: string;
  patient_last_checked: string | null;
  created_at: string;
}

export const allAppointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0 hover:bg-transparent"
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "patient_name",
    header: "Patient Name",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("patient_name")}</div>
    ),
  },
  {
    accessorKey: "appointment_datetime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0 hover:bg-transparent"
      >
        Date & Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const datetime = row.getValue("appointment_datetime") as string;
      const formatted = new Date(datetime).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div className="text-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: "last_seen",
    header: "Last Checked",
    cell: ({ row }) => {
      const date = row.getValue("last_seen") as string | null;
      if (!date)
        return (
          <div className="text-muted-foreground text-xs italic">
            First Visit
          </div>
        );

      const formatted = new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div className="text-muted-foreground text-xs">{formatted}</div>;
    },
  },
];

export const dashboardAppointmentColumns: ColumnDef<Appointment>[] = [
  allAppointmentColumns[0], // title
  allAppointmentColumns[1], // patient name
  allAppointmentColumns[2], // appoint date time
];

export const appointmentColumns = dashboardAppointmentColumns;
