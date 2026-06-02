import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { ChevronRight, Home } from "lucide-react";

const labels: Record<string, string> = {
  "/": "Dashboard",
  "/evaluar": "Registrar Evaluación",
  "/analytics": "Analytics",
  "/rankings": "Rankings",
  "/progreso": "Mi Progreso",
  "/recordatorios": "Recordatorios",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const label = labels[pathname] ?? "";

  return (
    /*
     * SidebarProvider ya agrega su propio div con:
     *   "group/sidebar-wrapper flex min-h-svh w-full"
     *
     * NO agregar otro div wrapper encima  eso creaba un doble contenedor
     * de altura fija que bloqueaba el scroll en mobile.
     *
     * SidebarInset es el par oficial de <Sidebar collapsible="icon">.
     * Maneja automáticamente el offset lateral en desktop (16rem / 3rem)
     * y en mobile ocupa el 100% porque la sidebar es un Sheet (overlay).
     */
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar sticky */}
        <Topbar />

        {/* Breadcrumb */}
        <div className="px-4 md:px-8 pt-4 pb-2">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-foreground transition-smooth"
            >
              <Home className="h-3 w-3" /> CampusOne
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground/80">Rating & Analytics</span>
            {pathname !== "/" && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{label}</span>
              </>
            )}
          </nav>
        </div>

        {/* Contenido de la página - flex-1 overflow-y-auto permite scroll correcto */}
        <main className="flex-1 px-4 md:px-8 pb-10 overflow-y-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

