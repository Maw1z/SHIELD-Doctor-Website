import { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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

interface CustomPatientTableProps {
  columns?: ColumnDef<Patient>[];
}

export function CustomPatientTable({
  columns = dashboardColumns,
}: CustomPatientTableProps) {
  const [data, setData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    const auth = getAuth();

    // Use onAuthStateChanged to ensure the user is loaded before fetching
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPatients(user.uid);
      } else {
        setIsLoading(false);
        setError("No authenticated user found.");
      }
    });

    const fetchPatients = async (doctorUuid: string) => {
      try {
        setIsLoading(true);

        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

        const response = await axios.get<Patient[]>(
          `${baseUrl}/v1/patient-doctor`,
          {
            params: { doctor_uuid: "loqRHSKxgyWXMYTirfDGsOk4s3f2" },
          },
        );

        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Axios error:", err);
        setError("Failed to load patient data.");
      } finally {
        setIsLoading(false);
      }
    };

    return () => unsubscribe();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      <Input
        placeholder="Search patients..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("name")?.setFilterValue(e.target.value)
        }
        className="max-w-sm shrink-0"
      />
      <div className="rounded-md border overflow-y-auto flex-1">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
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
                  className="h-24 text-center"
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
