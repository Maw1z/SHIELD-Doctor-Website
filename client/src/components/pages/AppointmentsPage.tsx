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
      <div className="h-screen flex flex-col p-8 overflow-hidden font-poppins">
        <div className="mx-auto w-full max-w-7xl flex flex-col h-full">
          <Header />
          <Card className="flex-1 min-h-0 flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-3xl">Appointments</CardTitle>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2" />
                New Appointment
              </Button>
            </CardHeader>
            <CardContent>
              <AppointmentTable
                columns={allAppointmentColumns}
                data={appointmentsData}
                isLoading={isAppointmentsLoading}
              />
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
