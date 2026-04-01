import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useState } from "react";

import { Button } from "./ui/button";
import {
  LogOutIcon,
  LayoutDashboard,
  Users,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => signOut(auth).then(() => navigate("/login"));

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/home", icon: LayoutDashboard },
    { label: "Patients", path: "/patients", icon: Users },
    { label: "Appointments", path: "/appointment", icon: CalendarDays },
  ];

  return (
    <header
      className="relative mb-4 sm:mb-6 flex items-center justify-between shrink-0 border-b pb-4"
      role="banner"
    >
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>

        {/* Logo Section */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/home")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/home")}
          aria-label="SHIELD Home"
        >
          <img
            src="/images/Logo.svg"
            alt="SHIELD Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-1 sm:gap-2"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="link"
              size="sm"
              onClick={() => navigate(item.path)}
              aria-current={isActive(item.path) ? "page" : undefined}
              className={cn(
                "gap-2 px-3 sm:px-4 transition-all",
                isActive(item.path)
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">{item.label}</span>
              <span className="xl:hidden">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      {/* Profile / Logout Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div
          className="hidden sm:flex flex-col items-end mr-2"
          aria-label="User session info"
        >
          <span className="text-xs sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Logged in
          </span>
          <span className="text-xs font-bold truncate max-w-30 lg:max-w-none">
            {auth.currentUser?.email}
          </span>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9"
          aria-label="Logout"
        >
          <LogOutIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute top-full left-0 right-0 z-50 mt-2 bg-white/95 backdrop-blur-sm border rounded-lg shadow-lg p-2 lg:hidden"
          role="menu"
          aria-label="Mobile navigation"
        >
          <nav>
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                role="menuitem"
                aria-current={isActive(item.path) ? "page" : undefined}
                className={cn(
                  "w-full justify-start gap-4 mb-1",
                  isActive(item.path) ? "bg-slate-100 font-bold" : "",
                )}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Button>
            ))}
          </nav>
          {/* Mobile-only Email Display */}
          <div
            className="sm:hidden border-t mt-2 pt-2 px-4 pb-2"
            aria-label="User session info"
          >
            <p className="text-xs text-muted-foreground">Signed in as:</p>
            <p className="text-xs font-bold truncate">
              {auth.currentUser?.email}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
