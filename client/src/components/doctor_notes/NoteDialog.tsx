import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getAuth } from "firebase/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import apiClient from "@/api/apiClient";

interface Note {
  note_id: number;
  note_title: string;
  note_content: string;
  created_at: string;
}

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  patientId: string;
  /** Pass a note to switch to edit mode */
  note?: Note;
}

export function NoteDialog({
  open,
  onOpenChange,
  onSuccess,
  patientId,
  note,
}: NoteDialogProps) {
  const isEditing = !!note;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    note_title: "",
    note_content: "",
  });

  const auth = getAuth();

  // Populate form when editing
  useEffect(() => {
    if (note) {
      setFormData({
        note_title: note.note_title ?? "",
        note_content: note.note_content ?? "",
      });
    } else {
      setFormData({ note_title: "", note_content: "" });
    }
  }, [note, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const doctorId = auth.currentUser?.uid;
    if (!doctorId) {
      toast.error("Auth Error", { description: "You must be logged in." });
      return;
    }

    if (!formData.note_content.trim()) {
      toast.error("Validation Error", {
        description: "Note content is required.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await apiClient.put(`/notes/${note.note_id}`, {
          note_title: formData.note_title,
          note_content: formData.note_content,
        });
        toast.success("Note updated successfully.");
      } else {
        await apiClient.post(`/notes`, {
          patient_id: patientId,
          note_title: formData.note_title,
          note_content: formData.note_content,
        });
        toast.success("Note added successfully.");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.error ?? "Failed to save note.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} aria-labelledby="note-dialog-title">
          <DialogHeader>
            <DialogTitle id="note-dialog-title" className="text-xl font-bold">
              {isEditing ? "Edit Note" : "New Note"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the note details below."
                : "Add a clinical note for this patient."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note_title">Note Title</Label>
              <Input
                id="note_title"
                className="text-base"
                placeholder="e.g. Follow-up observation"
                value={formData.note_title}
                onChange={(e) =>
                  setFormData({ ...formData, note_title: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note_content">
                Note Content{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </Label>
              <Textarea
                id="note_content"
                className="text-base min-h-[120px] resize-y"
                placeholder="Write your clinical observations here..."
                value={formData.note_content}
                onChange={(e) =>
                  setFormData({ ...formData, note_content: e.target.value })
                }
                required
                aria-required="true"
              />
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              aria-busy={isSubmitting}
            >
              {isSubmitting && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {isEditing ? "Save Changes" : "Add Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
