import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteDialog } from "@/components/doctor_notes/NoteDialog";
import { DeleteNoteDialog } from "@/components/doctor_notes/DeleteNoteDialog";

interface Note {
  note_id: number;
  note_title: string;
  note_content: string;
  created_at: string;
}

interface DoctorNotesProps {
  notes: Note[];
  patientId: string;
  onNotesChanged: () => void;
}

export default function DoctorNotes({
  notes,
  patientId,
  onNotesChanged,
}: DoctorNotesProps) {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setNoteDialogOpen(true);
  };

  const handleDelete = (note: Note) => {
    setSelectedNote(note);
    setDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedNote(undefined);
    setNoteDialogOpen(true);
  };

  return (
    <>
      <div className="absolute top-5 right-5">
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
          onClick={handleAddNew}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {!notes || notes.length === 0 ? (
        <p className="text-slate-400 italic" role="status">
          No notes recorded for this patient.
        </p>
      ) : (
        <div
          className="flex flex-col gap-4"
          role="feed"
          aria-busy="false"
          aria-label="Doctor notes feed"
        >
          {notes.map((note) => (
            <article
              key={note.note_id}
              className="border-b last:border-0 pb-3 last:pb-0"
              aria-labelledby={`note-title-${note.note_id}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  id={`note-title-${note.note_id}`}
                  className="font-bold text-primary text-[11px] uppercase tracking-tight mb-1"
                >
                  {note.note_title || "General Note"}
                </p>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => handleEdit(note)}
                    aria-label={`Edit note: ${note.note_title || "General Note"}`}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(note)}
                    aria-label={`Delete note: ${note.note_title || "General Note"}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mb-1">
                {note.note_content}
              </p>
              <p className="text-muted-foreground text-[11px]">
                <time dateTime={note.created_at}>
                  {new Date(note.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </p>
            </article>
          ))}
        </div>
      )}

      <NoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        onSuccess={onNotesChanged}
        patientId={patientId}
        note={selectedNote}
      />

      {selectedNote && (
        <DeleteNoteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onSuccess={onNotesChanged}
          noteId={selectedNote.note_id}
          noteTitle={selectedNote.note_title}
        />
      )}
    </>
  );
}
