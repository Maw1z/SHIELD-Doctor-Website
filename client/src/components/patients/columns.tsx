import { type ColumnDef } from "@tanstack/react-table";
import { type Patient } from "@/constants/patients";
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

const statusColors = {
  Stable: "bg-green-500",
  "For Watch": "bg-yellow-500",
  Critical: "bg-red-500",
};

export const allColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0 hover:bg-transparent font-bold"
      >
        Patient Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => <div className="text-sm">{row.getValue("dob")}</div>,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <div className="text-sm">{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("phone_number")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusColors;
      return (
        <div className="flex gap-2 items-center">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "lastCheck",
    header: "Last Check",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-xs">
        {row.getValue("lastCheck")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;
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
              onClick={() => navigate(`/patients/${patient.id}`)}
              className="cursor-pointer"
            >
              View Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const dashboardColumns: ColumnDef<Patient>[] = [
  allColumns[0], // name
  allColumns[7], // status
  allColumns[8], // lastCheck
  allColumns[9], // actions
];

export const columns = dashboardColumns;
