import { useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { specialties } from "@/data/mockData";

const DoctorProfileSettings = () => {
  const [form, setForm] = useState({
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.mitchell@clinic.com",
    phone: "+1 555 123 4567",
    gender: "Female",
    aboutMe: "Board-certified cardiologist specializing in preventive cardiology and heart failure management with over 12 years of clinical experience.",
    clinicName: "HeartCare Clinic",
    address: "5th Avenue",
    city: "New York",
    state: "New York",
    zip: "10001",
    country: "USA",
    pricing: "150",
    specialty: "Cardiologist",
    specialization: "Heart, ICU, FCPS, Diabetes",
    education: "MBBS, FCPS",
    college: "Harvard Medical School",
    completionYear: "2014",
    experience: "Heart Foundation",
    experienceFrom: "2014",
    experienceTo: "2026",
    designation: "MBBS FCPS Cardiologist",
    awards: "Heart Foundation 2021",
    awardsYear: "2021",
    registrations: "Appstones",
    registrationYear: "2020",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/doctor/dashboard">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">UPDATE YOUR INFORMATION</h1>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-2xl">
          <User className="h-8 w-8" />
        </div>
        <div>
          <Button variant="outline" size="sm">Change Photo</Button>
          <p className="text-xs text-muted-foreground mt-1">Allowed JPG, GIF or PNG. Max size of 2MB</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>First Name</Label>
            <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => update("email", e.target.value)} type="email" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* About Me */}
        <div>
          <Label>About Me</Label>
          <Textarea value={form.aboutMe} onChange={(e) => update("aboutMe", e.target.value)} rows={3} />
        </div>

        {/* Clinic Info */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Clinic Info</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Clinic Name</Label><Input value={form.clinicName} onChange={(e) => update("clinicName", e.target.value)} /></div>
            <div><Label>Address</Label><Input value={form.address} onChange={(e) => update("address", e.target.value)} /></div>
            <div><Label>City</Label><Input value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Contact Details</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>State</Label><Input value={form.state} onChange={(e) => update("state", e.target.value)} /></div>
            <div><Label>Country</Label><Input value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
            <div><Label>ZIP</Label><Input value={form.zip} onChange={(e) => update("zip", e.target.value)} /></div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Pricing</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>$ Pricing</Label><Input value={form.pricing} onChange={(e) => update("pricing", e.target.value)} /></div>
          </div>
        </div>

        {/* Services & Specialization */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Services and Specialization</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Select Specialty</Label>
              <Select value={form.specialty} onValueChange={(v) => update("specialty", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Specialization</Label>
              <Input value={form.specialization} onChange={(e) => update("specialization", e.target.value)} placeholder="Heart, ICU, FCPS" />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Education</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Degree</Label><Input value={form.education} onChange={(e) => update("education", e.target.value)} /></div>
            <div><Label>College/Institute</Label><Input value={form.college} onChange={(e) => update("college", e.target.value)} /></div>
            <div><Label>Year of Completion</Label><Input value={form.completionYear} onChange={(e) => update("completionYear", e.target.value)} /></div>
          </div>
        </div>

        {/* Experience */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Experience</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Place</Label><Input value={form.experience} onChange={(e) => update("experience", e.target.value)} /></div>
            <div><Label>From</Label><Input value={form.experienceFrom} onChange={(e) => update("experienceFrom", e.target.value)} /></div>
            <div><Label>To</Label><Input value={form.experienceTo} onChange={(e) => update("experienceTo", e.target.value)} /></div>
          </div>
          <div className="mt-2">
            <Label>Designation</Label>
            <Input value={form.designation} onChange={(e) => update("designation", e.target.value)} />
          </div>
        </div>

        {/* Awards */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Awards</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Awards</Label><Input value={form.awards} onChange={(e) => update("awards", e.target.value)} /></div>
            <div><Label>Year</Label><Input value={form.awardsYear} onChange={(e) => update("awardsYear", e.target.value)} /></div>
          </div>
        </div>

        {/* Registrations */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Registrations</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Registration</Label><Input value={form.registrations} onChange={(e) => update("registrations", e.target.value)} /></div>
            <div><Label>Year</Label><Input value={form.registrationYear} onChange={(e) => update("registrationYear", e.target.value)} /></div>
          </div>
        </div>

        <div className="border-t pt-6">
          <Button size="lg" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileSettings;
