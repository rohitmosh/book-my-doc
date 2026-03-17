import { useState, useEffect } from "react";
import { Calendar, FileText, Clock, Activity, User, Settings, LogOut, Eye, LayoutDashboard, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppointmentTimeline from "@/components/AppointmentTimeline";
import PrescriptionView from "@/components/PrescriptionView";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
interface Prescription {
  _id: string; id?: string;
  appointmentId: string;
  doctorName: string; patientName: string; date: string;
  diagnosis: string; symptoms: string[];
  medications: { name: string; dosage: string; duration: string; instructions: string }[];
  notes: string;
}

const statusBadge = (status: string) => {
  switch (status) {
    case "completed": return <Badge variant="default">Completed</Badge>;
    case "scheduled": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Scheduled</Badge>;
    case "in-progress": return <Badge className="bg-amber-100 text-amber-700 border-amber-200">In Progress</Badge>;
    default: return <Badge variant="outline" className="border-orange-300 text-orange-600">Pending</Badge>;
  }
};

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: Calendar, label: "Appointments", key: "appointments" },
  { icon: FileText, label: "Prescriptions", key: "prescriptions" },
  { icon: DollarSign, label: "Billing", key: "billing" },
  { icon: Settings, label: "Profile Settings", key: "settings", link: "/patient/profile-settings" },
  { icon: LogOut, label: "Logout", key: "logout", link: "/login" },
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    api.getAppointments().then((data) => setPatientAppointments(data as any[])).catch(() => {});
    api.getPrescriptions().then((data) => setPrescriptions(data as any[])).catch(() => {});
  }, []);

  const openPrescription = async (prescriptionId: string) => {
    try {
      const p = await api.getPrescription(prescriptionId);
      setSelectedPrescription(p as Prescription);
      setPrescriptionOpen(true);
    } catch {}
  };

  const selectedAppointment = selectedAppointmentId
    ? patientAppointments.find((a) => (a._id || a.id) === selectedAppointmentId)
    : null;

  const stats = [
    { icon: Calendar, label: "Total Appointments", value: patientAppointments.length },
    { icon: Clock, label: "Upcoming", value: patientAppointments.filter((a) => a.status === "scheduled" || a.status === "pending").length },
    { icon: Activity, label: "Completed", value: patientAppointments.filter((a) => a.status === "completed").length },
    { icon: DollarSign, label: "Total Spent", value: `$${patientAppointments.length * 150}` },
  ];

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="rounded-lg border bg-card p-5 text-center mb-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-2xl mb-3">
              <User className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-foreground">{user?.name || "Patient"}</h3>
            <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
          </div>

          <nav className="rounded-lg border bg-card overflow-hidden">
            {sidebarLinks.map((link) => (
              link.link ? (
                <Link
                  key={link.key}
                  to={link.link}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-accent transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.key}
                  onClick={() => { setActiveSection(link.key); setSelectedAppointmentId(null); }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent ${
                    activeSection === link.key ? "bg-accent text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </button>
              )
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Viewing a specific appointment detail */}
          {selectedAppointment ? (
            <div className="space-y-6">
              <Button variant="outline" size="sm" onClick={() => setSelectedAppointmentId(null)}>
                ← Back to list
              </Button>

              <div className="rounded-lg border bg-card p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Creation Date: {selectedAppointment.date}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium">Tracking:</span>
                      {statusBadge(selectedAppointment.status)}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p><span className="text-muted-foreground">Current Status:</span> {statusBadge(selectedAppointment.status)}</p>
                    <p className="mt-1"><span className="text-muted-foreground">Payment:</span> <Badge variant="outline">Paid</Badge></p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-foreground mb-4 text-center">APPOINTMENT INFORMATION</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Place of Meeting:</span><Badge variant="secondary">Online</Badge></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Meeting Date:</span><span>{selectedAppointment.date}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Meeting Time:</span><span>{selectedAppointment.time}</span></div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-foreground mb-3 text-center">DOCTOR INFORMATION</h4>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                      {selectedAppointment.doctorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{selectedAppointment.doctorName}</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.specialty}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-foreground mb-3 text-center">PATIENT INFORMATION</h4>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{selectedAppointment.patientName}</p>
                      {selectedAppointment.symptoms && (
                        <p className="text-sm text-muted-foreground">Reason for visit: {selectedAppointment.symptoms}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-foreground mb-4 text-center">APPOINTMENT TIMELINE</h4>
                  <AppointmentTimeline status={selectedAppointment.status} />
                </div>

                {selectedAppointment.prescriptionId && (
                  <div className="border-t pt-4">
                    <Button onClick={() => openPrescription(selectedAppointment.prescriptionId!)} className="gap-2">
                      <FileText className="h-4 w-4" /> View Prescription
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard overview */}
              {activeSection === "dashboard" && (
                <>
                  <h1 className="text-2xl font-bold text-foreground mb-6">Patient Dashboard</h1>
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

                  {/* Recent appointments table */}
                  <div className="rounded-lg border bg-card overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Doctor</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientAppointments.map((apt, idx) => (
                          <tr key={apt._id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-3 text-muted-foreground">{idx + 1}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-medium">
                                  {apt.doctorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{apt.doctorName}</p>
                                  <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-foreground">{apt.date} <span className="text-xs text-primary">{apt.time}</span></td>
                            <td className="p-3">{statusBadge(apt.status)}</td>
                            <td className="p-3">
                              <Button variant="outline" size="sm" onClick={() => setSelectedAppointmentId(apt._id)} className="gap-1 h-7 text-xs">
                                <Eye className="h-3 w-3" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Appointments section */}
              {activeSection === "appointments" && (
                <>
                  <h1 className="text-2xl font-bold text-foreground mb-6">My Appointments</h1>
                  <div className="space-y-4">
                    {patientAppointments.map((apt) => (
                      <div key={apt._id} className="rounded-lg border bg-card p-5 flex gap-4 items-start">
                        <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg shrink-0">
                          {apt.doctorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{apt.doctorName}</h3>
                              <p className="text-sm text-muted-foreground">{apt.specialty} · {apt.date} at {apt.time}</p>
                            </div>
                            {statusBadge(apt.status)}
                          </div>
                          {apt.symptoms && <p className="text-sm text-muted-foreground mt-1">Reason: {apt.symptoms}</p>}
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" onClick={() => setSelectedAppointmentId(apt._id)} className="gap-1">
                              <Eye className="h-3.5 w-3.5" /> View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Prescriptions section */}
              {activeSection === "prescriptions" && (
                <>
                  <h1 className="text-2xl font-bold text-foreground mb-6">My Prescriptions</h1>
                  <div className="space-y-4">
                    {prescriptions.map((p) => (
                        <div key={p._id} className="rounded-lg border bg-card p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{p.doctorName}</h3>
                            <p className="text-sm text-muted-foreground">{p.diagnosis}</p>
                            <p className="text-xs text-muted-foreground mt-1">{p.date}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => { setSelectedPrescription(p); setPrescriptionOpen(true); }}>
                            View
                          </Button>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {/* Billing section */}
              {activeSection === "billing" && (
                <>
                  <h1 className="text-2xl font-bold text-foreground mb-6">Billing History</h1>
                  <div className="rounded-lg border bg-card overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium text-muted-foreground">Doctor</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientAppointments.map((apt) => (
                          <tr key={apt._id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-3 font-medium text-foreground">{apt.doctorName}</td>
                            <td className="p-3 text-foreground">{apt.date}</td>
                            <td className="p-3 text-foreground font-semibold">$150</td>
                            <td className="p-3"><Badge variant="default">Paid</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* No settings placeholder needed - links to profile settings page */}
            </>
          )}
        </div>
      </div>

      <PrescriptionView
        prescription={selectedPrescription}
        open={prescriptionOpen}
        onOpenChange={setPrescriptionOpen}
      />
    </div>
  );
};

export default PatientDashboard;
