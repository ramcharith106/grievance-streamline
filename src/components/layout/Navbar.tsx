import { Button } from "@/components/ui/button";
import { GraduationCap, User, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-primary to-primary-light p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">College Portal</h1>
              <p className="text-xs text-muted-foreground">Digital Complaint Management</p>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <Button
              variant={location.pathname === "/submit" ? "default" : "ghost"}
              asChild
            >
              <Link to="/submit">Submit Complaint</Link>
            </Button>
            
            <Button
              variant={location.pathname === "/track" ? "default" : "ghost"}
              asChild
            >
              <Link to="/track">Track Status</Link>
            </Button>

            <Button
              variant={location.pathname === "/admin" ? "secondary" : "outline"}
              size="sm"
              asChild
            >
              <Link to="/admin" className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;