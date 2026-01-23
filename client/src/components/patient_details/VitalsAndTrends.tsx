import { BPDiastolicChart } from "../vitals/BPDiastolicChart";
import { BPSystolicChart } from "../vitals/BPSystolicChart";
import { SpO2Chart } from "../vitals/SpO2Chart";
import { HRVChart } from "../vitals/HRVChart";
import { HeartRateChart } from "../vitals/HeartRateChart";

export default function VitalsAndTrends() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <HeartRateChart />
      <HRVChart />
      <SpO2Chart />
      <BPSystolicChart />
      <BPDiastolicChart />
    </div>
  );
}
