import { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { type Patient } from "@/constants/patients";

interface ApiResponse {
  doctor_uuid: string;
  patients: Patient[];
}

export function usePatients() {
  const [patientsData, setPatientsData] = useState<Patient[]>([]);
  const [isPatientsLoading, setIsPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPatients(user.uid);
      } else {
        setIsPatientsLoading(false);
        setPatientsError("No authenticated user found.");
      }
    });

    const fetchPatients = async (doctorUuid: string) => {
      try {
        setIsPatientsLoading(true);
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
        const response = await axios.get<ApiResponse>(
          `${baseUrl}/v1/patient-doctor`,
          { params: { doctor_uuid: doctorUuid } },
        );
        setPatientsData(response.data.patients);
        setPatientsError(null);
      } catch (err) {
        setPatientsError("Failed to load patient data.");
      } finally {
        setIsPatientsLoading(false);
      }
    };

    return () => unsubscribe();
  }, []);

  return { patientsData, isPatientsLoading, patientsError };
}
