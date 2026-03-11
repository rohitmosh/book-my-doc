import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type { Doctor } from "@/data/mockData";

interface Props {
  doctor: Doctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "date" | "info" | "confirm";

const BookingModal = ({ doctor, open, onOpenChange }: Props) => {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const resetForm = () => {
    setStep("date");
    setSelectedDate(undefined);
    setSelectedSlot("");
    setPatientName("");
    setPatientPhone("");
    setSymptoms("");
  };

  const handleConfirm = () => {
    toast.success("Appointment booked successfully!", {
      description: `Your appointment with ${doctor.name} is confirmed.`,
    });
    resetForm();
    onOpenChange(false);
  };

  const isDateStepValid = selectedDate && selectedSlot;
  const isInfoStepValid = patientName.trim() && patientPhone.trim();

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); onOpenChange(val); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book Appointment — {doctor.name}</DialogTitle>
        </DialogHeader>

        {/* Date Section */}
        <div className="space-y-3">
          <button
            onClick={() => step !== "date" && setStep("date")}
            className="flex w-full items-center justify-between text-left"
          >
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              {step !== "date" && isDateStepValid && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span>
              )}
              1. Select Date & Time
            </h4>
            {step !== "date" && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>

          {step === "date" && (
            <div className="space-y-3 animate-fade-in">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border pointer-events-auto"
              />
              {selectedDate && (
                <div>
                  <Label className="mb-2 block">Available Slots</Label>
                  <div className="flex flex-wrap gap-2">
                    {doctor.slots.map((slot) => (
                      <Button
                        key={slot}
                        size="sm"
                        variant={selectedSlot === slot ? "default" : "outline"}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <Button
                className="w-full"
                disabled={!isDateStepValid}
                onClick={() => setStep("info")}
              >
                Continue
              </Button>
            </div>
          )}

          {step !== "date" && isDateStepValid && (
            <p className="text-sm text-muted-foreground pl-7">
              {selectedDate?.toLocaleDateString()} at {selectedSlot}
            </p>
          )}
        </div>

        <div className="border-t" />

        {/* Info Section */}
        <div className="space-y-3">
          <button
            onClick={() => step === "confirm" && setStep("info")}
            className="flex w-full items-center justify-between text-left"
          >
            <h4 className={cn("font-semibold flex items-center gap-2", step === "date" ? "text-muted-foreground/40" : "text-foreground")}>
              {step === "confirm" && isInfoStepValid && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span>
              )}
              2. Patient Information
            </h4>
            {step === "confirm" && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>

          {step === "info" && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="+1 234 567 8900" />
              </div>
              <div>
                <Label htmlFor="symptoms">Symptoms (optional)</Label>
                <Textarea id="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Describe your symptoms..." rows={3} />
              </div>
              <Button className="w-full" disabled={!isInfoStepValid} onClick={() => setStep("confirm")}>
                Review Booking
              </Button>
            </div>
          )}

          {step === "confirm" && isInfoStepValid && (
            <p className="text-sm text-muted-foreground pl-7">{patientName} — {patientPhone}</p>
          )}
        </div>

        <div className="border-t" />

        {/* Confirm Section */}
        <div className="space-y-3">
          <h4 className={cn("font-semibold", step !== "confirm" ? "text-muted-foreground/40" : "text-foreground")}>
            3. Confirm & Pay
          </h4>

          {step === "confirm" && (
            <div className="space-y-3 animate-fade-in">
              <div className="rounded-lg border bg-secondary/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{doctor.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Specialty</span><span>{doctor.specialty}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{selectedDate?.toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{selectedSlot}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span>{patientName}</span></div>
                <div className="border-t pt-2 flex justify-between font-semibold text-foreground">
                  <span>Consultation Fee</span><span>${doctor.fee}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleConfirm}>
                Confirm Booking — ${doctor.fee}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
