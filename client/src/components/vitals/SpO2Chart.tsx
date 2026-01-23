import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Waves } from "lucide-react";
import { MOCK_VITALS_DATA } from "@/constants/vitalsData";

type TimeRange = "1H" | "6H" | "12H" | "24H" | "7D" | "4W" | "6M" | "1Y";

const chartConfig = {
  spo2: { label: "SpO2", color: "hsl(221, 83%, 53%)" },
} satisfies ChartConfig;

export function SpO2Chart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1H");

  const { chartData, average } = useMemo(() => {
    const now = new Date();
    let msBack = 0;
    switch (timeRange) {
      case "1H":
        msBack = 3600000;
        break;
      case "6H":
        msBack = 21600000;
        break;
      case "12H":
        msBack = 43200000;
        break;
      case "24H":
        msBack = 86400000;
        break;
      case "7D":
        msBack = 604800000;
        break;
      case "4W":
        msBack = 2419200000;
        break;
      case "6M":
        msBack = 15778800000;
        break;
      case "1Y":
        msBack = 31536000000;
        break;
    }

    const cutoff = new Date(now.getTime() - msBack);
    const filtered = MOCK_VITALS_DATA.filter(
      (d) => new Date(d.recorded_at) >= cutoff,
    );
    const step = Math.ceil(filtered.length / 60);
    const aggregated = filtered.filter((_, i) => i % step === 0);
    const avg = filtered.length
      ? filtered.reduce((s, d) => s + d.spo2, 0) / filtered.length
      : 0;

    return {
      chartData: aggregated.map((d) => ({ time: d.recorded_at, spo2: d.spo2 })),
      average: avg.toFixed(1),
    };
  }, [timeRange]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-lg font-semibold">SpO₂</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{average}%</p>
            <p className="text-[10px] text-muted-foreground uppercase">avg</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1 no-scrollbar">
          {(
            ["1H", "6H", "12H", "24H", "7D", "4W", "6M", "1Y"] as TimeRange[]
          ).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-2 py-1 text-[9px] font-bold rounded shrink-0 transition-all ${timeRange === r ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <ChartContainer config={chartConfig} className="h-[120px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={15}
              tickFormatter={(v) => {
                const d = new Date(v);
                return timeRange === "1H"
                  ? d.toLocaleTimeString([], { minute: "2-digit" })
                  : d.toLocaleTimeString([], { hour: "numeric" });
              }}
            />
            <YAxis domain={[94, 100]} hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(v) => new Date(v).toLocaleString()}
                />
              }
            />
            <Line
              dataKey="spo2"
              type="monotone"
              stroke="var(--color-spo2)"
              strokeWidth={2}
              dot={timeRange === "1H"}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
