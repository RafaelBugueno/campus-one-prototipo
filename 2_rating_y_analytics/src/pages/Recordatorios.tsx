import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, BookOpen, AlertCircle } from "lucide-react";

const items = [
  { icon: AlertCircle, title: "Evaluación parcial — Cálculo II", desc: "Edificio Ingeniería · Sala 305", date: "29 Abr · 09:00", tone: "destructive" as const, tag: "Urgente" },
  { icon: BookOpen, title: "Entrega informe Lab. Física", desc: "Plataforma Moodle", date: "2 May · 23:59", tone: "warning" as const, tag: "Esta semana" },
  { icon: Calendar, title: "Reunión grupal — Proyecto Software", desc: "Biblioteca Central, sala 4", date: "5 May · 16:00", tone: "primary" as const, tag: "Próximo" },
  { icon: Bell, title: "Inscripción de asignaturas", desc: "Portal académico", date: "12 May", tone: "primary" as const, tag: "Próximo" },
];

const tones = {
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  primary: "bg-primary-soft text-primary",
};

export default function Recordatorios() {
  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Recordatorios</h1>
          <p className="text-sm text-muted-foreground mt-1">Tu agenda académica y notificaciones</p>
        </div>
        <Button>+ Nuevo</Button>
      </div>

      <Card className="shadow-card border-border/60">
        <CardHeader className="pb-2"><CardTitle className="text-base font-display">Próximos</CardTitle></CardHeader>
        <CardContent className="divide-y -mt-2">
          {items.map((it, i) => (
            <div key={i} className="flex items-start gap-4 py-4 hover:bg-muted/30 -mx-6 px-6 transition-smooth cursor-pointer">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${tones[it.tone]}`}>
                <it.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{it.title}</span>
                  <Badge variant="outline" className="text-[10px] font-normal">{it.tag}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{it.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{it.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
