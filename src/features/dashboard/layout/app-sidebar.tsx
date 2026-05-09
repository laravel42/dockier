import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderGit2,
  Rocket,
  ShieldCheck,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Item = { title: string; url: string; icon: typeof LayoutDashboard; exact?: boolean };

const main: Item[] = [
  { title: "Overview", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "Projects", url: "/app/projects", icon: FolderGit2 },
  { title: "Deployments", url: "/app/deploy", icon: Rocket },
  { title: "Security", url: "/app/security", icon: ShieldCheck },
  { title: "Notifications", url: "/app/notifications", icon: Bell },
];

const secondary: Item[] = [{ title: "Settings", url: "/app/settings", icon: Settings }];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const navigate = useNavigate();

  const isActive = (item: Item) =>
    item.exact
      ? pathname === item.url
      : pathname === item.url || pathname.startsWith(item.url + "/");

  const initial = (user?.email ?? "U")[0]?.toUpperCase() ?? "U";

  const onSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/40">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Logo />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondary.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40">
        <div className="flex items-center gap-2 px-1.5 py-1.5">
          <Avatar className="h-8 w-8 border border-border/60">
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-medium">{user?.email ?? "Signed in"}</p>
            <p className="truncate text-[10px] text-muted-foreground">Workspace owner</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 group-data-[collapsible=icon]:hidden"
            onClick={onSignOut}
            aria-label="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
