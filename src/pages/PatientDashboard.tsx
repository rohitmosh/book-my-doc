import { useState } from "react";
import { Calendar, FileText, Clock, Activity, User, Heart, Settings, LogOut, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentTimeline from "@/components/AppointmentTimeline";
import PrescriptionView from "@/components/PrescriptionView";
import { patientAppointments, prescriptions } from "@/data/mockData";
import type { Prescription } from "@/data/mockData";

const statusBadge = (status: string) => {
  switch (status) {
    case "completed": return <Badge variant="default">Completed</Badge>;
    case "scheduled": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Scheduled</Badge>;
    case "in-progress": return <Badge className="bg-amber-100 text-amber-700 border-amber-200">In Progress</Badge>;
    default: return <Badge variant="outline" className="border-orange-300 text-orange-600">Pending</Badge>;
  }
};

const sidebarLinks = [
  { icon: Activity, label: "Dashboard", active: true },
  { icon: Heart, label: "Favourites" },
  { icon: Calendar, label: "Appointments" },
  { icon: FileText, label: "Prescription" },
  { icon: Settings, label: "Profile Settings" },
  { icon: LogOut, label: "Logout" },
];

const PatientDashboard = () => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const openPrescription = (prescriptionId: string) => {
    const p = prescriptions.find((pr) => pr.id === prescriptionId);
    if (p) {
      setSelectedPrescription(p);
      setPrescriptionOpen(true);
    }
  };

  const selectedAppointment = selectedAppointmentId
    ? patientAppointments.find((a) => a.id === selectedAppointmentId)
    : null;

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="rounded-lg border bg-card p-5 text-center mb-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-2xl mb-3">
              <User className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-foreground">John Doe</h3>
            <p className="text-xs text-muted-foreground mt-1">24 Jul 1993, 30 Years</p>
            <p className="text-xs text-muted-foreground">New York, USA</p>
            <p className="text-xs text-muted-foreground">john.doe@email.com</p>
          </div>

          <nav className="rounded-lg border bg-card overflow-hidden">
            {sidebarLinks.map((link) => (
              <button
                key={link.label}
                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent ${
                  link.active ? "bg-accent text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground mb-6">MY APPOINTMENTS</h1>

          {/* If viewing appointment detail */}
          {selectedAppointment ? (
            <div className="space-y-6">
              <Button variant="outline" size="sm" onClick={() => setSelectedAppointmentId(null)}>
                ← Back to list
              </Button>

              <div className="rounded-lg border bg-card p-6 space-y-6">
                {/* Header */}
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

                {/* Doctor Info */}
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

                {/* Patient Info */}
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

                {/* Timeline */}
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
            /* Table view */
            <Tabs defaultValue="appointments">
              <TabsList>
                <TabsTrigger value="appointments">Appointment</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescription</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>

              <TabsContent value="appointments" className="mt-4">
                <div className="rounded-lg border bg-card overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium text-muted-foreground">Doctor</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">App Date</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Booking Date</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientAppointments.map((apt) => (
                        <tr key={apt.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-medium">
                                {apt.doctorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{apt.doctorName}</p>
                                <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-foreground">
                            {apt.date}<br />
                            <span className="text-xs text-primary">{apt.time}</span>
                          </td>
                          <td className="p-3 text-foreground">{apt.date}</td>
                          <td className="p-3">{statusBadge(apt.status)}</td>
                          <td className="p-3">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => setSelectedAppointmentId(apt.id)}
                              className="gap-1"
                            >
                              <Eye className="h-3.5 w-3.5" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-4 mt-4">
                {prescriptions
                  .filter((p) => patientAppointments.some((a) => a.prescriptionId === p.id))
                  .map((p) => (
                    <div key={p.id} className="rounded-lg border bg-card p-4 flex items-center justify-between">
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
              </TabsContent>

              <TabsContent value="billing" className="mt-4">
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
                        <tr key={apt.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="p-3 font-medium text-foreground">{apt.doctorName}</td>
                          <td className="p-3 text-foreground">{apt.date}</td>
                          <td className="p-3 text-foreground font-semibold">$150</td>
                          <td className="p-3">
                            <Badge variant="default">Paid</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
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
