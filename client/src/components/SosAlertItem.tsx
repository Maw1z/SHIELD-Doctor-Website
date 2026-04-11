import { Siren } from "lucide-react";
import { format } from "date-fns";
import type { SosEvent } from "@/hooks/useSos";

// Defining the specific vitals structure based on your data
interface VitalsSnapshot {
  heart_rate?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  spo2?: number;
  hrv?: number;
  recorded_at?: string;
}

interface SosAlertItemProps {
  // Updated to reflect that vitals_snapshot is an array
  event: SosEvent & { vitals_snapshot: VitalsSnapshot[] | null };
  showPatientName?: boolean;
}

export function SosAlertItem({
  event,
  showPatientName = false,
}: SosAlertItemProps) {
  const mapsUrl = `https://www.google.com/maps?q=${event.latitude},${event.longitude}`;

  // Access the first object in the vitals_snapshot array
  const vitals = event.vitals_snapshot?.[0];

  return (
    <div
      className="flex gap-4 p-3 rounded-md border mb-3 last:mb-0 bg-white transition-all shadow-sm"
      role="listitem"
      aria-labelledby={`sos-label-${event.event_id}`}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 shrink-0"
        aria-hidden="true"
      >
        <Siren size={20} />
      </div>

      <div className="flex-1 flex justify-between min-w-0">
        <div className="flex-1 flex flex-col min-w-0 space-y-1">
          {showPatientName && event.patient_name && (
            <p className="text-sm font-bold text-gray-900 truncate">
              {event.patient_name}
            </p>
          )}

          {/* Location Link */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="truncate">
              {event.latitude.toFixed(5)}, {event.longitude.toFixed(5)}
            </span>
          </a>

          {/* Detailed Vitals Grid */}
          {vitals ? (
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1">
              {vitals.heart_rate != null && (
                <p className="text-[11px] text-gray-600">
                  <span className="font-medium text-gray-900">HR:</span>{" "}
                  {Math.round(vitals.heart_rate)} bpm
                </p>
              )}
              {vitals.bp_systolic != null && (
                <p className="text-[11px] text-gray-600">
                  <span className="font-medium text-gray-900">BP:</span>{" "}
                  {vitals.bp_systolic}/{vitals.bp_diastolic}
                </p>
              )}
              {vitals.spo2 != null && (
                <p className="text-[11px] text-gray-600">
                  <span className="font-medium text-gray-900">SpO2:</span>{" "}
                  {vitals.spo2}%
                </p>
              )}
              {vitals.hrv != null && (
                <p className="text-[11px] text-gray-600">
                  <span className="font-medium text-gray-900">HRV:</span>{" "}
                  {vitals.hrv} ms
                </p>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-gray-400 italic">
              No vitals captured
            </p>
          )}
        </div>

        {/* Timestamp and Label */}
        <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
          <span className="text-xs text-gray-500 font-medium uppercase">
            {format(new Date(event.created_at), "HH:mm")}
          </span>

          <span
            id={`sos-label-${event.event_id}`}
            className="px-2 py-0.5 rounded text-[10px] tracking-widest font-black uppercase bg-red-600 text-white"
          >
            SOS
          </span>
        </div>
      </div>
    </div>
  );
}
