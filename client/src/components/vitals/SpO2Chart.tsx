import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Waves } from "lucide-react";

const chartConfig = {
  spo2: { label: "SpO2", color: "hsl(221, 83%, 53%)" },
} satisfies ChartConfig;

export function SpO2Chart({ vitals, timeRange, onRangeChange }: any) {
  const { chartData, average } = useMemo(() => {
    if (!vitals || !Array.isArray(vitals)) {
      return { chartData: [], average: 0 };
    }

    const now = new Date();
    const msMap: Record<string, number> = {
      "1H": 3600000,
      "6H": 21600000,
      "12H": 43200000,
      "24H": 86400000,
      "7D": 604800000,
    };
    let filtered = msMap[timeRange]
      ? vitals.filter(
          (v) =>
            new Date(v.recorded_at).getTime() >=
            now.getTime() - msMap[timeRange],
        )
      : vitals;

    const step = Math.ceil(filtered.length / 100);
    const aggregated = filtered.filter((_, i) => i % (step || 1) === 0);
    const avg = filtered.length
      ? filtered.reduce((s, d) => s + (d.spo2 || 0), 0) / filtered.length
      : 0;

    return {
      chartData: aggregated.map((d) => ({ time: d.recorded_at, spo2: d.spo2 })),
      average: avg.toFixed(1),
    };
  }, [vitals, timeRange]);

  return (
    <Card className="shadow-sm" role="region" aria-label="SpO2 Chart Card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="h-8 w-8 text-blue-600" aria-hidden="true" />
            <CardTitle className="text-lg font-semibold">SpO₂</CardTitle>
          </div>
          <div className="text-right" aria-live="polite" aria-atomic="true">
            <p className="text-2xl font-bold">
              <span className="sr-only">Average Oxygen Saturation: </span>
              {average}%
            </p>
            <p
              className="text-[10px] text-muted-foreground uppercase"
              aria-hidden="true"
            >
              avg
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div
          className="flex gap-1 mb-4 overflow-x-auto pb-1 no-scrollbar"
          role="tablist"
          aria-label="Select time range"
        >
          {["1H", "6H", "12H", "24H", "7D", "4W", "6M", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              role="tab"
              aria-selected={timeRange === r}
              className={`px-2 py-1 text-[9px] font-bold rounded ${timeRange === r ? "bg-blue-600 text-white" : "bg-slate-100"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="h-30 w-full"
          role="img"
          aria-label={`Line chart showing blood oxygen saturation trends over ${timeRange}. Current average is ${average} percent.`}
        >
          <LineChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);

                if (["1H", "6H", "12H", "24H"].includes(timeRange)) {
                  return date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
                return date.toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis domain={[90, 100]} hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="spo2"
              type="monotone"
              stroke="var(--color-spo2)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
