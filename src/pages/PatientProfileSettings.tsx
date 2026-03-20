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

const PatientProfileSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", gender: "Male",
    dob: "", bloodGroup: "", aboutMe: "",
    address: "", city: "", state: "", zip: "", country: "",
    emergencyName: "", emergencyRelation: "", emergencyPhone: "",
    allergies: "", currentMedications: "", pastConditions: "",
    insuranceProvider: "", insurancePolicyNumber: "",
  });

  useEffect(() => {
    api.getProfile().then(({ user }) => {
      const u = user as Record<string, string>;
      setForm({
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        gender: u.gender || "Male",
        dob: u.dob || "",
        bloodGroup: u.bloodGroup || "",
        aboutMe: u.aboutMe || "",
        address: u.address || "",
        city: u.city || "",
        state: u.state || "",
        zip: u.zip || "",
        country: u.country || "",
        emergencyName: u.emergencyName || "",
        emergencyRelation: u.emergencyRelation || "",
        emergencyPhone: u.emergencyPhone || "",
        allergies: u.allergies || "",
        currentMedications: u.currentMedications || "",
        pastConditions: u.pastConditions || "",
        insuranceProvider: u.insuranceProvider || "",
        insurancePolicyNumber: u.insurancePolicyNumber || "",
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile(form);
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
        <Link to="/patient/dashboard">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">UPDATE YOUR INFORMATION</h1>
      </div>

      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Full Name</Label><Input value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={(e) => update("email", e.target.value)} type="email" /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
          <div>
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} /></div>
          <div>
            <Label>Blood Group</Label>
            <Select value={form.bloodGroup || "O+"} onValueChange={(v) => update("bloodGroup", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
                  <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div><Label>About Me</Label><Textarea value={form.aboutMe} onChange={(e) => update("aboutMe", e.target.value)} rows={3} /></div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Address</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Address</Label><Input value={form.address} onChange={(e) => update("address", e.target.value)} /></div>
            <div><Label>City</Label><Input value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
            <div><Label>State</Label><Input value={form.state} onChange={(e) => update("state", e.target.value)} /></div>
            <div><Label>Country</Label><Input value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
            <div><Label>PIN Code</Label><Input value={form.zip} onChange={(e) => update("zip", e.target.value)} /></div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Emergency Contact</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Name</Label><Input value={form.emergencyName} onChange={(e) => update("emergencyName", e.target.value)} /></div>
            <div><Label>Relation</Label><Input value={form.emergencyRelation} onChange={(e) => update("emergencyRelation", e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={form.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} /></div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Medical History</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Allergies</Label><Input value={form.allergies} onChange={(e) => update("allergies", e.target.value)} /></div>
            <div><Label>Current Medications</Label><Input value={form.currentMedications} onChange={(e) => update("currentMedications", e.target.value)} /></div>
          </div>
          <div className="mt-4"><Label>Past Medical Conditions</Label><Textarea value={form.pastConditions} onChange={(e) => update("pastConditions", e.target.value)} rows={2} /></div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4">Insurance Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Insurance Provider</Label><Input value={form.insuranceProvider} onChange={(e) => update("insuranceProvider", e.target.value)} /></div>
            <div><Label>Policy Number</Label><Input value={form.insurancePolicyNumber} onChange={(e) => update("insurancePolicyNumber", e.target.value)} /></div>
          </div>
        </div>

        <div className="border-t pt-6">
          <Button size="lg" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileSettings;
