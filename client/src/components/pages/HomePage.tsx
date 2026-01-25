import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Header from "../Header";
import GradientWrapper from "@/components/GradientWrapper";
import { CustomPatientTable } from "@/components/patients/CustomPatientTable";
import { StatCard } from "@/components/StatCard";
import { AppointmentTable } from "../appointments/AppointmentTable";

import { usePatients } from "@/hooks/usePatients";

export default function HomePage() {
  const { data, isLoading, error } = usePatients();

  return (
    <>
      <GradientWrapper />
      <div className="h-screen flex flex-col p-8 overflow-hidden font-poppins">
        <div className="mx-auto w-full max-w-7xl flex flex-col h-full">
          <Header />
          <div className="grid grid-cols-2 gap-6 flex-1 min-h-0 pb-4">
            <div className="flex flex-col gap-6 h-full min-h-0">
              {/* Quick Stats */}
              <Card className="shrink-0">
                <CardHeader>
                  <CardTitle className="text-3xl">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      title="Patients"
                      value={isLoading ? "..." : data.length}
                    />
                    <StatCard title="Alerts" value={2} />
                  </div>
                </CardContent>
              </Card>

              {/* Patients List */}
              <Card className="flex-1 min-h-0 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-3xl">Patient Lists</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-hidden pb-2">
                  <CustomPatientTable
                    data={data}
                    isLoading={isLoading}
                    error={error}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-6 h-full min-h-0">
              {/* Upcoming Appointments Card */}
              <Card className="shrink-0 flex flex-col min-h-0">
                <CardHeader className="">
                  <CardTitle className="text-3xl">
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <AppointmentTable />
                </CardContent>
              </Card>

              <Card className="flex-1 min-h-0 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-3xl">Empty Card</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto text-sm text-muted-foreground italic">
                  To add something here later
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
