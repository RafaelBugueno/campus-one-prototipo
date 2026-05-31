import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/imports/rating_components/ui/sidebar";
import { Input } from "@/imports/rating_components/ui/input";
import { Button } from "@/imports/rating_components/ui/button";
import { Avatar, AvatarFallback } from "@/imports/rating_components/ui/avatar";

export function Topbar() {
  return (
    /* h-14 border-b border-slate-200 bg-white shadow-sm — matches CustomNavbar reference */
    <header className="h-14 flex items-center gap-3 px-4 border-b border-slate-200 bg-white shadow-sm sticky top-0 z-30">
      <SidebarTrigger className="text-slate-600 hover:bg-slate-100 rounded-lg" />
      <div className="hidden md:flex items-center relative w-full max-w-md">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar ítem, asignatura, servicio..."
          className="pl-9 h-9 bg-slate-50 border border-slate-100 rounded-xl focus-visible:bg-white text-sm text-slate-700 placeholder:text-slate-400"
        />
      </div>
      <div className="flex-1" />
      <Button variant="ghost" size="icon" className="relative text-slate-600 hover:bg-slate-100 rounded-full">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
      </Button>
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-[rgb(0,50,130)] text-white text-xs font-bold">H</AvatarFallback>
      </Avatar>
    </header>
  );
}
