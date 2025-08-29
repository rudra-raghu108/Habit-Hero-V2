import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  BarChart3, 
  Award, 
  Heart,
  Settings,
  Menu,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Award, label: "Achievements", href: "/achievements" },
  { icon: Heart, label: "Motivation", href: "/motivation" },
  { icon: Settings, label: "Settings", href: "/settings" }
];

export function Navigation({ className }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn("hidden md:flex flex-col bg-card border-r border-border w-64 p-6", className)}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Habit Hero
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Level up your life</p>
        </div>
        
        <div className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-left",
                    isActive && "gradient-primary border-0 text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-auto pt-6 border-t border-border">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="gradient-xp border-0 text-white">
              🏆 Level 5 Hero
            </Badge>
            <p className="text-xs text-muted-foreground">
              Keep building those habits!
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-4 bg-card border-b border-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Habit Hero
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-card border-r border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Habit Hero
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-2 mb-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 text-left",
                          isActive && "gradient-primary border-0 text-white"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
              
              <div className="mt-auto">
                <Badge variant="outline" className="gradient-xp border-0 text-white">
                  🏆 Level 5 Hero
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2">
          <div className="flex justify-around">
            {navItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href} className="flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full flex-col gap-1 h-auto py-2",
                      isActive && "text-primary"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
