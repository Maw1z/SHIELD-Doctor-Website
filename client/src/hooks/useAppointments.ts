import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { type Appointment } from "@/constants/appointments";

export function useAppointments() {
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null,
  );
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (doctorUuid: string) => {
    setIsAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
      const res = await axios.get(`${baseUrl}/appointments`, {
        params: { doctor_id: doctorUuid },
      });
      setAppointmentsData(res.data);
    } catch (err: any) {
      setAppointmentsError(
        err.response?.data?.error || "Failed to load appointments",
      );
    } finally {
      setIsAppointmentsLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUid(user.uid);
        fetchAppointments(user.uid);
      } else {
        setIsAppointmentsLoading(false);
        setAppointmentsError("No authenticated user");
      }
    });
    return () => unsubscribe();
  }, [fetchAppointments]);

  return {
    appointmentsData,
    isAppointmentsLoading,
    appointmentsError,
    currentUid,
    refresh: () => currentUid && fetchAppointments(currentUid),
  };
}
