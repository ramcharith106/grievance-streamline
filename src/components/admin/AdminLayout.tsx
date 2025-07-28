import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Global Header */}
        <header className="fixed top-0 left-0 right-0 h-12 bg-background border-b border-border flex items-center justify-between px-4 z-50">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold">College Complaint Management</h1>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-1" />
              Public Site
            </Link>
          </Button>
        </header>

        <div className="flex w-full pt-12">
          <AdminSidebar />
          <main className="flex-1 p-6 bg-accent/20">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}