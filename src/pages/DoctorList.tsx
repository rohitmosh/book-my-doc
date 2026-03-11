import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Star, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { doctors, specialties } from "@/data/mockData";

const DoctorList = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialSpecialty = searchParams.get("specialty") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(initialSpecialty ? [initialSpecialty] : []);
  const [gender, setGender] = useState("all");
  const [maxFee, setMaxFee] = useState("all");

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const filtered = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSearch =
        !search ||
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(search.toLowerCase());
      const matchSpecialty = selectedSpecialties.length === 0 || selectedSpecialties.includes(doc.specialty);
      const matchGender = gender === "all" || doc.gender === gender;
      const matchFee =
        maxFee === "all" ||
        (maxFee === "100" && doc.fee <= 100) ||
        (maxFee === "150" && doc.fee <= 150) ||
        (maxFee === "200" && doc.fee <= 200);
      return matchSearch && matchSpecialty && matchGender && matchFee;
    });
  }, [search, selectedSpecialties, gender, maxFee]);

  return (
    <div className="flex flex-col">
      {/* Header Banner */}
      <div className="bg-primary/10 border-b py-10 text-center">
        <h1 className="text-3xl font-bold text-foreground">DOCTORS</h1>
        <p className="text-muted-foreground mt-1 font-body">Find the right specialist for your needs</p>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Left Sidebar Filters */}
          <aside className="hidden md:block w-64 shrink-0 space-y-6">
            <div className="rounded-lg border bg-card p-4 space-y-5">
              <h3 className="font-semibold text-foreground">Doctor Filter</h3>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Gender */}
              <div>
                <Label className="mb-2 block text-sm font-medium">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <Label className="mb-2 block text-sm font-medium">Price Range</Label>
                <Select value={maxFee} onValueChange={setMaxFee}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="100">Up to $100</SelectItem>
                    <SelectItem value="150">Up to $150</SelectItem>
                    <SelectItem value="200">Up to $200</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specialty Checkboxes */}
              <div>
                <Label className="mb-2 block text-sm font-medium">Select Specialty</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {specialties.map((spec) => (
                    <label key={spec} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedSpecialties.includes(spec)}
                        onCheckedChange={() => toggleSpecialty(spec)}
                      />
                      <span className="text-foreground">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full gap-2" onClick={() => {}}>
                <Search className="h-4 w-4" /> Search
              </Button>
            </div>
          </aside>

          {/* Doctor Cards */}
          <div className="flex-1 space-y-4">
            {/* Mobile search */}
            <div className="md:hidden relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <p className="text-sm text-muted-foreground">{filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found</p>

            {filtered.map((doctor) => {
              const initials = doctor.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
              return (
                <div key={doctor.id} className="rounded-lg border bg-card p-5 flex gap-5 hover:shadow-md transition-shadow">
                  {/* Avatar */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xl">
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        <Badge variant={doctor.available ? "default" : "secondary"}>
                          {doctor.available ? "Available" : "Unavailable"}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">${doctor.fee} - ${doctor.fee + 50}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        {doctor.rating} ({doctor.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {doctor.experience} yrs
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {doctor.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Link to={`/doctors/${doctor.id}`}>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </Link>
                      <Link to={`/doctors/${doctor.id}`}>
                        <Button size="sm" disabled={!doctor.available}>Book Appointment</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                No doctors found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
