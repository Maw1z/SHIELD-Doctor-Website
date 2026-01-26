interface Note {
  note_id: number;
  note_title: string;
  note_content: string;
  created_at: string;
}

export default function DoctorNotes({ notes }: { notes: Note[] }) {
  if (!notes || notes.length === 0) {
    return (
      <p className="text-slate-400 italic">
        No notes recorded for this patient.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {notes.map((note) => (
        <div
          key={note.note_id}
          className="border-b last:border-0 pb-3 last:pb-0"
        >
          <p className="font-bold text-primary text-[11px] uppercase tracking-tight mb-1">
            {note.note_title || "General Note"}
          </p>
          <p className="text-slate-700 leading-relaxed mb-1">
            {note.note_content}
          </p>
          <p className="text-muted-foreground text-[9px]">
            {new Date(note.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
