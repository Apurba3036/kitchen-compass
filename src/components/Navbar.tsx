import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChefHat, LogOut, User, LayoutDashboard, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">Kitchen Coach</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Courses
          </Link>
          {user && (
            <Link to="/my-bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-1 h-4 w-4" /> Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
              <Button size="sm" onClick={() => navigate("/register")}>Sign Up</Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/courses" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Courses</Link>
            {user && <Link to="/my-bookings" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
            {isAdmin && <Link to="/admin" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Admin</Link>}
            {user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut}>Sign Out</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { navigate("/login"); setMenuOpen(false); }}>Sign In</Button>
                <Button size="sm" onClick={() => { navigate("/register"); setMenuOpen(false); }}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
