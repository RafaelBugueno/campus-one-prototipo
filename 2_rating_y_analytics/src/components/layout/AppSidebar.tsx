import { NavLink, useLocation } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import campusOneLogo from "@/assets/campusone.png";

const ratingItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Evaluar", url: "/evaluar", icon: Star },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Rankings", url: "/rankings", icon: Trophy },
  { title: "Mi Progreso", url: "/progreso", icon: GraduationCap },
  { title: "Recordatorios", url: "/recordatorios", icon: Bell },
];

const hubItems = [
  { title: "Mapa Campus", url: "#", icon: MapPin },
  { title: "Empleabilidad", url: "#", icon: Briefcase },
  { title: "Networking", url: "#", icon: Users },
  { title: "Ayuda", url: "#", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border/40 py-4">
        <div className="flex items-center gap-2 px-2">
          <div className="h-9 w-9 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden">
            <img src={campusOneLogo} alt="CampusOne" className="h-8 w-8 object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-sm text-sidebar-foreground">CampusOne</span>
              <span className="text-[10px] text-sidebar-foreground/70">Universidad de La Serena</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-[10px] tracking-widest">
            Rating & Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ratingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-white data-[active=true]:text-primary text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-smooth"
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-[10px] tracking-widest">
            CampusOne
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hubItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-smooth"
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
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
