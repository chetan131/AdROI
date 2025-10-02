import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart3, Rocket, FileText } from "lucide-react";

export default function MainLayout() {
  const { pathname } = useLocation();
  const nav = [
    { to: "/", label: "Dashboard", icon: LineChart },
    { to: "/insights", label: "Insights", icon: BarChart3 },
    { to: "/actions", label: "Actions", icon: Rocket },
    { to: "/reports", label: "Reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/40 text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/90 shadow-sm" />
            <span className="text-xl font-semibold tracking-tight">AdROI</span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.to
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/80 hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="#" aria-disabled>
                Help
              </a>
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
      <footer className="mt-12 border-t py-6 text-center text-sm text-muted-foreground">
        �� {new Date().getFullYear()} AdROI • Marketing Performance Automation
      </footer>
    </div>
  );
}
