"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { ThemeToggleCompact } from "~/components/ui/theme-toggle";
import { GlobalSearch } from "~/components/search/global-search";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed navbar */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 border-b border-white/10 transition-colors duration-200 ${
          scrolled
            ? "bg-kkpsi-navy/80 dark:bg-kkpsi-navy-dark/80 backdrop-blur-md"
            : "bg-kkpsi-navy dark:bg-kkpsi-navy-dark"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-white transition-all group-hover:text-kkpsi-gold">
              ΚΚΨ
            </span>
            <div className="hidden h-4 w-px bg-white/30 sm:block"></div>
            <span className="hidden text-sm font-medium text-white/80 transition-colors group-hover:text-white sm:block">
              Learning App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            <Link
              href="/flashcards"
              className="link-underline rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
            >
              Flashcards
            </Link>
            <Link
              href="/quizzes"
              className="link-underline rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
            >
              Quizzes
            </Link>
            <Link
              href="/info"
              className="link-underline rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
            >
              Info
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="link-underline rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-2">
            {/* Global Search */}
            <GlobalSearch />

            {/* Theme Toggle */}
            <ThemeToggleCompact
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            />

            {session ? (
              <UserMenu />
            ) : (
              <Button
                asChild
                variant="outline"
                className="border-white/50 bg-white/5 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white hover:bg-white hover:text-kkpsi-navy"
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
