import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { type Patient } from "@/constants/patients";
import apiClient from "@/api/apiClient";

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
        fetchPatients();
      } else {
        setIsPatientsLoading(false);
        setPatientsError("No authenticated user found.");
      }
    });

    const fetchPatients = async () => {
      try {
        setIsPatientsLoading(true);

        const response = await apiClient.get<ApiResponse>(`/patient-doctor`);

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
