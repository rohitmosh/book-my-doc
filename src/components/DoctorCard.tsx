import { Link } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Doctor {
  _id?: string; id?: string;
  name: string; specialty: string; rating: number; reviews: number;
  fee: number; experience: number; location: string; available: boolean;
}

interface Props {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: Props) => {
  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-primary/30">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-semibold text-lg">
        {initials}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          </div>
          <Badge variant={doctor.available ? "default" : "secondary"}>
            {doctor.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {doctor.rating} ({doctor.reviews})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {doctor.experience} yrs
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {doctor.location}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-semibold text-foreground">${doctor.fee}<span className="text-sm font-normal text-muted-foreground"> / visit</span></span>
          <Link to={`/doctors/${doctor._id || doctor.id}`}>
            <Button size="sm" disabled={!doctor.available}>
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
