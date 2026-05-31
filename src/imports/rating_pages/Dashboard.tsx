import { Card, CardContent, CardHeader, CardTitle } from "@/imports/rating_components/ui/card";
import { Button } from "@/imports/rating_components/ui/button";
import { KpiCard } from "@/imports/rating_components/rating/KpiCard";
import { StarRating } from "@/imports/rating_components/rating/StarRating";
import { Badge } from "@/imports/rating_components/ui/badge";
import { Progress } from "@/imports/rating_components/ui/progress";
import { Star, ClipboardList, Trophy, GraduationCap, ArrowRight, Bell, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const trend = [
  { mes: "Mar", valor: 3.6 },
  { mes: "Abr", valor: 3.8 },
  { mes: "May", valor: 3.9 },
  { mes: "Jun", valor: 4.0 },
  { mes: "Jul", valor: 4.1 },
  { mes: "Ago", valor: 4.0 },
  { mes: "Sep", valor: 4.2 },
];

const topItems = [
  { name: "Biblioteca Central", cat: "Servicio", score: 4.9, evals: 312 },
  { name: "Lab. Computación A", cat: "Espacio", score: 4.7, evals: 198 },
  { name: "Casino Central", cat: "Servicio", score: 4.4, evals: 445 },
  { name: "Gimnasio Campus", cat: "Espacio", score: 4.1, evals: 87 },
  { name: "Bienestar Estudiantil", cat: "Servicio", score: 3.9, evals: 156 },
];

const reminders = [
  { title: "Evaluación parcial — Cálculo II", time: "En 3 días", tone: "destructive" as const },
  { title: "Nueva métrica en Biblioteca Central", time: "Hace 2 horas", tone: "primary" as const },
  { title: "Subiste al Nivel 5 de gamificación", time: "Ayer", tone: "success" as const },
];

const toneDot: Record<string, string> = {
  destructive: "bg-destructive",
  primary: "bg-primary",
  success: "bg-success",
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Hola, Héctor</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lunes 26 de Abril, 2026 · Universidad de La Serena
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/rating-y-analytics/evaluar">
            <Plus className="h-4 w-4" /> Registrar evaluación
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Star} label="Satisfacción global" value="4.2" delta={{ value: "0.3", up: true }} tone="primary" />
        <KpiCard icon={ClipboardList} label="Evaluaciones registradas" value="1,847" delta={{ value: "124", up: true }} tone="success" />
        <KpiCard icon={Trophy} label="Ítems en ranking activo" value="34" delta={{ value: "2", up: true }} tone="warning" />
        <KpiCard icon={GraduationCap} label="Tu nivel" value="Nv. 5" delta={{ value: "1", up: true }} tone="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-card border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-display">Tendencia semestral de satisfacción</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link to="/rating-y-analytics/analytics">Ver analytics <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(210 90% 50%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[3, 5]} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="valor" stroke="url(#dashboardLineGradient)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Recordatorios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.map((r, i) => (
              <div key={i} className="flex items-start gap-3 group cursor-pointer hover:bg-muted/40 -mx-2 px-2 py-1.5 rounded transition-smooth">
                <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${toneDot[r.tone]}`} />
                <div className="min-w-0">
                  <p className="text-sm leading-snug">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full text-xs">Ver todos</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-card border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-display">Top servicios mejor evaluados</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link to="/rating-y-analytics/rankings">Ver rankings <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {topItems.map((item, i) => (
                <div key={item.name} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/40 transition-smooth cursor-pointer">
                  <span className="w-6 text-sm font-display font-bold text-muted-foreground">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.cat} · {item.evals} eval.</div>
                  </div>
                  <StarRating value={Math.round(item.score)} readOnly size={14} />
                  <span className="text-sm font-display font-bold w-8 text-right">{item.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60 overflow-hidden">
          <div className="bg-gradient-primary p-5 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-xl">
                🎓
              </div>
              <div>
                <div className="font-display font-bold">Héctor</div>
                <div className="text-xs opacity-90">Nivel 5 · Analista Avanzado</div>
              </div>
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">XP 1,240 / 1,500</span>
                <span className="font-medium text-primary">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="bg-gold/15 text-gold-foreground border-0">🏅 Evaluador</Badge>
              <Badge variant="secondary" className="bg-success/10 text-success border-0">📊 Analista</Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">🎯 Top 10</Badge>
            </div>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/rating-y-analytics/progreso">Ver mi progreso</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
