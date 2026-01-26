import { useEffect, useState } from "react";

interface VitalRecord {
  recorded_at: string;
  heart_rate: number;
  hrv: number;
  spo2: number;
  bp_systolic: number;
  bp_diastolic: number;
  activity_level?: string;
}

export function useVitals(patientId: string, selectedRange: string) {
  const [data, setData] = useState<VitalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const isShortTerm = ["1H", "6H", "12H", "24H", "7D"].includes(selectedRange);
  const apiRange = isShortTerm ? "7D" : selectedRange;

  useEffect(() => {
    if (!patientId) return;

    async function fetchData() {
      setLoading(true);

      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
      const res = await fetch(
        `${baseUrl}/vitals-history?patient_id=${patientId}&range=${apiRange}`,
      );
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchData();
  }, [patientId, apiRange]); // only re-fetch if we cross the 7d boundary

  return { vitals: data, loading };
}
