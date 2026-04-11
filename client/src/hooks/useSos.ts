import { useState, useEffect, useCallback, useMemo } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import apiClient from "@/api/apiClient";

export interface SosEvent {
  event_id: number;
  patient_id: string;
  patient_name?: string;
  latitude: number;
  longitude: number;
  vitals_snapshot: Record<string, any> | null;
  created_at: string;
}

export function useSos() {
  const [allSosEvents, setAllSosEvents] = useState<SosEvent[]>([]);
  const [isSosLoading, setIsSosLoading] = useState(true);
  const [sosError, setSosError] = useState<string | null>(null);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const fetchSosEvents = useCallback(async () => {
    setSosError(null);
    try {
      const response = await apiClient.get("/sos/doctor");
      setAllSosEvents(response.data.events);
    } catch (err: any) {
      console.error("Error fetching SOS events:", err);
      setSosError(err.response?.data?.error || "Failed to load SOS events");
    } finally {
      setIsSosLoading(false);
    }
  }, []);

  const sosData = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return allSosEvents.filter(
      (event) => event.created_at && event.created_at.startsWith(today),
    );
  }, [allSosEvents]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUid(user.uid);
        fetchSosEvents();
      } else {
        setIsSosLoading(false);
        setSosError("No authenticated user");
      }
    });

    return () => unsubscribe();
  }, [fetchSosEvents]);

  useEffect(() => {
    if (!currentUid) return;

    const interval = setInterval(() => {
      fetchSosEvents();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUid, fetchSosEvents]);

  return {
    sosData,
    sosCountToday: sosData.length,
    isSosLoading,
    sosError,
    refresh: () => currentUid && fetchSosEvents(),
  };
}
