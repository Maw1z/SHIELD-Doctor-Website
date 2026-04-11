import { useState } from "react";
import { useParams } from "react-router-dom";

import { useVitals } from "../../hooks/useVitals";

import { BPDiastolicChart } from "../vitals/BPDiastolicChart";
import { BPSystolicChart } from "../vitals/BPSystolicChart";
import { SpO2Chart } from "../vitals/SpO2Chart";
import { HRVChart } from "../vitals/HRVChart";
import { HeartRateChart } from "../vitals/HeartRateChart";

type TimeRange = "1H" | "6H" | "12H" | "24H" | "7D" | "4W" | "6M" | "1Y";

export default function VitalsAndTrends() {
  const { id } = useParams<{ id: string }>();

  const [timeRange, setTimeRange] = useState<TimeRange>("24H");

  const { vitals, loading } = useVitals(id || "", timeRange);

  if (!loading && vitals?.length === 0) {
    return <div>No data available for selected range</div>;
  }

  if (loading && (!vitals || vitals.length === 0)) {
    return (
      <div
        className="grid grid-cols-2 gap-4"
        role="status"
        aria-label="Loading vitals charts"
        aria-busy="true"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-4"
      role="region"
      aria-label="Patient health vitals and trends"
    >
      <HeartRateChart
        vitals={vitals || []}
        timeRange={timeRange}
        onRangeChange={setTimeRange}
      />
      <HRVChart
        vitals={vitals || []}
        timeRange={timeRange}
        onRangeChange={setTimeRange}
      />
      <SpO2Chart
        vitals={vitals || []}
        timeRange={timeRange}
        onRangeChange={setTimeRange}
      />
      <BPSystolicChart
        vitals={vitals || []}
        timeRange={timeRange}
        onRangeChange={setTimeRange}
      />
      <BPDiastolicChart
        vitals={vitals || []}
        timeRange={timeRange}
        onRangeChange={setTimeRange}
      />
    </div>
  );
}
