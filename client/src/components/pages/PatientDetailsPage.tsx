import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Activity,
  ShieldCheck,
  CalendarDays,
  FileText,
  Contact2,
  Fingerprint,
} from "lucide-react";

import Header from "../Header";
import GradientWrapper from "../GradientWrapper";
import VitalsAndTrends from "../patient_details/VitalsAndTrends";
import PhysicalBiometrics from "../patient_details/PhysicalBiometrics";
import PatientDetails from "../patient_details/PatientDetails";
import MonitoringStatus from "../patient_details/MonitoringStatus";
import DoctorNotes from "../patient_details/DoctorNotes";
import UpcomingAppointments from "../patient_details/UpcomingAppointments";

import { MOCK_PATIENTS } from "@/constants/patients";

export default function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const patient = MOCK_PATIENTS.find((p) => p.id === id);

  const navigate = useNavigate();

  if (!patient) return <div className="p-8 text-center">Patient not found</div>;

  return (
    <div className="relative min-h-screen w-full">
      <GradientWrapper />

      <div className="relative z-10 flex flex-col p-4 md:p-8 font-poppins text-slate-900">
        <div className="mx-auto w-full max-w-7xl flex flex-col gap-6">
          <Header />

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Patient Profile
            </h1>
          </div>

          {/* Patient Details */}
          <Card className="w-full shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Contact2 className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-start gap-6 md:gap-12 ">
              <PatientDetails patient={patient} />
            </CardContent>
          </Card>

          {/* Physical Biometrics */}
          <Card className="w-full shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-primary" />
                Physical Biometrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <PhysicalBiometrics patient={patient} />
            </CardContent>
          </Card>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-10">
            {/* Vitals Main Card */}
            <Card className="lg:col-span-3 flex flex-col h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Vitals & Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="border-t pt-6">
                <VitalsAndTrends />
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-xs uppercase flex items-center gap-2 tracking-widest">
                    <ShieldCheck className="h-5 w-5" /> Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MonitoringStatus patient={patient} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-xs uppercase flex items-center gap-2 tracking-widest">
                    <FileText className="h-5 w-5" /> Doctor Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs">
                  <DoctorNotes />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-xs uppercase flex items-center gap-2 tracking-widest">
                    <CalendarDays className="h-4 w-4" /> Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UpcomingAppointments patient={patient} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
