import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Header from "../Header";
import GradientWrapper from "@/components/GradientWrapper";
import { CustomPatientTable } from "@/components/patients/CustomPatientTable";
import { StatCard } from "@/components/StatCard";
import { AppointmentTable } from "../appointments/AppointmentTable";
import { AlertItem } from "../AlertItem";
import { dashboardAppointmentColumns } from "../appointments/appointmentColumns";

import { usePatients } from "@/hooks/usePatients";
import { useAppointments } from "@/hooks/useAppointments";
import { useAlerts } from "@/hooks/useAlerts";

import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { patientsData, isPatientsLoading, patientsError } = usePatients();
  const { appointmentsData, isAppointmentsLoading } = useAppointments();
  const { alertsData, isAlertsLoading } = useAlerts();

  return (
    <>
      <GradientWrapper />
      <div className="min-h-screen lg:h-screen flex flex-col p-4 sm:p-6 lg:p-8 lg:overflow-hidden font-poppins">
        <div className="mx-auto w-full max-w-7xl flex flex-col h-full space-y-4 sm:space-y-6">
          <Header />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:flex-1 lg:min-h-0">
            <div className="flex flex-col gap-4 sm:gap-6 lg:h-full lg:min-h-0">
              {/* Quick Stats */}
              <Card className="lg:shrink-0">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <StatCard
                      title="Patients"
                      value={isPatientsLoading ? "..." : patientsData.length}
                    />
                    <StatCard
                      title="Alerts Today"
                      value={isAlertsLoading ? "..." : alertsData.length}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Patients List */}
              <Card className="flex flex-col lg:flex-1 lg:min-h-0">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
                    Patient Lists
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
                  <div className="h-96 sm:h-112 lg:h-full">
                    <CustomPatientTable
                      data={patientsData}
                      isLoading={isPatientsLoading}
                      error={patientsError}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 lg:h-full lg:min-h-0">
              {/* Upcoming Appointments Card */}
              <Card className="flex flex-col lg:flex-1 lg:min-h-0">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
                  <div className="h-80 sm:h-96 lg:h-full">
                    <AppointmentTable
                      columns={dashboardAppointmentColumns}
                      data={appointmentsData}
                      isLoading={isAppointmentsLoading}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Alerts Card */}
              <Card className="flex flex-col lg:flex-1 lg:min-h-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="lg:flex-1 lg:min-h-0 px-0 pb-2">
                  <div className="overflow-y-auto h-full px-6">
                    {isAlertsLoading ? (
                      <div className="flex items-center justify-center h-48 border rounded-md">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                        <p>Monitoring Live Alerts..</p>
                      </div>
                    ) : alertsData.length > 0 ? (
                      alertsData.map((alert) => (
                        <AlertItem alert={alert} showPatientName />
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full py-10">
                        <p className="text-sm text-muted-foreground italic">
                          No alerts for today
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
