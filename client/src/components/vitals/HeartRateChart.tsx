import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Heart } from "lucide-react";
import { MOCK_VITALS_DATA } from "@/constants/vitalsData";

type TimeRange = "1H" | "6H" | "12H" | "24H" | "7D" | "4W" | "6M" | "1Y";

const chartConfig = {
  heart_rate: { label: "Heart Rate", color: "hsl(0, 84%, 60%)" },
} satisfies ChartConfig;

export function HeartRateChart() {
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

    // Dynamic aggregation to keep 60-100 points on the chart regardless of range
    let aggregated = filtered;
    const maxPoints = 60;
    if (filtered.length > maxPoints) {
      const step = Math.ceil(filtered.length / maxPoints);
      aggregated = filtered.filter((_, i) => i % step === 0);
    }

    const avg =
      filtered.length > 0
        ? filtered.reduce((sum, d) => sum + d.heart_rate, 0) / filtered.length
        : 0;

    return {
      chartData: aggregated.map((d) => ({
        time: d.recorded_at,
        heart_rate: d.heart_rate,
      })),
      average: Math.round(avg),
    };
  }, [timeRange]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            <CardTitle className="text-lg font-semibold">Heart Rate</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{average}</p>
            <p className="text-[10px] text-muted-foreground uppercase">
              bpm avg
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {/* Scrollable container for many range buttons */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1 no-scrollbar">
          {(
            ["1H", "6H", "12H", "24H", "7D", "4W", "6M", "1Y"] as TimeRange[]
          ).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 text-[9px] font-bold rounded shrink-0 transition-all ${
                timeRange === range
                  ? "bg-red-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <ChartContainer config={chartConfig} className="h-[120px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={15}
              tickFormatter={(value) => {
                const date = new Date(value);
                // Show minutes for 1H, hours for others
                return timeRange === "1H"
                  ? date.toLocaleTimeString([], {
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : date.toLocaleTimeString([], { hour: "numeric" });
              }}
            />
            <YAxis domain={["dataMin - 5", "dataMax + 5"]} hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleTimeString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />
              }
            />
            <Line
              dataKey="heart_rate"
              type="monotone"
              stroke="var(--color-heart_rate)"
              strokeWidth={2}
              dot={timeRange === "1H"} // Only show dots on high-granularity 1H view
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
