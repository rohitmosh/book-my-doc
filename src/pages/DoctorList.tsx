import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import DoctorCard from "@/components/DoctorCard";
import { doctors, specialties } from "@/data/mockData";

const DoctorList = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialSpecialty = searchParams.get("specialty") || "all";

  const [search, setSearch] = useState(initialSearch);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [gender, setGender] = useState("all");
  const [maxFee, setMaxFee] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSearch =
        !search ||
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(search.toLowerCase());
      const matchSpecialty = specialty === "all" || doc.specialty === specialty;
      const matchGender = gender === "all" || doc.gender === gender;
      const matchFee =
        maxFee === "all" ||
        (maxFee === "100" && doc.fee <= 100) ||
        (maxFee === "150" && doc.fee <= 150) ||
        (maxFee === "200" && doc.fee <= 200);
      return matchSearch && matchSpecialty && matchGender && matchFee;
    });
  }, [search, specialty, gender, maxFee]);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Find a Doctor</h1>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 mb-6 sm:grid-cols-3 animate-fade-in">
          <div>
            <Label>Specialty</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Max Fee</Label>
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
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4">{filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found</p>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          No doctors found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default DoctorList;
