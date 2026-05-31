import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/imports/rating_components/ui/card";
import { Badge } from "@/imports/rating_components/ui/badge";
import { Progress } from "@/imports/rating_components/ui/progress";
import { Button } from "@/imports/rating_components/ui/button";
import { GraduationCap, CheckCircle2, Circle, PlayCircle, RotateCcw } from "lucide-react";
import { cn } from "@/imports/rating_lib/utils";

type Status = "aprobado" | "cursando" | "pendiente";

const nextStatus: Record<Status, Status> = {
  pendiente: "cursando",
  cursando: "aprobado",
  aprobado: "pendiente",
};

const STORAGE_KEY = "malla-status-v1";

interface Ramo {
  nombre: string;
  hhc?: string; // horas (cátedra-ayudantía-laboratorio)
  status: Status;
  area: "especialidad" | "basicas" | "practica";
  nota?: string;
}

// Malla Ingeniería en Computación - ULS
// Organizada por nivel (I-X). Estado mockeado: estudiante en V nivel.
const malla: Ramo[][] = [
  // I
  [
    { nombre: "Introducción a la Informática y Computación", hhc: "4-0-2", status: "aprobado", area: "especialidad" },
    { nombre: "Matemáticas I", hhc: "8-2-2", status: "aprobado", area: "basicas" },
    { nombre: "Inglés", hhc: "4-0-0", status: "aprobado", area: "basicas" },
  ],
  // II
  [
    { nombre: "Programación Estructurada", hhc: "4-0-2", status: "aprobado", area: "especialidad" },
    { nombre: "Matemáticas II", hhc: "8-2-0", status: "aprobado", area: "basicas" },
    { nombre: "Física I", hhc: "6-2-2", status: "aprobado", area: "basicas" },
  ],
  // III
  [
    { nombre: "Estructuras de Datos", hhc: "4-0-2", status: "aprobado", area: "especialidad" },
    { nombre: "Fundamentos Informática Teórica", hhc: "4-2-0", status: "aprobado", area: "especialidad" },
    { nombre: "Matemáticas III", hhc: "6-2-0", status: "aprobado", area: "basicas" },
    { nombre: "Física II", hhc: "4-2-2", status: "aprobado", area: "basicas" },
  ],
  // IV
  [
    { nombre: "Programación", hhc: "4-0-2", status: "aprobado", area: "especialidad" },
    { nombre: "Arquitectura de Computadores", hhc: "4-0-2", status: "aprobado", area: "especialidad" },
    { nombre: "Matemáticas IV", hhc: "4-2-0", status: "aprobado", area: "basicas" },
    { nombre: "Probabilidades y Estadística", hhc: "6-2-0", status: "aprobado", area: "basicas" },
  ],
  // V (cursando)
  [
    { nombre: "Diseño y Análisis de Algoritmos", hhc: "4-0-2", status: "cursando", area: "especialidad" },
    { nombre: "Sistemas Operativos", hhc: "4-0-2", status: "cursando", area: "especialidad" },
    { nombre: "Análisis Numérico", hhc: "4-2-0", status: "cursando", area: "basicas" },
    { nombre: "Economía Nacional", hhc: "2-0-0", status: "cursando", area: "basicas" },
    { nombre: "Investigación de Operaciones I", hhc: "4-0-0", status: "cursando", area: "basicas" },
    { nombre: "Inglés II", hhc: "4-0-0", status: "cursando", area: "basicas" },
    { nombre: "Práctica I", status: "pendiente", area: "practica" },
  ],
  // VI
  [
    { nombre: "Programación Avanzada", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Sistemas de Información", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Base de Datos I", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Economía de Empresas", hhc: "4-0-0", status: "pendiente", area: "basicas" },
    { nombre: "Sociología Industrial y del Trabajo", hhc: "4-0-0", status: "pendiente", area: "basicas", nota: "4º Nivel Aprobado" },
    { nombre: "PET", status: "pendiente", area: "basicas" },
  ],
  // VII
  [
    { nombre: "Teoría de Autómatas y Lenguajes Formales", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Ingeniería de Software I", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Base de Datos II", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Comunicación de Datos y Redes I", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Evaluación de Proyectos", hhc: "4-0-0", status: "pendiente", area: "basicas" },
    { nombre: "Investigación de Operaciones II", hhc: "4-0-0", status: "pendiente", area: "basicas" },
    { nombre: "Práctica II", status: "pendiente", area: "practica" },
  ],
  // VIII
  [
    { nombre: "Ingeniería de Software II", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Aplicaciones Internet", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Comunicación de Datos y Redes II", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Contabilidad General y de Costos", hhc: "4-0-0", status: "pendiente", area: "basicas", nota: "6º Nivel Aprobado" },
  ],
  // IX
  [
    { nombre: "Inteligencia Artificial", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
    { nombre: "Electivo I", hhc: "4-0-0", status: "pendiente", area: "especialidad" },
    { nombre: "Electivo II", hhc: "4-0-0", status: "pendiente", area: "especialidad" },
    { nombre: "Sistemas Distribuidos", hhc: "4-0-2", status: "pendiente", area: "especialidad" },
  ],
  // X
  [
    { nombre: "Informática y Sociedad", hhc: "4-0-0", status: "pendiente", area: "especialidad", nota: "7º Nivel Aprobado" },
    { nombre: "Electivo III", hhc: "4-0-0", status: "pendiente", area: "especialidad" },
    { nombre: "Electivo IV", hhc: "4-0-0", status: "pendiente", area: "especialidad" },
  ],
];

const niveles = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const statusStyles: Record<Status, string> = {
  aprobado: "bg-success/10 border-success/40 text-success-foreground",
  cursando: "bg-primary/10 border-primary/50 ring-1 ring-primary/30",
  pendiente: "bg-muted/40 border-border text-muted-foreground",
};

const areaDot: Record<Ramo["area"], string> = {
  especialidad: "bg-primary",
  basicas: "bg-warning",
  practica: "bg-success",
};

const StatusIcon = ({ s }: { s: Status }) => {
  if (s === "aprobado") return <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />;
  if (s === "cursando") return <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0" />;
  return <Circle className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />;
};

export default function MallaCurricular() {
  const [overrides, setOverrides] = useState<Record<string, Status>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOverrides(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {}
  }, [overrides]);

  const getStatus = (key: string, base: Status): Status => overrides[key] ?? base;

  const cycle = (key: string, current: Status) => {
    setOverrides((prev) => ({ ...prev, [key]: nextStatus[current] }));
  };

  const reset = () => setOverrides({});

  const all = malla.flatMap((ramos, i) =>
    ramos.map((r, j) => ({ ...r, status: getStatus(`${i}-${j}`, r.status) }))
  );
  const total = all.length;
  const aprobados = all.filter((r) => r.status === "aprobado").length;
  const cursando = all.filter((r) => r.status === "cursando").length;
  const pct = Math.round((aprobados / total) * 100);

  return (
    <Card className="shadow-card border-border/60">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-display flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" /> Malla Curricular
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Ingeniería en Computación · Universidad de La Serena
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <Badge className="bg-success/15 text-success border-0">{aprobados} aprobados</Badge>
            <Badge className="bg-primary/15 text-primary border-0">{cursando} cursando</Badge>
            <Badge variant="outline">{total - aprobados - cursando} pendientes</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={reset}
              disabled={Object.keys(overrides).length === 0}
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Reiniciar
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Avance de carrera</span>
            <span className="font-medium tabular-nums">{pct}%</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Haz clic en un ramo para cambiar su estado: Pendiente → Cursando → Aprobado.
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-3 flex-wrap">
          <span className="flex items-center gap-1.5"><span className={cn("h-2 w-2 rounded-full", areaDot.especialidad)} /> Especialidad</span>
          <span className="flex items-center gap-1.5"><span className={cn("h-2 w-2 rounded-full", areaDot.basicas)} /> Cs. Básicas / Adm.</span>
          <span className="flex items-center gap-1.5"><span className={cn("h-2 w-2 rounded-full", areaDot.practica)} /> Práctica</span>
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <div className="grid grid-flow-col auto-cols-[minmax(180px,1fr)] gap-3 min-w-full">
            {malla.map((ramos, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-center">
                  <div className="text-[10px] tracking-widest text-muted-foreground font-semibold">NIVEL</div>
                  <div className="font-display font-bold text-sm text-primary">{niveles[idx]}</div>
                </div>
                <div className="space-y-1.5">
                  {ramos.map((r, j) => {
                    const key = `${idx}-${j}`;
                    const status = getStatus(key, r.status);
                    return (
                      <button
                        key={j}
                        type="button"
                        onClick={() => cycle(key, status)}
                        className={cn(
                          "w-full text-left rounded-md border p-2 transition-smooth hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          statusStyles[status]
                        )}
                        title={r.nota ? `${r.nota} · Click para cambiar estado` : "Click para cambiar estado"}
                      >
                        <div className="flex items-start gap-1.5">
                          <span className={cn("h-2 w-2 rounded-full mt-1 shrink-0", areaDot[r.area])} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-medium leading-tight text-foreground">
                              {r.nombre}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <StatusIcon s={status} />
                              {r.hhc && (
                                <span className="text-[10px] text-muted-foreground tabular-nums">{r.hhc}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
