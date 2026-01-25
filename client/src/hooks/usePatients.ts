import { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { type Patient } from "@/constants/patients";

interface ApiResponse {
  doctor_uuid: string;
  patients: Patient[];
}

export function usePatients() {
  const [data, setData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPatients(user.uid);
      } else {
        setIsLoading(false);
        setError("No authenticated user found.");
      }
    });

    const fetchPatients = async (doctorUuid: string) => {
      try {
        setIsLoading(true);
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
        const response = await axios.get<ApiResponse>(
          `${baseUrl}/v1/patient-doctor`,
          { params: { doctor_uuid: doctorUuid } },
        );
        setData(response.data.patients);
        setError(null);
      } catch (err) {
        setError("Failed to load patient data.");
      } finally {
        setIsLoading(false);
      }
    };

    return () => unsubscribe();
  }, []);

  return { data, isLoading, error };
}
