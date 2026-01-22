import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { appointmentColumns } from "./appointmentColumns";
import { MOCK_APPOINTMENTS } from "@/constants/appointments";

export function AppointmentTable() {
  const table = useReactTable({
    data: MOCK_APPOINTMENTS,
    columns: appointmentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    /* The max-h-[240px] ensures it fits ~4 rows before scrolling */
    <div className="rounded-md border flex-1 overflow-y-auto max-h-30 relative">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-10 py-0 text-xs uppercase font-bold"
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="h-12">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-sm">
                No appointments.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
