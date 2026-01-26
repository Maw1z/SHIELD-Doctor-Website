import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export interface Appointment {
  appointment_id: number;
  doctor_id: string;
  patient_id: string;
  title: string;
  appointment_datetime: string;
  patient_last_checked: string | null;
  created_at: string;
  updated_at: string;
}

export const allAppointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "appointment_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("appointment_id")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0 hover:bg-transparent font-bold"
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "patient_id",
    header: "Patient ID",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("patient_id")}</div>
    ),
  },
  {
    accessorKey: "doctor_id",
    header: "Doctor ID",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("doctor_id")}</div>
    ),
  },
  {
    accessorKey: "appointment_datetime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0 hover:bg-transparent font-bold"
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
    accessorKey: "patient_last_checked",
    header: "Last Checked",
    cell: ({ row }) => {
      const date = row.getValue("patient_last_checked") as string | null;
      if (!date)
        return <div className="text-muted-foreground text-xs">Never</div>;

      const formatted = new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div className="text-muted-foreground text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      const formatted = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return <div className="text-xs text-muted-foreground">{formatted}</div>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as string;
      const formatted = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return <div className="text-xs text-muted-foreground">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original;
      const navigate = useNavigate();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigate(`/appointments/${appointment.appointment_id}`)
              }
              className="cursor-pointer"
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const dashboardAppointmentColumns: ColumnDef<Appointment>[] = [
  allAppointmentColumns[1], // title
  allAppointmentColumns[2], // patient_id
  allAppointmentColumns[4], // appointment_datetime
];

export const appointmentColumns = dashboardAppointmentColumns;
