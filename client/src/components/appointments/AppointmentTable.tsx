import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface AppointmentTableProps {
  columns: any[];
  data: any[];
  isLoading?: boolean;
}

export function AppointmentTable({
  columns,
  data,
  isLoading,
}: AppointmentTableProps) {
  const upcomingData = useMemo(() => {
    const now = new Date().getTime();
    return data.filter((appointment) => {
      const appointmentTime = new Date(
        appointment.appointment_datetime,
      ).getTime();
      return appointmentTime > now;
    });
  }, [data]);

  // Setting default sorting to show the closest appointment first
  const [sorting, setSorting] = useState<SortingState>([
    { id: "appointment_datetime", desc: false },
  ]);

  const table = useReactTable({
    data: upcomingData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-48 border rounded-md"
        role="status"
        aria-busy="true"
      >
        <Loader2
          className="h-6 w-6 animate-spin text-primary mr-2"
          aria-hidden="true"
        />
        <p>Fetching Appointments..</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Table aria-label="Upcoming Appointments">
          <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-9 sm:h-10 py-0 text-xs sm:text-sm"
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : "none"
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-2 sm:py-3 text-xs sm:text-sm font-light"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 sm:h-24 text-center text-xs sm:text-sm"
                >
                  No upcoming appointments.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
