import { type ColumnDef } from "@tanstack/react-table";
import { type Appointment } from "@/constants/appointments";

export const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patientName",
    header: "Appointment With",
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.getValue("patientName")}</div>
    ),
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => <div className="text-sm">{row.getValue("time")}</div>,
  },
  {
    accessorKey: "regarding",
    header: "Regarding",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground truncate max-w-[100px]">
        {row.getValue("regarding")}
      </div>
    ),
  },
];
