import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { LucideIcon } from "lucide-react";

export interface PageHeroProps {
  /** Main title */
  title: string;
  /** Description text below title */
  description?: string;
  /** Optional icon displayed above title */
  icon?: LucideIcon;
  /** Back navigation link */
  backLink?: {
    href: string;
    label: string;
  };
  /** Vertical padding variant */
  size?: "sm" | "md" | "lg";
  /** Center content (default) or left-align */
  align?: "center" | "left";
  /** Maximum content width */
  maxWidth?: "2xl" | "3xl" | "4xl" | "6xl";
  /** Additional content below description */
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
};

const maxWidthClasses = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
};

/**
 * Reusable page hero section with KKPsi navy gradient background
 * Used across all major pages for consistent header styling
 */
export function PageHero({
  title,
  description,
  icon: Icon,
  backLink,
  size = "lg",
  align = "center",
  maxWidth = "3xl",
  children,
}: PageHeroProps) {
  return (
    <section
      className={`bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy ${sizeClasses[size]}`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`mx-auto ${maxWidthClasses[maxWidth]} ${
            align === "center" ? "text-center" : ""
          }`}
        >
          {backLink && (
            <Button
              asChild
              variant="ghost"
              className="mb-4 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={backLink.href}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                {backLink.label}
              </Link>
            </Button>
          )}

          {Icon && (
            <Icon
              className={`mb-4 h-16 w-16 text-kkpsi-gold ${
                align === "center" ? "mx-auto" : ""
              }`}
            />
          )}

          <h1 className="mb-4 font-serif text-5xl font-bold text-white">
            {title}
          </h1>

          {description && (
            <p className="text-xl text-gray-200">{description}</p>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
