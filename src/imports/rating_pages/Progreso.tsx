import { Card, CardContent, CardHeader, CardTitle } from "@/imports/rating_components/ui/card";
import { Progress } from "@/imports/rating_components/ui/progress";
import { Badge } from "@/imports/rating_components/ui/badge";
import { Button } from "@/imports/rating_components/ui/button";
import { Lock, Star, Medal, BarChart3, Target, Flame, Crown, BookCheck } from "lucide-react";
import { cn } from "@/imports/rating_lib/utils";
import MallaCurricular from "@/imports/rating_components/progreso/MallaCurricular";

const badges = [
  { icon: Medal, label: "Evaluador", desc: "10 evaluaciones", unlocked: true },
  { icon: BarChart3, label: "Analista", desc: "Revisa Analytics 5×", unlocked: true },
  { icon: Crown, label: "Top 10", desc: "Top 10 evaluadores", unlocked: true },
  { icon: BookCheck, label: "Crítico", desc: "20 comentarios", unlocked: false },
  { icon: Star, label: "5 estrellas", desc: "Recibe 5★ en aporte", unlocked: false },
  { icon: Flame, label: "Racha 30", desc: "30 días consecutivos", unlocked: false },
];

const missions = [
  { title: "Evalúa 3 espacios físicos esta semana", progress: 1, total: 3 },
  { title: "Comenta en 2 servicios universitarios", progress: 2, total: 2, done: true },
  { title: "Visita el ranking de Recursos académicos", progress: 0, total: 1 },
];

export default function Progreso() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Mi Progreso</h1>
        <p className="text-sm text-muted-foreground mt-1">Tu actividad como evaluador en CampusOne</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-card border-border/60 overflow-hidden">
          <div className="bg-gradient-primary text-primary-foreground p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-2xl">🎓</div>
              <div className="flex-1">
                <div className="text-xs opacity-80">Nivel actual</div>
                <div className="font-display font-bold text-2xl">Nivel 5 — Analista Avanzado</div>
                <div className="text-xs opacity-80 mt-1">Faltan 260 XP para Nivel 6</div>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5"><span>1,240 XP</span><span>1,500 XP</span></div>
              <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: "82%" }} />
              </div>
            </div>
          </div>
          <CardContent className="p-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-display font-bold">47</div>
              <div className="text-xs text-muted-foreground mt-1">Evaluaciones</div>
            </div>
            <div className="text-center border-x">
              <div className="text-2xl font-display font-bold flex items-center justify-center gap-1">
                12 <Flame className="h-5 w-5 text-warning" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">Días de racha</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold">3/9</div>
              <div className="text-xs text-muted-foreground mt-1">Logros</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Misiones</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {missions.map((m, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("text-sm leading-snug", m.done && "line-through text-muted-foreground")}>{m.title}</span>
                  {m.done && <Badge className="bg-success/15 text-success border-0">Listo</Badge>}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Progress value={(m.progress / m.total) * 100} className="h-1.5" />
                  <span className="text-xs text-muted-foreground tabular-nums">{m.progress}/{m.total}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <MallaCurricular />

      <Card className="shadow-card border-border/60">
        <CardHeader className="pb-2"><CardTitle className="text-base font-display">Logros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {badges.map((b) => (
              <div
                key={b.label}
                className={cn(
                  "rounded-lg border p-4 text-center transition-smooth hover:-translate-y-0.5",
                  b.unlocked ? "bg-card hover:shadow-card" : "bg-muted/30 opacity-60"
                )}
                title={b.desc}
              >
                <div className={cn(
                  "h-12 w-12 rounded-full mx-auto flex items-center justify-center mb-2",
                  b.unlocked ? "bg-gradient-gold text-white" : "bg-muted text-muted-foreground"
                )}>
                  {b.unlocked ? <b.icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                </div>
                <div className="text-sm font-medium">{b.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{b.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm">Ver todos los logros</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
