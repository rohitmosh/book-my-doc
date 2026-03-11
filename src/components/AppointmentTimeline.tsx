import { Calendar, Clock, Stethoscope, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = [
  { key: "pending", label: "Pending", icon: Calendar },
  { key: "scheduled", label: "Scheduled", icon: Clock },
  { key: "in-progress", label: "In Progress", icon: Stethoscope },
  { key: "completed", label: "Completed", icon: FileText },
] as const;

type Status = "pending" | "scheduled" | "in-progress" | "completed";

const statusOrder: Record<Status, number> = {
  pending: 0,
  scheduled: 1,
  "in-progress": 2,
  completed: 3,
};

interface Props {
  status: Status;
}

const AppointmentTimeline = ({ status }: Props) => {
  const currentIdx = statusOrder[status];

  return (
    <div className="flex items-center gap-0 w-full">
      {stages.map((stage, idx) => {
        const isPast = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isFuture = idx > currentIdx;
        const Icon = stage.icon;

        return (
          <div key={stage.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2 transition-all",
                  isActive && "h-10 w-10 border-primary bg-primary text-primary-foreground",
                  isPast && "h-8 w-8 border-muted-foreground/40 bg-muted-foreground/20 text-muted-foreground",
                  isFuture && "h-8 w-8 border-border bg-transparent text-muted-foreground/40"
                )}
              >
                <Icon className={cn(isActive ? "h-5 w-5" : "h-4 w-4")} />
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive && "text-primary",
                  isPast && "text-muted-foreground",
                  isFuture && "text-muted-foreground/40"
                )}
              >
                {stage.label}
              </span>
            </div>
            {idx < stages.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 mt-[-1rem]",
                  idx < currentIdx ? "bg-muted-foreground/30" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentTimeline;
