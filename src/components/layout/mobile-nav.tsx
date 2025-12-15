"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Menu,
  Moon,
  Sun,
  Monitor,
  BookOpen,
  HelpCircle,
  Info,
  LayoutDashboard,
  Settings,
  ChevronRight,
  LogIn,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const navItems = [
  { href: "/flashcards", label: "Flashcards", icon: BookOpen },
  { href: "/quizzes", label: "Quizzes", icon: HelpCircle },
  { href: "/info", label: "Info", icon: Info },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "Auto" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-white hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[85vw] max-w-[320px] flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="text-left font-serif text-xl text-kkpsi-navy dark:text-kkpsi-gold">
            ΚΚΨ Learning
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3.5 text-base font-medium text-foreground transition-colors active:bg-muted hover:bg-muted"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </Link>
            ))}

            {session && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3.5 text-base font-medium text-foreground transition-colors active:bg-muted hover:bg-muted"
                >
                  <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1">Dashboard</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3.5 text-base font-medium text-foreground transition-colors active:bg-muted hover:bg-muted"
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1">Settings</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </Link>
              </>
            )}
          </div>

          {/* Theme Selection */}
          <div className="mt-6 px-3">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Theme
            </p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border py-3 text-sm transition-all active:scale-95",
                    mounted && theme === option.value
                      ? "border-kkpsi-navy bg-kkpsi-navy/5 text-kkpsi-navy dark:border-kkpsi-gold dark:bg-kkpsi-gold/10 dark:text-kkpsi-gold"
                      : "border-border text-muted-foreground hover:border-border hover:bg-muted"
                  )}
                >
                  <option.icon className="h-5 w-5" />
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer - Sign In Button */}
        {!session && (
          <div className="border-t border-border p-4">
            <Button
              asChild
              className="h-12 w-full gap-2 bg-kkpsi-navy text-base font-semibold hover:bg-kkpsi-navy-light"
            >
              <Link href="/auth/signin">
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
