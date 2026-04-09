import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { type User, getAuth, onAuthStateChanged } from "firebase/auth";
import apiClient from "@/api/apiClient";

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
  ShieldAlert,
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
import PatientAlerts from "../patient_details/PatientAlerts";

export default function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPatientData = async () => {
    if (!id) return;
    try {
      const response = await apiClient.get(`/patient`, {
        params: { uuid: id },
      });

      setPatient(response.data);
      setError(false);
    } catch (err) {
      console.error("Error fetching patient:", err);
      const axiosError = err as AxiosError;
      if (axiosError.response && axiosError.response.status === 403) {
        navigate("/forbidden");
        return;
      }
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        fetchPatientData();
      } else {
        setIsLoading(false);
        setError(true);
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <GradientWrapper />
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

      <main className="relative z-10 flex flex-col p-4 sm:p-6 lg:p-8 font-poppins text-slate-900">
        <div className="mx-auto w-full max-w-7xl flex flex-col gap-6">
          <Header />

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Patient Profile
            </h1>
          </div>

          {/* Patient Details */}
          <section aria-labelledby="personal-info-title">
            <Card className="w-full shadow-sm">
              <CardHeader className="border-b">
                <CardTitle
                  id="personal-info-title"
                  className="flex items-center gap-2"
                >
                  <Contact2
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-start gap-6 md:gap-12">
                <PatientDetails patient={patient} />
              </CardContent>
            </Card>
          </section>

          {/* Physical Biometrics */}
          <section aria-labelledby="biometrics-title">
            <Card className="w-full shadow-sm">
              <CardHeader className="border-b">
                <CardTitle
                  id="biometrics-title"
                  className="flex items-center gap-2"
                >
                  <Fingerprint
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Physical Biometrics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <PhysicalBiometrics patient={patient} />
              </CardContent>
            </Card>
          </section>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-10">
            {/* Vitals Main Card */}
            <section className="lg:col-span-3" aria-labelledby="vitals-title">
              {/* AI Risk Assessment Card */}
              <Card className="w-full shadow-sm mb-4">
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
              <Card className="flex flex-col h-fit">
                <CardHeader>
                  <CardTitle
                    id="vitals-title"
                    className="flex items-center gap-2"
                  >
                    <Activity
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                    Vitals & Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="border-t pt-6">
                  <VitalsAndTrends />
                </CardContent>
              </Card>
            </section>

            {/* Sidebar */}
            <aside
              className="lg:col-span-1 flex flex-col gap-6"
              aria-label="Patient Status Summary"
            >
              <section aria-labelledby="monitoring-title">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle
                      id="monitoring-title"
                      className="text-xs uppercase flex items-center gap-2 tracking-widest"
                    >
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />{" "}
                      Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MonitoringStatus
                      lastSeen={patient.last_seen}
                      riskLabel={patient.risk_label}
                    />
                  </CardContent>
                </Card>
              </section>

              <section aria-labelledby="alerts-sidebar-title">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle
                      id="alerts-sidebar-title"
                      className="text-xs uppercase flex items-center gap-2 tracking-widest"
                    >
                      <ShieldAlert className="h-5 w-5" aria-hidden="true" />{" "}
                      Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PatientAlerts alerts={patient.alerts} />
                  </CardContent>
                </Card>
              </section>

              <section aria-labelledby="notes-title">
                <Card className="relative">
                  <CardHeader className="border-b">
                    <CardTitle
                      id="notes-title"
                      className="text-xs uppercase flex items-center gap-2 tracking-widest"
                    >
                      <FileText className="h-5 w-5" aria-hidden="true" /> Doctor
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <DoctorNotes
                      notes={patient.doctor_notes || []}
                      patientId={patient.uuid}
                      onNotesChanged={fetchPatientData}
                    />
                  </CardContent>
                </Card>
              </section>

              <section aria-labelledby="upcoming-appointments-title">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle
                      id="upcoming-appointments-title"
                      className="text-xs uppercase flex items-center gap-2 tracking-widest"
                    >
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />{" "}
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UpcomingAppointments
                      appointments={patient.upcoming_appointments}
                    />
                  </CardContent>
                </Card>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
