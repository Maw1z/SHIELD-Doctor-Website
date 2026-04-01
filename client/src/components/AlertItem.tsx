import { AlertCircle, Activity, Heart, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export type AlertType = "HIGH_HR" | "LOW_HR" | "IRREGULAR_RHYTHM";

export interface Alert {
  alert_id: number;
  alert_type: AlertType;
  patient_name?: string;
  vital_value: number;
  threshold_value?: number | null;
  activity_level?: string | null;
  triggered_at: string;
  acknowledged: boolean;
}

interface AlertItemProps {
  alert: Alert;
  showPatientName?: boolean;
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

export function AlertItem({ alert }: AlertItemProps) {
  const config = alertConfig[alert.alert_type] || alertConfig.HIGH_HR;

  const Icon = config.icon;

  return (
    <div
      className="flex gap-4 p-3 rounded-md border mb-3 last:mb-0 bg-white transition-all"
      role="listitem"
      aria-labelledby={`alert-label-${alert.alert_id}`}
    >
      {/* Icon */}
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${config.text} ${config.bg}`}
        aria-hidden="true"
      >
        <Icon size={18} />
      </div>

      <div className="flex-1 flex justify-between min-w-0">
        <div className="flex-1 flex flex-col min-w-0">
          {alert.patient_name && (
            <p className="text-sm font-semibold text-gray-900 truncate">
              <span className="sr-only">Patient: </span>
              {alert.patient_name}
            </p>
          )}

          <p className={`text-xs font-medium ${config.text} truncate`}>
            Vital: {Math.round(alert.vital_value)} bpm
          </p>

          <>
            <p className="text-xs text-gray-500 truncate">
              Threshold:{" "}
              {alert.threshold_value != null
                ? Math.round(alert.threshold_value) + " bpm"
                : "N/A"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Activity: {alert.activity_level || "N/A"}
            </p>
          </>

          <p className="text-xs text-gray-500 flex items-center gap-1">
            Acknowledged:{" "}
            {alert.acknowledged ? (
              <CheckCircle
                className="h-3 w-3 text-green-600"
                aria-label="Yes"
              />
            ) : (
              <span className="text-gray-400">No</span>
            )}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
          <span className="text-xs text-gray-500 font-medium uppercase">
            <span className="sr-only">Triggered at </span>
            {format(new Date(alert.triggered_at), "HH:mm")}
          </span>

          <span
            id={`alert-label-${alert.alert_id}`}
            className={`px-2 py-0.5 rounded text-[10px] tracking-widest font-black uppercase ${config.bg} ${config.text}`}
          >
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
