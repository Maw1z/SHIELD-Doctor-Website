import { useState } from "react";
import axios from "axios";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { getAuth } from "firebase/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { usePatients } from "@/hooks/usePatients";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  onSuccess,
}: AppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [formData, setFormData] = useState({
    patient_id: "",
    title: "",
  });

  const auth = getAuth();
  const { patientsData, isPatientsLoading } = usePatients();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const doctorId = auth.currentUser?.uid;
    if (!doctorId) {
      toast.error("Auth Error", { description: "You must be logged in." });
      return;
    }

    if (!date || !time || !formData.patient_id) {
      toast.error("Validation Error", {
        description: "Please fill in all fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const [hours, minutes] = time.split(":");
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(parseInt(hours), parseInt(minutes));

      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
      await axios.post(`${baseUrl}/appointments`, {
        doctor_id: doctorId,
        patient_id: formData.patient_id,
        title: formData.title,
        appointment_datetime: combinedDateTime.toISOString(),
      });

      toast.success("Success", {
        description: "Appointment has been scheduled successfully.",
      });

      setFormData({ patient_id: "", title: "" });
      setDate(undefined);
      setTime("");
      onSuccess();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              New Appointment
            </DialogTitle>
            <DialogDescription>
              Select a patient and schedule their visit.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Appointment Title</Label>
              <Input
                id="title"
                placeholder="Routine Checkup"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="patient">Select Patient</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, patient_id: value })
                }
                value={formData.patient_id}
              >
                <SelectTrigger className="w-full" id="patient">
                  <SelectValue
                    placeholder={
                      isPatientsLoading
                        ? "Loading patients..."
                        : "Select a patient"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {patientsData.map((patient) => (
                    <SelectItem key={patient.uuid} value={patient.uuid}>
                      {patient.name}
                    </SelectItem>
                  ))}
                  {patientsData.length === 0 && !isPatientsLoading && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No patients found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
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
            <Button type="submit" disabled={isSubmitting || isPatientsLoading}>
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
