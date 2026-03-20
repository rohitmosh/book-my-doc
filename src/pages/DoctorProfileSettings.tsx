import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";

const specialties = [
  "General Physician", "Cardiologist", "Dermatologist", "Pediatrician",
  "Orthopedic", "Neurologist", "Gynecologist", "Ophthalmologist", "ENT Specialist", "Psychiatrist",
];

const DoctorProfileSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // user fields
  const [user, setUser] = useState({ name: "", email: "", phone: "", gender: "Male", aboutMe: "" });
  // doctor profile fields
  const [doc, setDoc] = useState({
    clinicName: "", address: "", city: "", state: "", zip: "", country: "",
    fee: "", specialty: "Cardiologist", specialization: "",
    education: "", college: "", completionYear: "",
    experience: "", experienceFrom: "", experienceTo: "", designation: "",
    awards: "", awardsYear: "", registrations: "", registrationYear: "",
  });

  useEffect(() => {
    api.getProfile().then(({ user: u, doctorProfile: d }) => {
      const usr = u as Record<string, string>;
      setUser({
        name: usr.name || "",
        email: usr.email || "",
        phone: usr.phone || "",
        gender: usr.gender || "Male",
        aboutMe: usr.aboutMe || "",
      });
      if (d) {
        const dp = d as Record<string, string>;
        setDoc({
          clinicName: dp.clinic || "",
          address: dp.address || "",
          city: dp.city || "",
          state: dp.state || "",
          zip: dp.zip || "",
          country: dp.country || "",
          fee: String(dp.fee || ""),
          specialty: dp.specialty || "Cardiologist",
          specialization: dp.specialization || "",
          education: dp.education || "",
          college: dp.college || "",
          completionYear: dp.completionYear || "",
          experience: dp.experience || "",
          experienceFrom: dp.experienceFrom || "",
          experienceTo: dp.experienceTo || "",
          designation: dp.designation || "",
          awards: dp.awards || "",
          awardsYear: dp.awardsYear || "",
          registrations: dp.registrations || "",
          registrationYear: dp.registrationYear || "",
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateUser = (key: string, value: string) => setUser((prev) => ({ ...prev, [key]: value }));
  const updateDoc = (key: string, value: string) => setDoc((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({
        ...user,
        doctorProfile: {
          clinic: doc.clinicName,
          fee: Number(doc.fee),
          specialty: doc.specialty,
          specialization: doc.specialization,
          education: doc.education,
          about: user.aboutMe,
          address: doc.address,
          city: doc.city,
          state: doc.state,
          zip: doc.zip,
          country: doc.country,
          college: doc.college,
          completionYear: doc.completionYear,
          experience: doc.experience,
          experienceFrom: doc.experienceFrom,
          experienceTo: doc.experienceTo,
          designation: doc.designation,
          awards: doc.awards,
          awardsYear: doc.awardsYear,
          registrations: doc.registrations,
          registrationYear: doc.registrationYear,
        },
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container py-16 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/doctor/dashboard">
          <Button variant="outline" size="sm" className="gap-1"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">UPDATE YOUR INFORMATION</h1>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Full Name</Label><Input value={user.name} onChange={(e) => updateUser("name", e.target.value)} /></div>
          <div><Label>Email</Label><Input value={user.email} onChange={(e) => updateUser("email", e.target.value)} type="email" /></div>
          <div><Label>Phone</Label><Input value={user.phone} onChange={(e) => updateUser("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
          <div>
            <Label>Gender</Label>
            <Select value={user.gender} onValueChange={(v) => updateUser("gender", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div><Label>About Me</Label><Textarea value={user.aboutMe} onChange={(e) => updateUser("aboutMe", e.target.value)} rows={3} /></div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Clinic Info</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Clinic Name</Label><Input value={doc.clinicName} onChange={(e) => updateDoc("clinicName", e.target.value)} /></div>
            <div><Label>Address</Label><Input value={doc.address} onChange={(e) => updateDoc("address", e.target.value)} /></div>
            <div><Label>City</Label><Input value={doc.city} onChange={(e) => updateDoc("city", e.target.value)} /></div>
            <div><Label>State</Label><Input value={doc.state} onChange={(e) => updateDoc("state", e.target.value)} /></div>
            <div><Label>Country</Label><Input value={doc.country} onChange={(e) => updateDoc("country", e.target.value)} /></div>
            <div><Label>PIN Code</Label><Input value={doc.zip} onChange={(e) => updateDoc("zip", e.target.value)} /></div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Pricing & Specialty</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Consultation Fee (₹)</Label><Input value={doc.fee} onChange={(e) => updateDoc("fee", e.target.value)} /></div>
            <div>
              <Label>Specialty</Label>
              <Select value={doc.specialty} onValueChange={(v) => updateDoc("specialty", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{specialties.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2"><Label>Specialization</Label><Input value={doc.specialization} onChange={(e) => updateDoc("specialization", e.target.value)} placeholder="e.g. Heart, ICU, Diabetes" /></div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Education</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Degree</Label><Input value={doc.education} onChange={(e) => updateDoc("education", e.target.value)} /></div>
            <div><Label>College/Institute</Label><Input value={doc.college} onChange={(e) => updateDoc("college", e.target.value)} /></div>
            <div><Label>Year of Completion</Label><Input value={doc.completionYear} onChange={(e) => updateDoc("completionYear", e.target.value)} /></div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Experience</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Place</Label><Input value={doc.experience} onChange={(e) => updateDoc("experience", e.target.value)} /></div>
            <div><Label>From</Label><Input value={doc.experienceFrom} onChange={(e) => updateDoc("experienceFrom", e.target.value)} /></div>
            <div><Label>To</Label><Input value={doc.experienceTo} onChange={(e) => updateDoc("experienceTo", e.target.value)} /></div>
          </div>
          <div className="mt-2"><Label>Designation</Label><Input value={doc.designation} onChange={(e) => updateDoc("designation", e.target.value)} /></div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Awards</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Award</Label><Input value={doc.awards} onChange={(e) => updateDoc("awards", e.target.value)} /></div>
            <div><Label>Year</Label><Input value={doc.awardsYear} onChange={(e) => updateDoc("awardsYear", e.target.value)} /></div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Registrations</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Registration</Label><Input value={doc.registrations} onChange={(e) => updateDoc("registrations", e.target.value)} /></div>
            <div><Label>Year</Label><Input value={doc.registrationYear} onChange={(e) => updateDoc("registrationYear", e.target.value)} /></div>
          </div>
        </div>

        <div className="border-t pt-6">
          <Button size="lg" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileSettings;
