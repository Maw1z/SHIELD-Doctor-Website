import { useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { allAppointmentColumns } from "@/components/appointments/appointmentColumns";
import { AppointmentTable } from "@/components/appointments/AppointmentTable";
import { AppointmentDialog } from "@/components/appointments/AppointmentDialog";
import Header from "../Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GradientWrapper from "../GradientWrapper";

export default function AppointmentsPage() {
  const { appointmentsData, isAppointmentsLoading, refresh } =
    useAppointments();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <GradientWrapper />
      <div className="min-h-screen lg:h-screen flex flex-col p-4 sm:p-6 lg:p-8 lg:overflow-hidden font-poppins">
        <div className="mx-auto w-full max-w-7xl flex flex-col h-full space-y-4">
          <Header />

          <Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-col md:flex-row lg:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <CardTitle className="text-2xl lg:text-3xl">
                Appointments
              </CardTitle>
              <Button
                onClick={() => setDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 overflow-hidden pb-4">
              <div className="h-125 lg:h-full">
                <AppointmentTable
                  columns={allAppointmentColumns}
                  data={appointmentsData}
                  isLoading={isAppointmentsLoading}
                />
              </div>
            </CardContent>
          </Card>

          <AppointmentDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSuccess={refresh}
          />
        </div>
      </div>
    </>
  );
}
