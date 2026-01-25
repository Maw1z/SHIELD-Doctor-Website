import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ArrowDown } from "lucide-react";

const chartConfig = {
  bp_diastolic: { label: "Diastolic", color: "hsl(142, 76%, 36%)" },
} satisfies ChartConfig;

export function BPDiastolicChart({ vitals, timeRange, onRangeChange }: any) {
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
      ? filtered.reduce((s, d) => s + (d.bp_diastolic || 0), 0) /
        filtered.length
      : 0;

    return {
      chartData: aggregated.map((d) => ({
        time: d.recorded_at,
        bp_diastolic: d.bp_diastolic,
      })),
      average: Math.round(avg),
    };
  }, [vitals, timeRange]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-8 w-8 text-green-600" />
            <CardTitle className="text-lg font-semibold">
              BP Diastolic
            </CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{average}</p>
            <p className="text-[10px] text-muted-foreground uppercase">
              mmHg avg
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1 no-scrollbar">
          {["1H", "6H", "12H", "24H", "7D", "4W", "6M", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              className={`px-2 py-1 text-[9px] font-bold rounded ${timeRange === r ? "bg-green-600 text-white" : "bg-slate-100"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <ChartContainer config={chartConfig} className="h-30 w-full">
          <LineChart data={chartData}>
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
            <YAxis domain={["dataMin - 5", "dataMax + 5"]} hide />
            <ChartTooltip
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
              dataKey="bp_diastolic"
              type="monotone"
              stroke="var(--color-bp_diastolic)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
