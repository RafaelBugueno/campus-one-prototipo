import { Card, CardContent, CardHeader, CardTitle } from "@/imports/rating_components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/imports/rating_components/ui/select";
import { Button } from "@/imports/rating_components/ui/button";
import { Badge } from "@/imports/rating_components/ui/badge";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell,
} from "recharts";

const trend = [
  { mes: "Mar", servicios: 3.6, espacios: 3.4, recursos: 4.0 },
  { mes: "Abr", servicios: 3.8, espacios: 3.6, recursos: 4.2 },
  { mes: "May", servicios: 3.9, espacios: 3.7, recursos: 4.3 },
  { mes: "Jun", servicios: 4.0, espacios: 3.8, recursos: 4.4 },
  { mes: "Jul", servicios: 4.1, espacios: 3.7, recursos: 4.5 },
  { mes: "Ago", servicios: 4.0, espacios: 3.9, recursos: 4.5 },
  { mes: "Sep", servicios: 4.2, espacios: 3.8, recursos: 4.5 },
];

const byCat = [
  { name: "Servicios", val: 4.2 },
  { name: "Espacios", val: 3.8 },
  { name: "Recursos", val: 4.5 },
  { name: "Atención", val: 3.5 },
];

const movers = [
  { name: "Biblioteca Central", delta: 0.4, up: true },
  { name: "Lab. Computación A", delta: 0.3, up: true },
  { name: "Casino Central", delta: 0.2, up: false },
  { name: "Sala 201", delta: 0.5, up: false },
];

const heat = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 12 }, (_, h) => Math.round(Math.random() * 10))
);
const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function Analytics() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Métricas agregadas y tendencias del módulo Rating</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card border-border/60">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <Select defaultValue="sem"><SelectTrigger className="w-40"><SelectValue placeholder="Periodo" /></SelectTrigger>
            <SelectContent><SelectItem value="sem">Semestre actual</SelectItem><SelectItem value="ano">Último año</SelectItem><SelectItem value="todo">Histórico</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="todas"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="todas">Todas las categorías</SelectItem><SelectItem value="serv">Servicios</SelectItem><SelectItem value="esp">Espacios</SelectItem><SelectItem value="rec">Recursos</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="todas"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="todas">Todas las carreras</SelectItem><SelectItem value="ing">Ingeniería</SelectItem><SelectItem value="hum">Humanidades</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="todos"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="todos">Todos los campus</SelectItem><SelectItem value="ig">Ignacio Domeyko</SelectItem><SelectItem value="ay">Andrés Bello</SelectItem></SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Tendencia por categoría</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 10, left: -20 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[3, 5]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }} />
                  <Line type="monotone" dataKey="servicios" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="espacios" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="recursos" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-xs mt-2 justify-center">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Servicios</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> Espacios</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Recursos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Promedio por categoría</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCat} layout="vertical" margin={{ top: 10, right: 20, left: 10 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }} />
                  <Bar dataKey="val" radius={[0, 6, 6, 0]}>
                    {byCat.map((_, i) => <Cell key={i} fill={["hsl(var(--primary))", "hsl(var(--destructive))", "hsl(var(--success))", "hsl(var(--warning))"][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Actividad por día y hora</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid gap-1" style={{ gridTemplateColumns: "auto repeat(12, 1fr)" }}>
                <div />
                {Array.from({ length: 12 }, (_, h) => (
                  <div key={h} className="text-[10px] text-muted-foreground text-center">{8 + h}h</div>
                ))}
                {heat.map((row, d) => (
                  <>
                    <div key={`d${d}`} className="text-[10px] text-muted-foreground pr-1 self-center">{days[d]}</div>
                    {row.map((v, h) => (
                      <div
                        key={`${d}-${h}`}
                        className="aspect-square rounded transition-smooth hover:scale-110 cursor-pointer"
                        style={{ background: `hsl(218 100% 26% / ${0.08 + (v / 10) * 0.65})` }}
                        title={`${days[d]} ${8 + h}h — ${v} eval.`}
                      />
                    ))}
                  </>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Mayores cambios</CardTitle></CardHeader>
          <CardContent className="divide-y">
            {movers.map((m) => (
              <div key={m.name} className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-6 px-6 transition-smooth cursor-pointer">
                <div className="text-sm font-medium">{m.name}</div>
                <Badge variant="secondary" className={m.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                  {m.up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {m.up ? "+" : "−"}{m.delta}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
