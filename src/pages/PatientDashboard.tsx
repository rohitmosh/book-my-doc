import { useState } from "react";
import { Calendar, FileText, Clock, Activity } from "lucide-react";
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
    case "scheduled": return <Badge variant="secondary" className="border-info text-info">Scheduled</Badge>;
    case "in-progress": return <Badge variant="secondary" className="border-warning text-warning">In Progress</Badge>;
    default: return <Badge variant="outline">Pending</Badge>;
  }
};

const PatientDashboard = () => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);

  const openPrescription = (prescriptionId: string) => {
    const p = prescriptions.find((pr) => pr.id === prescriptionId);
    if (p) {
      setSelectedPrescription(p);
      setPrescriptionOpen(true);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
        {[
          { icon: Calendar, label: "Total Appointments", value: patientAppointments.length },
          { icon: Clock, label: "Upcoming", value: patientAppointments.filter((a) => a.status === "scheduled").length },
          { icon: Activity, label: "Pending", value: patientAppointments.filter((a) => a.status === "pending").length },
          { icon: FileText, label: "Prescriptions", value: prescriptions.filter((p) => patientAppointments.some((a) => a.prescriptionId === p.id)).length },
        ].map((stat) => (
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
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4 mt-4">
          {patientAppointments.map((apt) => (
            <div key={apt.id} className="rounded-lg border bg-card p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{apt.doctorName}</h3>
                  <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                </div>
                {statusBadge(apt.status)}
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {apt.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {apt.time}</span>
              </div>
              {apt.symptoms && <p className="text-sm font-body text-muted-foreground">Symptoms: {apt.symptoms}</p>}

              <AppointmentTimeline status={apt.status} />

              {apt.prescriptionId && (
                <Button variant="outline" size="sm" onClick={() => openPrescription(apt.prescriptionId!)}>
                  <FileText className="h-4 w-4 mr-1" /> View Prescription
                </Button>
              )}
            </div>
          ))}
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
      </Tabs>

      <PrescriptionView
        prescription={selectedPrescription}
        open={prescriptionOpen}
        onOpenChange={setPrescriptionOpen}
      />
    </div>
  );
};

export default PatientDashboard;
