import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

export default function RiskAssessment({ riskData }: { riskData: any }) {
  const { current, label, reasons, stats } = riskData;

  const getRiskColor = (score: number) => {
    if (score >= 70) return "#dc2626";
    if (score >= 40) return "#f59e0b";
    return "#16a34a";
  };

  const activeColor = getRiskColor(current);
  const chartData = [{ value: current, fill: activeColor }];

  return (
    <div
      className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
      role="region"
      aria-label="Risk assessment analysis"
    >
      {/* LEFT SIDE: Radial Chart with Conditional Color */}
      <div
        className="relative h-32 w-32 shrink-0"
        role="img"
        aria-label={`Risk score chart: ${Math.round(current)}%`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            barSize={8}
            data={chartData}
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
              fill={activeColor}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          <p
            className="text-2xl font-bold leading-none"
            style={{ color: activeColor }}
          >
            {Math.round(current)}%
          </p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
            Risk Score
          </p>
        </div>
      </div>

      {/* Information Content */}
      <div className="flex-1 w-full space-y-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 border-r">
            <div>
              <p
                className="text-xs text-muted-foreground font-bold uppercase leading-none mb-1"
                id="risk-status-label"
              >
                Status
              </p>
              <p
                className="text-sm font-bold uppercase tracking-tight"
                style={{ color: activeColor }}
                aria-labelledby="risk-status-label"
              >
                {label} Risk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-r pl-2">
            <div>
              <p
                className="text-xs text-muted-foreground font-bold uppercase leading-none mb-1"
                id="24h-high-label"
              >
                24H High
              </p>
              <p
                className="text-sm font-bold text-red-600"
                aria-labelledby="24h-high-label"
              >
                {Math.round(stats.max)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-2">
            <div>
              <p
                className="text-xs text-muted-foreground font-bold uppercase leading-none mb-1"
                id="24h-low-label"
              >
                24H Low
              </p>
              <p
                className="text-sm font-bold text-green-600"
                aria-labelledby="24h-low-label"
              >
                {Math.round(stats.min)}%
              </p>
            </div>
          </div>
        </div>

        {/* Indicators Section */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center gap-3">
          <p
            className="text-xs text-muted-foreground font-bold uppercase whitespace-nowrap"
            id="indicators-label"
          >
            Risk Indicators:
          </p>
          <div
            className="flex flex-wrap gap-1.5"
            role="list"
            aria-labelledby="indicators-label"
          >
            {Array.isArray(reasons) && reasons.length > 0 ? (
              reasons.map((r: string) => (
                <Badge
                  key={r}
                  variant="secondary"
                  role="listitem"
                  className="rounded-sm px-2 py-0 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border-none"
                >
                  {r.replace("_", " ")}
                </Badge>
              ))
            ) : (
              <span className="text-xs font-bold text-slate-400" role="status">
                SYSTEM PARAMETERS NORMAL
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
