import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Header from "../Header";
import GradientWrapper from "../GradientWrapper";

export default function PatientPage() {
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
                <CardTitle>Patients</CardTitle>
                <CardDescription>Manage your patient records</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Patient list and management features go here</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
