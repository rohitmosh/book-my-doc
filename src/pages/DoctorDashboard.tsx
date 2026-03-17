import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, DollarSign, Activity, Check, X, FileText, Pill, LayoutDashboard, ClipboardList, User, LogOut, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import PrescriptionView from "@/components/PrescriptionView";

interface Appointment {
  _id: string; id?: string;
  doctorId: string; doctorName: string; specialty: string;
  patientId: string; patientName: string;
  date: string; time: string;
  status: "pending" | "scheduled" | "in-progress" | "completed";
  symptoms?: string; prescriptionId?: string;
}

interface Prescription {
  _id: string; id?: string;
  appointmentId: string; doctorName: string; patientName: string;
  date: string; diagnosis: string; symptoms: string[];
  medications: { name: string; dosage: string; duration: string; instructions: string }[];
  notes: string;
}

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: ClipboardList, label: "Appointments", key: "appointments" },
  { icon: FileText, label: "Prescription", key: "prescriptions" },
  { icon: User, label: "Profile Settings", key: "profile", link: "/doctor/profile-settings" },
  { icon: LogOut, label: "Logout", key: "logout", link: "/login" },
];

const statusBadge = (status: string) => {
  switch (status) {
    case "completed": return <Badge variant="default">Completed</Badge>;
    case "scheduled": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Scheduled</Badge>;
    case "in-progress": return <Badge className="bg-amber-100 text-amber-700 border-amber-200">In Progress</Badge>;
    default: return <Badge variant="outline" className="border-orange-300 text-orange-600">Pending</Badge>;
  }
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewPrescription, setViewPrescription] = useState<Prescription | null>(null);
  const [viewPrescriptionOpen, setViewPrescriptionOpen] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medDuration, setMedDuration] = useState("");
  const [medInstructions, setMedInstructions] = useState("");
  const [medications, setMedications] = useState<{ name: string; dosage: string; duration: string; instructions: string }[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    api.getAppointments().then((data) => setAppointments(data as Appointment[])).catch(() => {});
    api.getPrescriptions().then((data) => setPrescriptions(data as Prescription[])).catch(() => {});
  }, []);

  const stats = [
    { icon: Users, label: "Total Patients", value: appointments.length },
    { icon: Calendar, label: "Upcoming", value: appointments.filter((a) => a.status === "scheduled" || a.status === "pending").length },
    { icon: Activity, label: "In Progress", value: appointments.filter((a) => a.status === "in-progress").length },
    { icon: DollarSign, label: "Revenue", value: `$${appointments.filter((a) => a.status === "completed").length * 150}` },
  ];

  const acceptAppointment = async (id: string) => {
    try {
      await api.updateAppointmentStatus(id, "scheduled");
      setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: "scheduled" } : a));
      toast.success("Appointment accepted");
    } catch { toast.error("Failed to update"); }
  };

  const rejectAppointment = async (id: string) => {
    try {
      await api.cancelAppointment(id);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      toast.info("Appointment declined");
    } catch { toast.error("Failed to update"); }
  };

  const openPrescriptionForm = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setDiagnosis(""); setSymptoms(apt.symptoms || "");
    setMedications([]); setMedName(""); setMedDosage(""); setMedDuration(""); setMedInstructions(""); setNotes("");
    setPrescriptionModalOpen(true);
  };

  const addMedication = () => {
    if (!medName.trim()) return;
    setMedications((prev) => [...prev, { name: medName, dosage: medDosage, duration: medDuration, instructions: medInstructions }]);
    setMedName(""); setMedDosage(""); setMedDuration(""); setMedInstructions("");
  };

  const submitPrescription = async () => {
    if (!diagnosis.trim() || medications.length === 0) { toast.error("Please add a diagnosis and at least one medication"); return; }
    if (!selectedAppointment) return;
    try {
      const newPrescription = await api.createPrescription({
        appointmentId: selectedAppointment._id,
        doctorName: selectedAppointment.doctorName,
        patientName: selectedAppointment.patientName,
        date: new Date().toISOString().split("T")[0],
        diagnosis, symptoms: symptoms.split(",").map((s) => s.trim()).filter(Boolean),
        medications, notes,
      });
      setAppointments((prev) => prev.map((a) => a._id === selectedAppointment._id ? { ...a, status: "completed" } : a));
      setPrescriptions((prev) => [...prev, newPrescription as Prescription]);
      toast.success("Prescription issued!");
      setPrescriptionModalOpen(false);
    } catch { toast.error("Failed to issue prescription"); }
  };

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="rounded-lg border bg-card p-5 text-center mb-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-2xl mb-3">
              {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "DR"}
            </div>
            <h3 className="font-semibold text-foreground">{user?.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
          </div>
          <nav className="rounded-lg border bg-card overflow-hidden">
            {sidebarLinks.map((link) => (
              link.link ? (
                <Link key={link.key} to={link.link} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-accent transition-colors">
                  <link.icon className="h-4 w-4" />{link.label}
                </Link>
              ) : (
                <button key={link.key} onClick={() => setActiveSection(link.key)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent ${activeSection === link.key ? "bg-accent text-primary font-medium" : "text-muted-foreground"}`}>
                  <link.icon className="h-4 w-4" />{link.label}
                </button>
              )
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          {viewingAppointment ? (
            <div className="space-y-6">
              <Button variant="outline" size="sm" onClick={() => setViewingAppointment(null)}>← Back to list</Button>
              <div className="rounded-lg border bg-card p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Date: {viewingAppointment.date}</p>
                    <div className="flex items-center gap-2 mt-1"><span className="text-sm font-medium">Status:</span>{statusBadge(viewingAppointment.status)}</div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-foreground mb-4 text-center">APPOINTMENT INFORMATION</h3>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Meeting Date:</span><span>{viewingAppointment.date}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Meeting Time:</span><span>{viewingAppointment.time}</span></div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-foreground mb-3 text-center">PATIENT INFORMATION</h4>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                      {viewingAppointment.patientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{viewingAppointment.patientName}</p>
                      {viewingAppointment.symptoms && <p className="text-sm text-muted-foreground">Symptoms: {viewingAppointment.symptoms}</p>}
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4 flex gap-2 flex-wrap">
                  {viewingAppointment.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => { acceptAppointment(viewingAppointment._id); setViewingAppointment(null); }} className="gap-1"><Check className="h-3.5 w-3.5" /> Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => { rejectAppointment(viewingAppointment._id); setViewingAppointment(null); }} className="gap-1 text-destructive"><X className="h-3.5 w-3.5" /> Decline</Button>
                    </>
                  )}
                  {(viewingAppointment.status === "scheduled" || viewingAppointment.status === "in-progress") && (
                    <Button size="sm" onClick={() => openPrescriptionForm(viewingAppointment)} className="gap-1"><Pill className="h-3.5 w-3.5" /> Write Prescription</Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeSection === "dashboard" && (
                <>
                  <h1 className="text-2xl font-bold text-foreground mb-6">Doctor Dashboard</h1>
                  <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-lg border bg-card p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><stat.icon className="h-5 w-5" /></div>
                        <div><p className="text-2xl font-bold text-foreground">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border bg-card overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Symptoms</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                      </tr></thead>
                      <tbody>
                        {appointments.map((apt, idx) => (
                          <tr key={apt._id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-3 text-muted-foreground">{idx + 1}</td>
                            <td className="p-3 font-medium text-foreground">{apt.patientName}</td>
                            <td className="p-3 text-muted-foreground">{apt.symptoms || "General consultation"}</td>
                            <td className="p-3 text-foreground">{apt.date} {apt.time}</td>
                            <td className="p-3">{statusBadge(apt.status)}</td>
                            <td className="p-3">
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => setViewingAppointment(apt)} className="h-7 text-xs"><Eye className="h-3 w-3" /></Button>
                                {apt.status === "pending" && (<>
                                  <Button size="sm" variant="default" onClick={() => acceptAppointment(apt._id)} className="h-7 text-xs"><Check className="h-3 w-3" /></Button>
                                  <Button size="sm" variant="destructive" onClick={() => rejectAppointment(apt._id)} className="h-7 text-xs"><X className="h-3 w-3" /></Button>
                                </>)}
                                {(apt.status === "scheduled" || apt.status === "in-progress") && (
                                  <Button size="sm" variant="default" onClick={() => openPrescriptionForm(apt)} className="h-7 text-xs"><Pill className="h-3 w-3" /></Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeSection === "appointments" && (
                <>
                  <h1 className="text-2xl font-bold text-foreground mb-6">Appointment List</h1>
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <div key={apt._id} className="rounded-lg border bg-card p-5 flex gap-4 items-start">
                        <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg shrink-0">
                          {apt.patientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div><h3 className="font-semibold text-foreground">{apt.patientName}</h3><p className="text-sm text-muted-foreground">{apt.date} at {apt.time}</p></div>
                            {statusBadge(apt.status)}
                          </div>
                          {apt.symptoms && <p className="text-sm text-muted-foreground mt-1">Symptoms: {apt.symptoms}</p>}
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" onClick={() => setViewingAppointment(apt)} className="gap-1"><Eye className="h-3.5 w-3.5" /> View</Button>
                            {apt.status === "pending" && (<>
                              <Button size="sm" onClick={() => acceptAppointment(apt._id)} className="gap-1"><Check className="h-3.5 w-3.5" /> Accept</Button>
                              <Button size="sm" variant="outline" onClick={() => rejectAppointment(apt._id)} className="gap-1 text-destructive"><X className="h-3.5 w-3.5" /> Decline</Button>
                            </>)}
                            {(apt.status === "scheduled" || apt.status === "in-progress") && (
                              <Button size="sm" onClick={() => openPrescriptionForm(apt)} className="gap-1"><Pill className="h-3.5 w-3.5" /> Treatment</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "prescriptions" && (
                <>
                  <h1 className="text-2xl font-bold text-foreground mb-6">Issued Prescriptions</h1>
                  <div className="space-y-4">
                    {prescriptions.map((p) => (
                      <div key={p._id} className="rounded-lg border bg-card p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{p.patientName}</h3>
                          <p className="text-sm text-muted-foreground">{p.diagnosis}</p>
                          <p className="text-xs text-muted-foreground mt-1">{p.date}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => { setViewPrescription(p); setViewPrescriptionOpen(true); }}>View</Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={prescriptionModalOpen} onOpenChange={setPrescriptionModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>Write Prescription — {selectedAppointment?.patientName}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Symptoms</Label><Input value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g., headache, fever" /></div>
            <div><Label>Diagnosis</Label><Textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Enter diagnosis..." rows={2} /></div>
            <div className="border-t pt-4">
              <h4 className="font-semibold text-foreground mb-3">Medications</h4>
              {medications.map((med, idx) => (
                <div key={idx} className="rounded border p-2 mb-2 text-sm flex justify-between items-center">
                  <span><span className="font-medium">{med.name}</span> — {med.dosage}, {med.duration}</span>
                  <Button variant="ghost" size="sm" onClick={() => setMedications((prev) => prev.filter((_, i) => i !== idx))}><X className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Medicine</Label><Input value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="Aspirin" /></div>
                <div><Label className="text-xs">Dosage</Label><Input value={medDosage} onChange={(e) => setMedDosage(e.target.value)} placeholder="75mg" /></div>
                <div><Label className="text-xs">Duration</Label><Input value={medDuration} onChange={(e) => setMedDuration(e.target.value)} placeholder="30 days" /></div>
                <div><Label className="text-xs">Instructions</Label><Input value={medInstructions} onChange={(e) => setMedInstructions(e.target.value)} placeholder="After meals" /></div>
              </div>
              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={addMedication}>+ Add Medication</Button>
            </div>
            <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={2} /></div>
            <Button className="w-full" size="lg" onClick={submitPrescription}>Issue Prescription</Button>
          </div>
        </DialogContent>
      </Dialog>

      <PrescriptionView prescription={viewPrescription} open={viewPrescriptionOpen} onOpenChange={setViewPrescriptionOpen} />
    </div>
  );
};

export default DoctorDashboard;
