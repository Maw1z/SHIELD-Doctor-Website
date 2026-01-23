import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

import { Button } from "./ui/button";
import { LogOutIcon, LayoutDashboard, Users, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => signOut(auth).then(() => navigate("/login"));

  // Helper to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/home", icon: LayoutDashboard },
    { label: "Patients", path: "/patients", icon: Users },
    { label: "Appointments", path: "/appointment", icon: CalendarDays },
  ];

  return (
    <header className="mb-6 flex items-center justify-between shrink-0 border-b pb-4">
      <div className="flex items-center gap-8">
        {/* Logo Section */}
        <h1
          className="text-3xl font-black tracking-tighter cursor-pointer text-primary"
          onClick={() => navigate("/home")}
        >
          SHIELD
        </h1>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="link"
              size="sm"
              onClick={() => navigate(item.path)}
              className={cn(
                "gap-2 px-4 transition-all",
                isActive(item.path)
                  ? "bg-white text-black font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Profile / Logout Section */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-xs font-medium text-muted-foreground">
            Logged in as
          </span>
          <span className="text-xs font-bold">{auth.currentUser?.email}</span>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOutIcon className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
}
