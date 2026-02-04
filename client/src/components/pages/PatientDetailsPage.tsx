import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  Loader2,
  Sparkles,
} from "lucide-react";

import Header from "../Header";
import GradientWrapper from "../GradientWrapper";
import VitalsAndTrends from "../patient_details/VitalsAndTrends";
import PhysicalBiometrics from "../patient_details/PhysicalBiometrics";
import PatientDetails from "../patient_details/PatientDetails";
import MonitoringStatus from "../patient_details/MonitoringStatus";
import DoctorNotes from "../patient_details/DoctorNotes";
import UpcomingAppointments from "../patient_details/UpcomingAppointments";
import PatientNotFoundPage from "./PatientNotFoundPage";
import RiskAssessment from "../patient_details/RiskAssessment";

export default function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPatientData(user.uid);
      } else {
        setIsLoading(false);
        setError(true);
      }
    });

    const fetchPatientData = async (doctorUid: string) => {
      if (!id) return;
      try {
        setIsLoading(true);
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/patient`, {
          params: {
            uuid: id,
            doctor_id: doctorUid,
          },
        });
        setPatient(response.data);
        setError(false);
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    return () => unsubscribe();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !patient) {
    return <PatientNotFoundPage />;
  }

  return (
    <div className="relative min-h-screen w-full">
      <GradientWrapper />

      <div className="relative z-10 flex flex-col p-4 sm:p-6 lg:p-8 font-poppins text-slate-900">
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
            <CardContent className="flex flex-col md:flex-row items-center justify-start gap-6 md:gap-12">
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

          {/* AI Risk Assessment Card */}
          <Card className="w-full shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Driven Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiskAssessment riskData={patient.risk_data} />
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
                  <MonitoringStatus
                    riskScore={patient.risk_score}
                    lastSeen={patient.last_seen}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-xs uppercase flex items-center gap-2 tracking-widest">
                    <FileText className="h-5 w-5" /> Doctor Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs">
                  <DoctorNotes notes={patient.doctor_notes} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-xs uppercase flex items-center gap-2 tracking-widest">
                    <CalendarDays className="h-4 w-4" /> Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UpcomingAppointments
                    appointments={patient.upcoming_appointments}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
