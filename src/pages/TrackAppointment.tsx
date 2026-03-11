import { useState } from "react";
import { Search, FlaskConical, Microscope, Building2, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppointmentTimeline from "@/components/AppointmentTimeline";
import { patientAppointments } from "@/data/mockData";
import type { Appointment } from "@/data/mockData";

const services = [
  { icon: Stethoscope, label: "Doctor" },
  { icon: FlaskConical, label: "Laboratory" },
  { icon: Microscope, label: "ICU" },
  { icon: Building2, label: "Chamber" },
];

const TrackAppointment = () => {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<Appointment | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = () => {
    setSearched(true);
    const found = patientAppointments.find((a) => a.id === trackingId.trim());
    setResult(found || null);
  };

  return (
    <div className="flex flex-col">
      {/* Track Section */}
      <section className="bg-card border-b py-12">
        <div className="container max-w-xl text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Track Your Appointment</h1>
          <p className="text-muted-foreground font-body mb-6">Enter your appointment ID to check status</p>

          <div className="flex gap-2">
            <Input
              placeholder="e.g., a1"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              className="h-11"
            />
            <Button onClick={handleTrack} className="h-11 gap-2">
              <Search className="h-4 w-4" /> Track
            </Button>
          </div>

          {searched && result && (
            <div className="mt-8 rounded-lg border bg-background p-6 text-left space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{result.doctorName}</h3>
                  <p className="text-sm text-muted-foreground">{result.specialty}</p>
                </div>
                <Badge variant={result.status === "completed" ? "default" : "outline"}>
                  Status: {result.status}
                </Badge>
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Appointment Date: {result.date}</p>
                <p>Appointment Time: {result.time}</p>
                <p>Patient: {result.patientName}</p>
              </div>
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-foreground mb-3">APPOINTMENT TIMELINE</h4>
                <AppointmentTimeline status={result.status} />
              </div>
            </div>
          )}

          {searched && !result && (
            <p className="mt-6 text-sm text-destructive">No appointment found with that ID. Try: a1, a2, or a3</p>
          )}
        </div>
      </section>

      {/* Available Services */}
      <section className="bg-background py-12">
        <div className="container text-center">
          <h2 className="text-xl font-bold text-foreground mb-8">AVAILABLE SERVICES</h2>
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto md:grid-cols-4 md:max-w-2xl">
            {services.map((service) => (
              <div key={service.label} className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-primary">
                  <service.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-medium text-foreground">{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrackAppointment;
