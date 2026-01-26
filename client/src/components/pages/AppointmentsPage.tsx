import { useState, useEffect, use } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Plus, Settings2 } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { type Appointment } from "@/constants/appointments";
import { allAppointmentColumns } from "@/components/appointments/appointmentColumns";
import { AppointmentDialog } from "@/components/appointments/AppointmentDialog";
import GradientWrapper from "../GradientWrapper";
import Header from "../Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppointmentsPage() {
  const [data, setData] = useState<Appointment[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async (doctorUuid: string) => {
    try {
      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
      const res = await axios.get(`${baseUrl}/v1/appointments`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAppointments(user.uid);
      } else {
        setIsLoading(false);
        setError("No authenticated user found.");
      }
    });
    return () => unsubscribe();
  }, []);

  const table = useReactTable({
    data,
    columns: allAppointmentColumns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <GradientWrapper />

      <div className="h-screen flex flex-col p-8 overflow-hidden font-poppins">
        <div className="mx-auto w-full max-w-7xl flex flex-col h-full">
          <Header />

          <Card>
            <CardTitle>
              <h1 className="text-2xl font-bold">Appointments</h1>
            </CardTitle>

            <CardContent>
              <div className="flex gap-2 mb-4">
                {/* Column Visibility Toggle */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings2 className="mr-2 h-4 w-4" /> View
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((col) => col.getCanHide())
                      .map((col) => (
                        <DropdownMenuCheckboxItem
                          key={col.id}
                          className="capitalize"
                          checked={col.getIsVisible()}
                          onCheckedChange={(val) => col.toggleVisibility(!!val)}
                        >
                          {col.id.replace("_", " ")}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Appointment
                </Button>
              </div>

              <div className="rounded-md border bg-white">
                <Table>
                  <TableHeader>
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
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
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
                          colSpan={allAppointmentColumns.length}
                          className="h-24 text-center"
                        >
                          No appointments found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <AppointmentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={fetchAppointments}
        />
      </div>
    </>
  );
}
