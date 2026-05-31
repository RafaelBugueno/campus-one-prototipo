import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider } from "@/imports/rating_components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { ChevronRight, Home } from "lucide-react";

const BASE_PATH = "/rating-y-analytics";

const labels: Record<string, string> = {
  [`${BASE_PATH}`]: "Dashboard",
  [`${BASE_PATH}/evaluar`]: "Registrar Evaluación",
  [`${BASE_PATH}/analytics`]: "Analytics",
  [`${BASE_PATH}/rankings`]: "Rankings",
  [`${BASE_PATH}/progreso`]: "Mi Progreso",
  [`${BASE_PATH}/recordatorios`]: "Recordatorios",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const label = labels[pathname] ?? "";
  const isDashboard = pathname === BASE_PATH || pathname === `${BASE_PATH}/`;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <div className="px-4 md:px-8 pt-4 pb-2">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Home className="h-3 w-3" /> CampusOne
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link to={BASE_PATH} className="hover:text-foreground transition-colors">
                Rating & Analytics
              </Link>
              {!isDashboard && label && (
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
