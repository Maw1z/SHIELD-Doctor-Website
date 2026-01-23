import { Clock } from "lucide-react";

export default function MonitoringStatus({ patient }: { patient: any }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-xs font-semibold">Status:</span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
            patient.status === "Stable"
              ? "bg-green-100 text-green-700"
              : patient.status === "Critical"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {patient.status}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">Last Seen:</span>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          {patient.lastCheck.split(" ")[0]}
        </div>
      </div>
    </div>
  );
}
