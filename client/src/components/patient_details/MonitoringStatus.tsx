import { Clock } from "lucide-react";
import { getStatusFromScore } from "@/utils/getStatusFromScore";
import { formatDateTime } from "@/utils/formatDateTime";

interface MonitoringProps {
  riskScore: number;
  lastSeen: string | null;
}

export default function MonitoringStatus({
  riskScore,
  lastSeen,
}: MonitoringProps) {
  const status = getStatusFromScore(riskScore || 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-xs font-semibold" id="status-label">
          Status:
        </span>
        <span
          aria-labelledby="status-label"
          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
            status === "Stable"
              ? "bg-green-100 text-green-700"
              : status === "Critical"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" id="last-seen-label">
          Last Seen:
        </span>
        <div
          className="flex items-center gap-1 text-xs text-slate-500"
          aria-labelledby="last-seen-label"
        >
          <Clock className="h-3 w-3" aria-hidden="true" />
          {lastSeen ? formatDateTime(lastSeen) : "No past visits"}
        </div>
      </div>
    </div>
  );
}
