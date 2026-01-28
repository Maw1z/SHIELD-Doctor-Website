export interface VitalReading {
  recorded_at: string;
  heart_rate: number;
  hrv: number;
  spo2: number;
  bp_systolic: number;
  bp_diastolic: number;
  activity_level: string;
}

// Generate synthetic vitals data
function generateVitalsData(): VitalReading[] {
  const data: VitalReading[] = [];
  const now = new Date();

  const minutesInMonth = 30 * 24 * 60;
  for (let i = minutesInMonth; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 1000);
    const hour = timestamp.getHours();

    const isAsleep = hour >= 23 || hour < 6;
    const isActive = hour >= 9 && hour < 17;

    data.push({
      recorded_at: timestamp.toISOString(),
      heart_rate: Math.floor(
        isAsleep
          ? 55 + Math.random() * 10
          : isActive
            ? 75 + Math.random() * 25
            : 65 + Math.random() * 15,
      ),
      hrv: Math.floor(
        isAsleep
          ? 60 + Math.random() * 20
          : isActive
            ? 30 + Math.random() * 20
            : 45 + Math.random() * 15,
      ),
      spo2: parseFloat((97 + Math.random() * 2).toFixed(2)),
      bp_systolic: Math.floor(
        isAsleep ? 110 + Math.random() * 10 : 118 + Math.random() * 12,
      ),
      bp_diastolic: Math.floor(
        isAsleep ? 70 + Math.random() * 5 : 75 + Math.random() * 10,
      ),
      activity_level: isAsleep ? "resting" : isActive ? "active" : "light",
    });
  }

  const hoursInYear = 365 * 24;
  for (let i = hoursInYear; i > 24 * 30; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      recorded_at: timestamp.toISOString(),
      heart_rate: Math.floor(60 + Math.random() * 20),
      hrv: Math.floor(40 + Math.random() * 20),
      spo2: parseFloat((96 + Math.random() * 3).toFixed(2)),
      bp_systolic: Math.floor(115 + Math.random() * 15),
      bp_diastolic: Math.floor(75 + Math.random() * 10),
      activity_level: "historic",
    });
  }

  return data.sort(
    (a, b) =>
      new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime(),
  );
}

export const MOCK_VITALS_DATA = generateVitalsData();
