import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/imports/rating_components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/imports/rating_components/ui/tabs";
import { Input } from "@/imports/rating_components/ui/input";
import { Badge } from "@/imports/rating_components/ui/badge";
import { StarRating } from "@/imports/rating_components/rating/StarRating";
import { Search, TrendingUp, TrendingDown, Minus, Inbox } from "lucide-react";

interface Item { name: string; cat: string; score: number; evals: number; trend: number; }

const ALL: Item[] = [
  { name: "Biblioteca Central", cat: "Servicios", score: 4.9, evals: 312, trend: 0.4 },
  { name: "Lab. Computación A", cat: "Espacios", score: 4.7, evals: 198, trend: 0.3 },
  { name: "Plataforma Moodle", cat: "Recursos", score: 4.5, evals: 521, trend: 0.1 },
  { name: "Casino Central", cat: "Servicios", score: 4.4, evals: 445, trend: -0.2 },
  { name: "Auditorio Central", cat: "Espacios", score: 4.2, evals: 76, trend: 0 },
  { name: "Gimnasio Campus", cat: "Espacios", score: 4.1, evals: 87, trend: 0.2 },
  { name: "Bienestar Estudiantil", cat: "Servicios", score: 3.9, evals: 156, trend: -0.1 },
  { name: "Mesa de Ayuda TI", cat: "Atención", score: 3.7, evals: 92, trend: 0.3 },
  { name: "Sala 201 Ing.", cat: "Espacios", score: 3.4, evals: 41, trend: -0.5 },
  { name: "Pagaduría", cat: "Servicios", score: 3.2, evals: 67, trend: -0.3 },
];

export default function Rankings() {
  const [tab, setTab] = useState("Todos");
  const [q, setQ] = useState("");
  const tabs = ["Todos", "Servicios", "Espacios", "Recursos", "Atención"];

  const filtered = ALL
    .filter((i) => (tab === "Todos" || i.cat === tab) && i.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Rankings</h1>
        <p className="text-sm text-muted-foreground mt-1">Servicios, espacios y recursos mejor evaluados</p>
      </div>

      <Card className="shadow-card border-border/60">
        <CardHeader className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>{tabs.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="pl-9 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Inbox className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">Sin evaluaciones para esta búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b">
                    <th className="text-left font-medium py-2.5 px-6 w-12">#</th>
                    <th className="text-left font-medium py-2.5 px-2">Ítem</th>
                    <th className="text-left font-medium py-2.5 px-2 hidden md:table-cell">Categoría</th>
                    <th className="text-left font-medium py-2.5 px-2">Calificación</th>
                    <th className="text-right font-medium py-2.5 px-2 hidden sm:table-cell">Evals</th>
                    <th className="text-right font-medium py-2.5 px-6">Tendencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((it, i) => (
                    <tr key={it.name} className="hover:bg-muted/40 transition-smooth cursor-pointer">
                      <td className="py-3 px-6 font-display font-bold text-muted-foreground">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                      </td>
                      <td className="py-3 px-2 font-medium">{it.name}</td>
                      <td className="py-3 px-2 hidden md:table-cell">
                        <Badge variant="outline" className="font-normal">{it.cat}</Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <StarRating value={Math.round(it.score)} readOnly size={14} />
                          <span className="font-display font-bold">{it.score}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right text-muted-foreground hidden sm:table-cell">{it.evals}</td>
                      <td className="py-3 px-6 text-right">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${it.trend > 0 ? "text-success" : it.trend < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                          {it.trend > 0 ? <TrendingUp className="h-3 w-3" /> : it.trend < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                          {it.trend !== 0 && (it.trend > 0 ? "+" : "")}{it.trend !== 0 ? it.trend : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
