import { useState } from "react";
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
import apiClient from "@/api/apiClient";

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

      await apiClient.post(`/appointments`, {
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
      <DialogContent className="w-[95vw] sm:max-w-md overflow-y-auto max-h-[90vh]">
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
                className="text-base"
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
                <SelectTrigger className="w-full text-base" id="patient">
                  <SelectValue
                    placeholder={
                      isPatientsLoading ? "Loading..." : "Select a patient"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-50">
                  {patientsData.map((patient) => (
                    <SelectItem key={patient.uuid} value={patient.uuid}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal text-base sm:text-sm",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {date ? format(date, "PPP") : "Pick a date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
                  className="text-base sm:text-sm"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
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
              disabled={isSubmitting || isPatientsLoading}
              className="w-full sm:w-auto"
            >
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
