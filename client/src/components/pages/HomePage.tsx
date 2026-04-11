import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Header from "../Header";
import GradientWrapper from "@/components/GradientWrapper";
import { CustomPatientTable } from "@/components/patients/CustomPatientTable";
import { StatCard } from "@/components/StatCard";
import { AppointmentTable } from "../appointments/AppointmentTable";
import { AlertItem } from "../AlertItem";
import { SosAlertItem } from "@/components/SosAlertItem";
import { dashboardAppointmentColumns } from "../appointments/appointmentColumns";
import { AlertDrawerSection } from "../AlertDrawerSection";

import { usePatients } from "@/hooks/usePatients";
import { useAppointments } from "@/hooks/useAppointments";
import { useAlerts } from "@/hooks/useAlerts";
import { useSos } from "@/hooks/useSos";

export default function HomePage() {
  const { patientsData, isPatientsLoading, patientsError } = usePatients();
  const { appointmentsData, isAppointmentsLoading } = useAppointments();
  const { alertsData, isAlertsLoading } = useAlerts();
  const { sosData, isSosLoading } = useSos();

  return (
    <>
      <div className="md:fixed lg:fixed md:inset-0 lg:inset-0 md:overflow-hidden lg:overflow-hidden">
        {" "}
        {/* Strict Lockdown */}
        <GradientWrapper />
        <main className="min-h-screen lg:h-screen flex flex-col p-4 sm:p-6 lg:p-8 lg:overflow-hidden font-poppins">
          <div className="mx-auto w-full max-w-7xl flex flex-col h-full space-y-4 sm:space-y-6">
            <Header />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:flex-1 lg:min-h-0">
              <div className="flex flex-col gap-4 sm:gap-6 lg:h-full lg:min-h-0">
                {/* Quick Stats */}
                <section
                  className="contents"
                  aria-labelledby="quick-stats-title"
                >
                  <Card className="lg:shrink-0">
                    <CardHeader>
                      <CardTitle
                        id="quick-stats-title"
                        className="text-xl sm:text-2xl lg:text-3xl"
                      >
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <StatCard
                          title="Patients"
                          value={
                            isPatientsLoading ? "..." : patientsData.length
                          }
                        />
                        <StatCard
                          title="Alerts Today"
                          value={isAlertsLoading ? "..." : alertsData.length}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Patients List */}
                <section
                  className="contents"
                  aria-labelledby="patient-list-title"
                >
                  <Card className="flex flex-col lg:flex-1 lg:min-h-0">
                    <CardHeader>
                      <CardTitle
                        id="patient-list-title"
                        className="text-xl sm:text-2xl lg:text-3xl"
                      >
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
                </section>
              </div>

              <div className="flex flex-col gap-4 sm:gap-6 lg:h-full lg:min-h-0">
                {/* Upcoming Appointments Card */}
                <section
                  className="contents"
                  aria-labelledby="appointments-title"
                >
                  <Card className="flex flex-col lg:flex-[0.4] lg:min-h-0">
                    <CardHeader>
                      <CardTitle
                        id="appointments-title"
                        className="text-xl sm:text-2xl lg:text-3xl"
                      >
                        Upcoming Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
                      <div className="h-64 sm:h-96 lg:h-full">
                        <AppointmentTable
                          columns={dashboardAppointmentColumns}
                          data={appointmentsData}
                          isLoading={isAppointmentsLoading}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Alerts Card */}
                <section className="contents" aria-labelledby="alerts-title">
                  <Card className="flex flex-col lg:flex-[0.6] min-h-0 overflow-y-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle
                        id="alerts-title"
                        className="text-xl sm:text-2xl lg:text-3xl"
                      >
                        Alerts
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 min-h-0 overflow-y-auto pb-4">
                      {/* SOS Alerts Drawer */}
                      <AlertDrawerSection
                        title="SOS Alerts"
                        count={sosData.length}
                        isLoading={isSosLoading}
                        countColorClass="bg-red-100 text-red-700"
                        emptyMessage="No SOS events for today"
                        defaultOpen
                      >
                        {sosData.map((event) => (
                          // @ts-expect-error ignore
                          <SosAlertItem event={event} showPatientName />
                        ))}
                      </AlertDrawerSection>

                      {/* Vital Alerts Drawer */}
                      <AlertDrawerSection
                        title="Vital Alerts"
                        count={alertsData.length}
                        isLoading={isAlertsLoading}
                        countColorClass="bg-amber-100 text-amber-700"
                        emptyMessage="No alerts for today"
                        defaultOpen
                      >
                        {alertsData.map((alert) => (
                          <AlertItem alert={alert} showPatientName />
                        ))}
                      </AlertDrawerSection>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
