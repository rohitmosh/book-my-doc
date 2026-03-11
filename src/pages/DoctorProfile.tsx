import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Clock, GraduationCap, Building, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doctors } from "@/data/mockData";
import BookingModal from "@/components/BookingModal";

const DoctorProfile = () => {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === id);
  const [bookingOpen, setBookingOpen] = useState(false);

  if (!doctor) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Doctor not found.</p>
        <Link to="/doctors"><Button variant="outline" className="mt-4">Back to List</Button></Link>
      </div>
    );
  }

  const initials = doctor.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="container py-8 max-w-3xl">
      <Link to="/doctors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to doctors
      </Link>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex gap-4 items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold text-2xl">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
                <p className="text-muted-foreground">{doctor.specialty}</p>
              </div>
              <Badge variant={doctor.available ? "default" : "secondary"}>
                {doctor.available ? "Available" : "Unavailable"}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /> {doctor.rating} ({doctor.reviews} reviews)</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {doctor.experience} years experience</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {doctor.location}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t pt-6">
          <div>
            <h3 className="font-semibold text-foreground mb-1">About</h3>
            <p className="text-sm font-body text-muted-foreground">{doctor.about}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <GraduationCap className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Education</p>
                <p className="text-sm text-muted-foreground">{doctor.education}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Clinic</p>
                <p className="text-sm text-muted-foreground">{doctor.clinic}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">${doctor.fee}</span>
              <span className="text-sm text-muted-foreground"> / consultation</span>
            </div>
            <Button size="lg" disabled={!doctor.available} onClick={() => setBookingOpen(true)}>
              Book Appointment
            </Button>
          </div>
        </div>
      </div>

      <BookingModal doctor={doctor} open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
};

export default DoctorProfile;
