import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/rating/StarRating";
import { cn } from "@/lib/utils";
import {
  Building2, MapPin, BookOpen, Users, Search, Check, ArrowLeft, ArrowRight, Loader2, CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "servicios", label: "Servicios", desc: "Casino, biblioteca, bienestar...", icon: Building2 },
  { id: "espacios", label: "Espacios físicos", desc: "Salas, laboratorios, gimnasio...", icon: MapPin },
  { id: "recursos", label: "Recursos académicos", desc: "Material, plataformas, libros...", icon: BookOpen },
  { id: "atencion", label: "Atención", desc: "Personal administrativo y docente", icon: Users },
];

const itemsByCat: Record<string, string[]> = {
  servicios: ["Biblioteca Central", "Casino Central", "Bienestar Estudiantil", "Pagaduría", "Registro Curricular"],
  espacios: ["Lab. Computación A", "Sala 201 Edificio Ingeniería", "Gimnasio Campus", "Auditorio Central"],
  recursos: ["Plataforma Moodle", "Repositorio digital", "Catálogo bibliográfico"],
  atencion: ["Secretaría de Carrera", "Mesa de ayuda TI", "Coordinación académica"],
};

const quickTags = ["Rápido", "Limpio", "Atento", "Bien equipado", "Cómodo", "Lento", "Falta mantención"];

export default function Evaluar() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [item, setItem] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [anon, setAnon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const steps = ["Categoría", "Ítem", "Evaluación"];
  const list = (category ? itemsByCat[category] : []).filter((i) => i.toLowerCase().includes(search.toLowerCase()));

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setDone(true);
    toast({ title: "Evaluación enviada", description: `${item} · ${rating} estrellas` });
  };

  const reset = () => {
    setStep(0); setCategory(null); setItem(null); setRating(0); setComment(""); setTags([]); setAnon(false); setDone(false); setSearch("");
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto py-10 text-center animate-in fade-in zoom-in duration-300">
        <div className="h-16 w-16 mx-auto rounded-full bg-success/15 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-display font-bold">¡Evaluación enviada!</h2>
        <p className="text-muted-foreground mt-2">Gracias por tu feedback sobre <strong>{item}</strong>.</p>
        <div className="flex gap-2 justify-center mt-6">
          <Button variant="outline" onClick={reset}>Nueva evaluación</Button>
          <Button asChild><a href="/rankings">Ver ranking</a></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Registrar evaluación</h1>
        <p className="text-sm text-muted-foreground mt-1">Evalúa un servicio, espacio o recurso del campus.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-smooth",
                  i < step && "bg-success text-success-foreground",
                  i === step && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                  i > step && "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-sm font-medium hidden sm:inline", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={cn("h-px flex-1 mx-3", i < step ? "bg-success" : "bg-border")} />}
          </div>
        ))}
      </div>

      <Card className="shadow-card border-border/60">
        <CardContent className="p-6">
          {step === 0 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-display font-semibold">¿Qué quieres evaluar?</h3>
                <p className="text-sm text-muted-foreground">Selecciona una categoría</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      "text-left p-4 rounded-lg border-2 transition-smooth hover:border-primary/40 hover:bg-primary-soft/40",
                      category === c.id ? "border-primary bg-primary-soft" : "border-border"
                    )}
                  >
                    <c.icon className={cn("h-5 w-5 mb-2", category === c.id ? "text-primary" : "text-muted-foreground")} />
                    <div className="font-medium text-sm">{c.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-display font-semibold">Selecciona el ítem</h3>
                <p className="text-sm text-muted-foreground">Busca o elige de la lista</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9" />
              </div>
              <div className="border rounded-lg divide-y max-h-72 overflow-auto">
                {list.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">No se encontraron ítems</div>
                ) : list.map((i) => (
                  <button
                    key={i}
                    onClick={() => setItem(i)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-muted/50 transition-smooth flex items-center justify-between",
                      item === i && "bg-primary-soft"
                    )}
                  >
                    <span className="text-sm font-medium">{i}</span>
                    {item === i && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="font-display font-semibold">Evaluando: <span className="text-primary">{item}</span></h3>
                <p className="text-sm text-muted-foreground">Tu opinión nos ayuda a mejorar</p>
              </div>
              <div>
                <Label className="text-sm">Tu calificación</Label>
                <div className="mt-2"><StarRating value={rating} onChange={setRating} size={32} /></div>
              </div>
              <div>
                <Label className="text-sm">Etiquetas rápidas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickTags.map((t) => {
                    const active = tags.includes(t);
                    return (
                      <Badge
                        key={t}
                        variant={active ? "default" : "outline"}
                        className="cursor-pointer transition-smooth"
                        onClick={() => setTags((p) => active ? p.filter((x) => x !== t) : [...p, t])}
                      >
                        {t}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="c" className="text-sm">Comentario (opcional)</Label>
                <Textarea id="c" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={300} placeholder="Cuéntanos más..." className="mt-1.5" />
                <div className="text-xs text-muted-foreground text-right mt-1">{comment.length}/300</div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="anon" checked={anon} onCheckedChange={(v) => setAnon(!!v)} />
                <Label htmlFor="anon" className="text-sm font-normal cursor-pointer">Enviar de forma anónima</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prev} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Atrás
        </Button>
        {step < 2 ? (
          <Button onClick={next} disabled={(step === 0 && !category) || (step === 1 && !item)}>
            Siguiente <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={!rating || submitting}>
            {submitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Enviando...</> : "Enviar evaluación"}
          </Button>
        )}
      </div>
    </div>
  );
}
