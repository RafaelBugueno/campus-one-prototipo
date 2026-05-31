import { Search, Bell, LogIn } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar() {
  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b bg-card sticky top-0 z-30">
      <SidebarTrigger />
      <div className="hidden md:flex items-center relative w-full max-w-md">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ítem, asignatura, servicio..."
          className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:bg-card"
        />
      </div>
      <div className="flex-1" />
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
      </Button>
      <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-2">
        <LogIn className="h-4 w-4" />
        Iniciar sesión
      </Button>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">H</AvatarFallback>
      </Avatar>
    </header>
  );
}
