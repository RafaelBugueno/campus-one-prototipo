import { Search, Bell, LogIn } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar() {
  return (
    /*
     * z-[2100]: mayor que z-[2000] de CustomSidebar (módulo 1) y
     * z-[1500] de CustomNavbar, pero menor que z-[2500] del Sheet
     * de la sidebar mobile. Así el botón hamburguesa siempre es clickeable.
     */
    <header className="h-14 flex items-center gap-3 px-4 border-b bg-card sticky top-0 z-[2100]">
      <SidebarTrigger className="shrink-0" />

      {/* Búsqueda solo en desktop */}
      <div className="hidden md:flex items-center relative w-full max-w-md">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar ítem, asignatura, servicio..."
          className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:bg-card"
        />
      </div>

      <div className="flex-1" />

      <Button variant="ghost" size="icon" className="relative shrink-0">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
      </Button>

      <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-2 shrink-0">
        <LogIn className="h-4 w-4" />
        Iniciar sesión
      </Button>

      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
          H
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
