"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl text-kkpsi-navy">
            ΚΚΨ Learning
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col space-y-4">
          <Link
            href="/flashcards"
            onClick={() => setOpen(false)}
            className="text-lg font-medium transition-colors hover:text-kkpsi-navy"
          >
            Flashcards
          </Link>
          <Link
            href="/quizzes"
            onClick={() => setOpen(false)}
            className="text-lg font-medium transition-colors hover:text-kkpsi-navy"
          >
            Quizzes
          </Link>
          <Link
            href="/info"
            onClick={() => setOpen(false)}
            className="text-lg font-medium transition-colors hover:text-kkpsi-navy"
          >
            Info
          </Link>
          {session && (
            <>
              <Separator />
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-lg font-medium transition-colors hover:text-kkpsi-navy"
              >
                Dashboard
              </Link>
            </>
          )}

          <Separator />

          {/* Theme Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Theme</p>
            <div className="flex gap-2">
              <Button
                variant={mounted && theme === "light" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                variant={mounted && theme === "dark" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={mounted && theme === "system" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setTheme("system")}
              >
                <Monitor className="mr-2 h-4 w-4" />
                Auto
              </Button>
            </div>
          </div>

          <Separator />

          {!session && (
            <Button asChild className="w-full bg-kkpsi-navy hover:bg-kkpsi-navy-light">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
