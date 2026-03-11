import { useState } from "react";
import { Users, Calendar, DollarSign, Activity, Check, X, FileText, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { doctorAppointments, prescriptions } from "@/data/mockData";
import type { Appointment, Prescription } from "@/data/mockData";
import PrescriptionView from "@/components/PrescriptionView";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState(doctorAppointments);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewPrescription, setViewPrescription] = useState<Prescription | null>(null);
  const [viewPrescriptionOpen, setViewPrescriptionOpen] = useState(false);

  // Prescription form state
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medDuration, setMedDuration] = useState("");
  const [medInstructions, setMedInstructions] = useState("");
  const [medications, setMedications] = useState<{ name: string; dosage: string; duration: string; instructions: string }[]>([]);
  const [notes, setNotes] = useState("");

  const stats = [
    { icon: Users, label: "Total Patients", value: appointments.length },
    { icon: Calendar, label: "Upcoming", value: appointments.filter((a) => a.status === "scheduled" || a.status === "pending").length },
    { icon: Activity, label: "In Progress", value: appointments.filter((a) => a.status === "in-progress").length },
    { icon: DollarSign, label: "Revenue", value: `$${appointments.filter((a) => a.status === "completed").length * 150}` },
  ];

  const acceptAppointment = (id: string) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "scheduled" as const } : a));
    toast.success("Appointment accepted");
  };

  const rejectAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    toast.info("Appointment declined");
  };

  const openPrescriptionForm = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setDiagnosis("");
    setSymptoms(apt.symptoms || "");
    setMedications([]);
    setMedName(""); setMedDosage(""); setMedDuration(""); setMedInstructions("");
    setNotes("");
    setPrescriptionModalOpen(true);
  };

  const addMedication = () => {
    if (!medName.trim()) return;
    setMedications((prev) => [...prev, { name: medName, dosage: medDosage, duration: medDuration, instructions: medInstructions }]);
    setMedName(""); setMedDosage(""); setMedDuration(""); setMedInstructions("");
  };

  const submitPrescription = () => {
    if (!diagnosis.trim() || medications.length === 0) {
      toast.error("Please add a diagnosis and at least one medication");
      return;
    }
    setAppointments((prev) => prev.map((a) => a.id === selectedAppointment?.id ? { ...a, status: "completed" as const } : a));
    toast.success("Prescription issued successfully!");
    setPrescriptionModalOpen(false);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="default">Completed</Badge>;
      case "scheduled": return <Badge variant="secondary" className="border-info text-info">Scheduled</Badge>;
      case "in-progress": return <Badge variant="secondary" className="border-warning text-warning">In Progress</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Doctor Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Issued Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4 mt-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{apt.patientName}</h3>
                  <p className="text-sm text-muted-foreground">{apt.date} at {apt.time}</p>
                </div>
                {statusBadge(apt.status)}
              </div>
              {apt.symptoms && <p className="text-sm font-body text-muted-foreground mb-3">Symptoms: {apt.symptoms}</p>}

              <div className="flex gap-2 flex-wrap">
                {apt.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => acceptAppointment(apt.id)} className="gap-1">
                      <Check className="h-3.5 w-3.5" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => rejectAppointment(apt.id)} className="gap-1 text-destructive">
                      <X className="h-3.5 w-3.5" /> Decline
                    </Button>
                  </>
                )}
                {(apt.status === "scheduled" || apt.status === "in-progress") && (
                  <Button size="sm" onClick={() => openPrescriptionForm(apt)} className="gap-1">
                    <Pill className="h-3.5 w-3.5" /> Write Prescription
                  </Button>
                )}
                {apt.status === "completed" && apt.prescriptionId && (
                  <Button size="sm" variant="outline" onClick={() => {
                    const p = prescriptions.find((pr) => pr.id === apt.prescriptionId);
                    if (p) { setViewPrescription(p); setViewPrescriptionOpen(true); }
                  }} className="gap-1">
                    <FileText className="h-3.5 w-3.5" /> View Prescription
                  </Button>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4 mt-4">
          {prescriptions.map((p) => (
            <div key={p.id} className="rounded-lg border bg-card p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{p.patientName}</h3>
                <p className="text-sm text-muted-foreground">{p.diagnosis}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.date}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setViewPrescription(p); setViewPrescriptionOpen(true); }}>
                View
              </Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Prescription Form Modal */}
      <Dialog open={prescriptionModalOpen} onOpenChange={setPrescriptionModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Write Prescription — {selectedAppointment?.patientName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Symptoms</Label>
              <Input value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g., headache, fever" />
            </div>
            <div>
              <Label>Diagnosis</Label>
              <Textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Enter diagnosis..." rows={2} />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-foreground mb-3">Medications</h4>
              {medications.map((med, idx) => (
                <div key={idx} className="rounded border p-2 mb-2 text-sm flex justify-between items-center">
                  <span><span className="font-medium">{med.name}</span> — {med.dosage}, {med.duration}</span>
                  <Button variant="ghost" size="sm" onClick={() => setMedications((prev) => prev.filter((_, i) => i !== idx))}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Medicine</Label><Input value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="Aspirin" /></div>
                <div><Label className="text-xs">Dosage</Label><Input value={medDosage} onChange={(e) => setMedDosage(e.target.value)} placeholder="75mg" /></div>
                <div><Label className="text-xs">Duration</Label><Input value={medDuration} onChange={(e) => setMedDuration(e.target.value)} placeholder="30 days" /></div>
                <div><Label className="text-xs">Instructions</Label><Input value={medInstructions} onChange={(e) => setMedInstructions(e.target.value)} placeholder="After meals" /></div>
              </div>
              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={addMedication}>
                + Add Medication
              </Button>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={2} />
            </div>

            <Button className="w-full" size="lg" onClick={submitPrescription}>
              Issue Prescription
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PrescriptionView prescription={viewPrescription} open={viewPrescriptionOpen} onOpenChange={setViewPrescriptionOpen} />
    </div>
  );
};

export default DoctorDashboard;
