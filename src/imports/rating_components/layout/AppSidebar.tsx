import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Star,
  BarChart3,
  Trophy,
  GraduationCap,
  Bell,
  HelpCircle,
  MapPin,
  Briefcase,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/imports/rating_components/ui/sidebar";
import campusOneLogo from "@/imports/rating_assets/campusone.png";

const BASE_PATH = "/rating-y-analytics";

const ratingItems = [
  { title: "Dashboard", url: `${BASE_PATH}`, icon: LayoutDashboard },
  { title: "Evaluar", url: `${BASE_PATH}/evaluar`, icon: Star },
  { title: "Analytics", url: `${BASE_PATH}/analytics`, icon: BarChart3 },
  { title: "Rankings", url: `${BASE_PATH}/rankings`, icon: Trophy },
  { title: "Mi Progreso", url: `${BASE_PATH}/progreso`, icon: GraduationCap },
  { title: "Recordatorios", url: `${BASE_PATH}/recordatorios`, icon: Bell },
];

const hubItems = [
  { title: "Mapa Campus", url: "/mapa_visitante", icon: MapPin },
  { title: "Empleabilidad", url: "/empleabilidad-y-colaboracion", icon: Briefcase },
  { title: "Networking", url: "/networking-y-match-academico", icon: Users },
  { title: "Ayuda", url: "#", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === BASE_PATH) return pathname === BASE_PATH || pathname === `${BASE_PATH}/`;
    return pathname === path;
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border/40 py-4">
        <div
          className="flex items-center gap-2 px-2 cursor-pointer hover:bg-sidebar-accent/50 rounded-md transition-colors"
          onClick={() => navigate('/')}
        >
          {/* Logo - same size as reference: h-10 w-10 */}
          <div className="h-10 w-10 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden p-1.5">
            <img src={campusOneLogo} alt="CampusOne" className="h-full w-full object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              {/* text-sm font-bold — matches reference exactly */}
              <span className="font-bold text-sm text-sidebar-foreground">CampusOne</span>
              {/* text-[11px] — matches reference exactly */}
              <span className="text-[11px] text-sidebar-foreground/70">Universidad de La Serena</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {/* Section label: text-[10px] uppercase tracking-widest — matches reference */}
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-[10px] uppercase tracking-widest">
            Rating & Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ratingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-white data-[active=true]:text-[rgb(0,50,130)] text-sidebar-foreground/85 hover:bg-white/10 hover:text-sidebar-foreground transition-colors text-sm"
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {/* Section label: text-[10px] uppercase tracking-widest — matches reference */}
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-[10px] uppercase tracking-widest">
            CampusOne
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hubItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-sidebar-foreground/75 hover:bg-white/10 hover:text-sidebar-foreground transition-colors text-sm"
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
