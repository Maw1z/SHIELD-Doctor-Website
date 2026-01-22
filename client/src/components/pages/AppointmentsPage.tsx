import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Header from "../Header";
import GradientWrapper from "../GradientWrapper";

export default function AppointmentsPage() {
  return (
    <>
      <GradientWrapper />
      <div className="h-screen flex flex-col p-8 overflow-hidden font-poppins">
        <div className="mx-auto w-full max-w-7xl flex flex-col h-full">
          <Header />
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between"></div>

            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Appointment list and management features go here</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
