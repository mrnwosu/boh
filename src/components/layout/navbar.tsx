"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-border bg-kkpsi-navy">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold text-white">
            ΚΚΨ
          </span>
          <span className="hidden text-sm font-semibold text-white sm:block">
            Learning App
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link
            href="/flashcards"
            className="text-sm font-medium text-white transition-colors hover:text-kkpsi-gold"
          >
            Flashcards
          </Link>
          <Link
            href="/quizzes"
            className="text-sm font-medium text-white transition-colors hover:text-kkpsi-gold"
          >
            Quizzes
          </Link>
          <Link
            href="/info"
            className="text-sm font-medium text-white transition-colors hover:text-kkpsi-gold"
          >
            Info
          </Link>
          {session && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white transition-colors hover:text-kkpsi-gold"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {session ? (
            <UserMenu />
          ) : (
            <Button
              asChild
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white hover:text-kkpsi-navy"
            >
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
}
