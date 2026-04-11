import { AlertCircle, Activity, Heart, Siren, MapPin } from "lucide-react";
import { format } from "date-fns";

interface VitalsSnapshot {
  heart_rate?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  spo2?: number;
  hrv?: number;
  recorded_at?: string;
}

interface SosEvent {
  event_id: string | number;
  latitude: number;
  longitude: number;
  created_at: string;
  patient_name?: string;
  vitals_snapshot: VitalsSnapshot[] | null;
}

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

interface PatientAlertsProps {
  alerts: PatientAlert[];
  sosEvents?: SosEvent[];
}

export default function PatientAlerts({
  alerts,
  sosEvents = [],
}: PatientAlertsProps) {
  const hasAlerts = alerts && alerts.length > 0;
  const hasSos = sosEvents && sosEvents.length > 0;

  if (!hasAlerts && !hasSos) {
    return (
      <p className="text-xs text-slate-400 italic" role="status">
        No alerts recorded for this patient.
      </p>
    );
  }

  return (
    <div
      className="h-90 overflow-y-auto pr-2 space-y-4"
      role="feed"
      aria-label="Patient alerts history"
    >
      {/* SOS Events Section */}
      {hasSos && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
            SOS Events
          </p>
          {sosEvents.map((event) => {
            const mapsUrl = `https://www.google.com/maps?q=${event.latitude},${event.longitude}`;
            const vitals = event.vitals_snapshot?.[0];

            return (
              <article
                key={event.event_id}
                className="bg-white border  rounded-md p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50">
                      <Siren className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-red-600 tracking-wide ">
                        Emergency SOS
                      </p>
                    </div>
                  </div>
                  <time className="text-[10px] font-bold text-gray-400 uppercase">
                    {format(new Date(event.created_at), "HH:mm")}
                  </time>
                </div>

                <div className="space-y-2">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                  >
                    {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                  </a>

                  {vitals ? (
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                      {vitals.heart_rate && (
                        <p className="text-[11px]">
                          <span className="text-gray-500">HR:</span>{" "}
                          <span className="font-bold">
                            {Math.round(vitals.heart_rate)} bpm
                          </span>
                        </p>
                      )}
                      {vitals.spo2 && (
                        <p className="text-[11px]">
                          <span className="text-gray-500">SpO2:</span>{" "}
                          <span className="font-bold">{vitals.spo2}%</span>
                        </p>
                      )}
                      {vitals.bp_systolic && (
                        <p className="text-[11px]">
                          <span className="text-gray-500">BP:</span>{" "}
                          <span className="font-bold">
                            {vitals.bp_systolic}/{vitals.bp_diastolic}
                          </span>
                        </p>
                      )}
                      {vitals.hrv && (
                        <p className="text-[11px]">
                          <span className="text-gray-500">HRV:</span>{" "}
                          <span className="font-bold">{vitals.hrv}ms</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">
                      No vitals captured at trigger
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Vital Alerts Section */}
      {hasAlerts && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
            Vital Events
          </p>
          {alerts.map((alert) => {
            const config = alertConfig[alert.alert_type];
            const Icon = config.icon;

            return (
              <article
                key={alert.alert_id}
                className="bg-white border rounded-md p-4 shadow-sm"
              >
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
                  <time className="text-[10px] font-bold text-gray-400">
                    {format(new Date(alert.triggered_at), "HH:mm")}
                  </time>
                </div>

                <div className="text-xs text-slate-600 flex-row gap-2">
                  <p>
                    <span className="font-bold text-black">Vital:</span>{" "}
                    {Math.round(alert.vital_value)} bpm
                  </p>
                  <p>
                    <span className="font-bold text-black">Activity:</span>{" "}
                    {alert.activity_level || "N/A"}
                  </p>
                  <p className="col-span-2">
                    <span className="font-bold text-black">Threshold:</span>{" "}
                    {alert.threshold_value != null
                      ? `${Math.round(alert.threshold_value)} bpm`
                      : "N/A"}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400">
                  <span>
                    {format(new Date(alert.triggered_at), "MMM dd, yyyy")}
                  </span>
                  <span
                    className={
                      alert.acknowledged ? "text-green-600" : "text-amber-600"
                    }
                  >
                    {alert.acknowledged ? "✓ Acknowledged" : "• Pending"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
