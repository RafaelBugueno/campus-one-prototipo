import { Card, CardContent } from "@/imports/rating_components/ui/card";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { cn } from "@/imports/rating_lib/utils";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: { value: string; up?: boolean };
  tone?: "primary" | "success" | "warning" | "destructive";
}

const tones = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
} as const;

export function KpiCard({ icon: Icon, label, value, delta, tone = "primary" }: KpiCardProps) {
  return (
    <Card className="shadow-card border-border/60 hover:shadow-elev transition-smooth">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                delta.up ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
              )}
            >
              {delta.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {delta.value}
            </span>
          )}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-display font-bold tracking-tight">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
