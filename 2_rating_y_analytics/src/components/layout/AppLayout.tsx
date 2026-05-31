import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <div className="px-4 md:px-8 pt-4 pb-2">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-smooth">
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
          <main className="flex-1 px-4 md:px-8 pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
