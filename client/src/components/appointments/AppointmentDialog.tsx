import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
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
import { toast } from "sonner";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const API_BASE = import.meta.env.VITE_PUBLIC_API_BASE_URL;

export function AppointmentDialog({
  open,
  onOpenChange,
  onSuccess,
}: AppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local Form State
  const [formData, setFormData] = useState({
    doctor_id: "",
    patient_id: "",
    title: "",
    appointment_datetime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // POST API Call directly inside the component
      await axios.post(`${API_BASE}/v1/appointments`, {
        doctor_id: formData.doctor_id,
        patient_id: formData.patient_id,
        title: formData.title,
        appointment_datetime: formData.appointment_datetime,
      });

      toast.success("Success", {
        description: "Appointment has been scheduled successfully.",
      });

      // Reset form and close
      setFormData({
        doctor_id: "",
        patient_id: "",
        title: "",
        appointment_datetime: "",
      });
      onSuccess(); // Triggers the table refresh in the parent page
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Error", {
        description:
          error.response?.data?.error || "Failed to create appointment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
            <DialogDescription>
              Enter the details for the new appointment. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Appointment Title</Label>
              <Input
                id="title"
                placeholder="Routine Checkup"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="patient_id">Patient UUID / ID</Label>
              <Input
                id="patient_id"
                placeholder="p-12345"
                value={formData.patient_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doctor_id">Doctor UUID / ID</Label>
              <Input
                id="doctor_id"
                placeholder="d-67890"
                value={formData.doctor_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="appointment_datetime">Date & Time</Label>
              <Input
                id="appointment_datetime"
                type="datetime-local"
                value={formData.appointment_datetime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
