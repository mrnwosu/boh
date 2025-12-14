"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
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
  const { data: session } = useSession();

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
