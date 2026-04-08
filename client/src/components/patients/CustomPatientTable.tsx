import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { dashboardColumns } from "./patientColumns";
import { type Patient } from "@/constants/patients";
import { Loader2 } from "lucide-react";

interface CustomPatientTableProps {
  columns?: ColumnDef<Patient>[];
  data: Patient[];
  isLoading: boolean;
  error: string | null;
}

export function CustomPatientTable({
  columns = dashboardColumns,
  data,
  isLoading,
  error,
}: CustomPatientTableProps) {
  // 1. Initial sorting: 'asc' ensures 0 (High) comes before 3 (Stable)
  const [sorting, setSorting] = useState<SortingState>([
    { id: "status", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
    // Custom sorting logic to ensure high is always first
    sortingFns: {
      statusPriority: (rowA, rowB, columnId) => {
        const valA = rowA.getValue(columnId) as string;
        const valB = rowB.getValue(columnId) as string;

        const priority: Record<string, number> = {
          High: 0,
          Medium: 1,
          Low: 2,
          Stable: 3,
        };

        const aPriority = priority[valA] ?? 99;
        const bPriority = priority[valB] ?? 99;

        return aPriority - bPriority;
      },
    },
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
        <p>Fetching Patients..</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-3 sm:space-y-4">
      <div className="relative">
        <Input
          placeholder="Search patients..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="w-full text-sm sm:text-base shrink-0"
          aria-label="Search patients by name"
        />
      </div>
      <div className="rounded-md border flex-1 overflow-auto min-h-0">
        <Table aria-label="Patient list">
          <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs sm:text-sm whitespace-nowrap"
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
            {error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 sm:h-24 text-center text-red-500 text-xs sm:text-sm"
                  role="alert"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-2 sm:py-3 text-xs sm:text-sm"
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
                  role="status"
                >
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
