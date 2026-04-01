import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Heart } from "lucide-react";

const chartConfig = {
  heart_rate: { label: "Heart Rate", color: "hsl(0, 84%, 60%)" },
} satisfies ChartConfig;

interface ChartProps {
  vitals: any[];
  timeRange: string;
  onRangeChange: (range: any) => void;
}

export function HeartRateChart({
  vitals,
  timeRange,
  onRangeChange,
}: ChartProps) {
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

    let filtered = vitals;
    if (msMap[timeRange]) {
      const cutoff = now.getTime() - msMap[timeRange];
      filtered = vitals.filter(
        (v) => new Date(v.recorded_at).getTime() >= cutoff,
      );
    }

    const step = Math.ceil(filtered.length / 100);
    const aggregated = filtered.filter((_, i) => i % (step || 1) === 0);
    const avg = filtered.length
      ? filtered.reduce((sum, d) => sum + (d.heart_rate || 0), 0) /
        filtered.length
      : 0;

    return {
      chartData: aggregated.map((d) => ({
        time: d.recorded_at,
        heart_rate: d.heart_rate,
      })),
      average: Math.round(avg),
    };
  }, [vitals, timeRange]);

  return (
    <Card
      className="shadow-sm"
      role="region"
      aria-label="Heart Rate Chart Card"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" aria-hidden="true" />
            <CardTitle className="text-lg font-semibold">Heart Rate</CardTitle>
          </div>
          <div className="text-right" aria-live="polite" aria-atomic="true">
            <p className="text-2xl font-bold">
              <span className="sr-only">Average Heart Rate: </span>
              {average}
            </p>
            <p
              className="text-[10px] text-muted-foreground uppercase"
              aria-hidden="true"
            >
              bpm avg
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
              className={`px-2 py-1 text-[9px] font-bold rounded shrink-0 transition-all ${
                timeRange === r
                  ? "bg-red-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="h-30 w-full"
          role="img"
          aria-label={`Line chart showing heart rate trends over ${timeRange}. Current average is ${average} beats per minute.`}
        >
          <LineChart data={chartData} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={15}
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
            <YAxis domain={["dataMin - 5", "dataMax + 5"]} hide />
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
              dataKey="heart_rate"
              type="monotone"
              stroke="var(--color-heart_rate)"
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
