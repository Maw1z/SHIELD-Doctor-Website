import { type ColumnDef } from "@tanstack/react-table";
import { type Patient } from "@/constants/patients";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { getStatusFromScore } from "@/utils/getStatusFromScore";

const statusColors = {
  Stable: "bg-green-500",
  "For Watch": "bg-yellow-500",
  Critical: "bg-red-500",
};

export const allColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: "Patient Name",
    cell: ({ row }) => <div className="text-sm">{row.getValue("name")}</div>,
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
    accessorKey: "risk_score",
    id: "status",
    header: "Status",
    sortingFn: "alphanumeric",
    cell: ({ row }) => {
      const score = row.getValue("status") as number;
      const status = getStatusFromScore(score);
      return (
        <div className="flex gap-2 items-center">
          <div
            className={`w-2 h-2 rounded-full ${
              statusColors[status as keyof typeof statusColors]
            }`}
          />
          <span className="text-sm">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "last_seen",
    header: "Last Seen",
    cell: ({ row }) => {
      const date = row.getValue("last_seen") as string;
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
              onClick={() => navigate(`/patients/${patient.uuid}`)}
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
  allColumns[0], // "name"
  allColumns[4], // "status" (mapped to risk_score)
  allColumns[5], // "lastCheck"
  allColumns[6], // "actions"
];

export const columns = dashboardColumns;
