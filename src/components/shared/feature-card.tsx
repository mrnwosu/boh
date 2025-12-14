import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface FeatureCardProps {
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Icon component */
  icon: LucideIcon;
  /** Optional link to navigate to */
  href?: string;
  /** Icon background color variant */
  iconColor?: "navy" | "gold" | "gradient-navy" | "gradient-gold";
  /** List of feature bullet points */
  features?: string[];
  /** Bullet point color */
  bulletColor?: "navy" | "gold";
  /** Additional class names */
  className?: string;
}

const iconColorClasses = {
  navy: "bg-kkpsi-navy/10",
  gold: "bg-kkpsi-gold/20",
  "gradient-navy": "bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light shadow-lg shadow-kkpsi-navy/20",
  "gradient-gold": "bg-gradient-to-br from-kkpsi-gold to-kkpsi-gold-dark shadow-lg shadow-kkpsi-gold/20",
};

const iconTextClasses = {
  navy: "text-kkpsi-navy",
  gold: "text-kkpsi-navy",
  "gradient-navy": "text-white",
  "gradient-gold": "text-kkpsi-navy",
};

const bulletColorClasses = {
  navy: "bg-kkpsi-navy",
  gold: "bg-kkpsi-gold",
};

/**
 * Reusable feature card component
 * Used in feature grids on landing page, info page, etc.
 */
export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  iconColor = "navy",
  features,
  bulletColor = "gold",
  className = "",
}: FeatureCardProps) {
  const cardContent = (
    <Card
      className={`card-hover group h-full border-0 bg-white shadow-lg shadow-gray-200/50 ${
        href ? "cursor-pointer" : ""
      } ${className}`}
    >
      <CardHeader>
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${iconColorClasses[iconColor]}`}
        >
          <Icon className={`h-7 w-7 ${iconTextClasses[iconColor]}`} />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>

      {features && features.length > 0 && (
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${bulletColorClasses[bulletColor]}`}
                />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}

/**
 * Simple info card variant (no features list)
 * Sleek styling with accent bars, shadows, and hover effects
 */
export interface InfoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  /** Gradient accent color classes (e.g., "from-blue-500 to-blue-600") */
  accentGradient?: string;
  className?: string;
}

export function InfoCard({
  title,
  description,
  icon: Icon,
  href,
  accentGradient = "from-kkpsi-navy to-kkpsi-navy-light",
  className = "",
}: InfoCardProps) {
  return (
    <Link href={href} className={`group block ${className}`}>
      <div className="relative flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50 transition-all hover:-translate-y-1 hover:shadow-md hover:ring-gray-300">
        {/* Gradient accent bar */}
        <div className={`absolute left-0 top-6 h-10 w-1 rounded-r-full bg-gradient-to-b ${accentGradient}`} />

        {/* Icon */}
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-gray-100">
          <Icon className="h-5 w-5 text-kkpsi-navy" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500">{description}</p>

        {/* Arrow indicator */}
        <div className="flex items-center text-xs font-medium text-gray-400 transition-colors group-hover:text-kkpsi-navy">
          <span>Learn more</span>
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
