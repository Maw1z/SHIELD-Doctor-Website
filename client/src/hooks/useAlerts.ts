import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function useAlerts() {
  const [allAlerts, setAllAlerts] = useState([]);
  const [isAlertsLoading, setIsAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

  const fetchAlerts = useCallback(
    async (doctorUuid: string) => {
      setAlertsError(null);
      try {
        const response = await axios.get(
          `${baseUrl}/alerts?doctor_id=${doctorUuid}`,
        );
        setAllAlerts(response.data);
      } catch (err: any) {
        console.error("Error fetching alerts:", err);
        setAlertsError(err.response?.data?.error || "Failed to load alerts");
      } finally {
        setIsAlertsLoading(false);
      }
    },
    [baseUrl],
  );

  // Derived state for today's alerts
  const alertsData = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return allAlerts.filter(
      (alert: any) =>
        alert.triggered_at && alert.triggered_at.startsWith(today),
    );
  }, [allAlerts]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUid(user.uid);
        fetchAlerts(user.uid);
      } else {
        setIsAlertsLoading(false);
        setAlertsError("No authenticated user");
      }
    });

    return () => unsubscribe();
  }, [fetchAlerts]);

  // 30-second background refresh
  useEffect(() => {
    if (!currentUid) return;

    const interval = setInterval(() => {
      fetchAlerts(currentUid);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUid, fetchAlerts]);

  return {
    alertsData,
    alertsCountToday: alertsData.length,
    isAlertsLoading,
    alertsError,
    refresh: () => currentUid && fetchAlerts(currentUid),
  };
}
