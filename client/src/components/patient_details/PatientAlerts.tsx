import { AlertCircle, Activity, Heart } from "lucide-react";

interface PatientAlert {
  alert_id: number;
  alert_type: "HIGH_HR" | "LOW_HR" | "IRREGULAR_RHYTHM";
  vital_value: number;
  threshold_value?: number | null;
  activity_level?: string | null;
  triggered_at: string;
  acknowledged: boolean;
}

const alertConfig = {
  HIGH_HR: {
    icon: Heart,
    label: "High Heart Rate",
    text: "text-red-600",
    bg: "bg-red-50",
  },
  LOW_HR: {
    icon: Activity,
    label: "Low Heart Rate",
    text: "text-blue-600",
    bg: "bg-blue-50",
  },
  IRREGULAR_RHYTHM: {
    icon: AlertCircle,
    label: "Arrhythmia",
    text: "text-amber-600",
    bg: "bg-amber-50",
  },
};

export default function PatientAlerts({ alerts }: { alerts: PatientAlert[] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <p className="text-xs text-slate-400 italic">
        No alerts recorded for this patient.
      </p>
    );
  }

  return (
    <div className="h-90 overflow-y-auto pr-2 space-y-4">
      {alerts.map((alert) => {
        const config = alertConfig[alert.alert_type];
        const Icon = config.icon;

        return (
          <div
            key={alert.alert_id}
            className="bg-white border rounded-md p-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${config.bg}`}
                >
                  <Icon className={`h-4 w-4 ${config.text}`} />
                </div>
                <p className={`text-sm font-semibold ${config.text}`}>
                  {config.label}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>
                <span className="font-bold text-black">Vital:</span>{" "}
                {Math.round(alert.vital_value)} bpm
              </p>

              <p>
                <span className="font-bold text-black">Threshold:</span>{" "}
                {alert.threshold_value != null
                  ? `${Math.round(alert.threshold_value)} bpm`
                  : "N/A"}
              </p>

              <p>
                <span className="font-bold text-black">Activity:</span>{" "}
                {alert.activity_level || "N/A"}
              </p>

              <p>
                <span className="font-bold text-black">Acknowledged:</span>{" "}
                {alert.acknowledged ? "Yes" : "No"}
              </p>
            </div>

            <div className="mt-3 text-[11px] text-slate-500">
              {new Date(alert.triggered_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              •{" "}
              {new Date(alert.triggered_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
