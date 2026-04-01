import { Calendar } from "lucide-react";

interface Appointment {
  appointment_id: number;
  title: string;
  appointment_datetime: string;
}

export default function UpcomingAppointments({
  appointments,
}: {
  appointments: Appointment[];
}) {
  if (!appointments || appointments.length === 0) {
    return (
      <p className="text-xs text-slate-400 italic">No upcoming appointments.</p>
    );
  }

  return (
    <div
      className="flex flex-col gap-4"
      role="list"
      aria-label="Upcoming appointments list"
    >
      {appointments.map((appt) => (
        <div
          key={appt.appointment_id}
          className="flex flex-col border-l-2 border-primary/30 pl-3"
          role="listitem"
        >
          <p className="text-sm font-bold text-primary">
            <time dateTime={appt.appointment_datetime}>
              {new Date(appt.appointment_datetime).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            </time>
          </p>
          <p className="text-xs text-primary/70 font-medium italic mb-1">
            {appt.title}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="h-2 w-2" aria-hidden="true" />
            <time>
              {new Date(appt.appointment_datetime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </p>
        </div>
      ))}
    </div>
  );
}
