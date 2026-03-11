import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Prescription } from "@/data/mockData";

interface Props {
  prescription: Prescription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrescriptionView = ({ prescription, open, onOpenChange }: Props) => {
  if (!prescription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Prescription Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Doctor</span>
              <span className="font-medium text-foreground">{prescription.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Patient</span>
              <span>{prescription.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{prescription.date}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Diagnosis</h4>
            <p className="text-sm font-body text-foreground">{prescription.diagnosis}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Symptoms</h4>
            <div className="flex flex-wrap gap-1.5">
              {prescription.symptoms.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Medications</h4>
            <div className="space-y-2">
              {prescription.medications.map((med, idx) => (
                <div key={idx} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{med.name}</span>
                    <Badge variant="outline">{med.dosage}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Duration: {med.duration}</p>
                  <p className="text-xs text-muted-foreground">{med.instructions}</p>
                </div>
              ))}
            </div>
          </div>

          {prescription.notes && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Notes</h4>
              <p className="text-sm font-body text-muted-foreground">{prescription.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionView;
