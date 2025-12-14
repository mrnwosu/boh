"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Home, Music, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Server Configuration Error",
    description:
      "There is a problem with the server configuration. Please contact support if this issue persists.",
  },
  AccessDenied: {
    title: "Access Denied",
    description:
      "You do not have permission to sign in. This may be due to account restrictions.",
  },
  Verification: {
    title: "Verification Failed",
    description:
      "The verification link may have expired or already been used. Please try signing in again.",
  },
  OAuthSignin: {
    title: "OAuth Sign-in Error",
    description:
      "There was a problem starting the sign-in process. Please try again.",
  },
  OAuthCallback: {
    title: "OAuth Callback Error",
    description:
      "There was a problem during the authentication callback. Please try again.",
  },
  OAuthCreateAccount: {
    title: "Account Creation Error",
    description:
      "There was a problem creating your account. Please try again or contact support.",
  },
  EmailCreateAccount: {
    title: "Account Creation Error",
    description:
      "There was a problem creating your account with this email. Please try again.",
  },
  Callback: {
    title: "Callback Error",
    description:
      "There was a problem during the authentication process. Please try again.",
  },
  OAuthAccountNotLinked: {
    title: "Account Not Linked",
    description:
      "This email is already associated with another account. Please sign in with the original provider.",
  },
  SessionRequired: {
    title: "Session Required",
    description: "Please sign in to access this page.",
  },
  Default: {
    title: "Authentication Error",
    description:
      "An unexpected error occurred during authentication. Please try again.",
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const errorInfo = errorMessages[error] ?? errorMessages.Default!;

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="mb-2 font-serif text-2xl font-bold text-gray-900">
          {errorInfo.title}
        </h1>
        <p className="text-gray-600">{errorInfo.description}</p>
      </div>

      {/* Error code */}
      <div className="mb-6 rounded-lg bg-gray-50 p-3 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Error Code
        </p>
        <p className="font-mono text-sm text-gray-700">{error}</p>
      </div>
    </>
  );
}

function ErrorContentFallback() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="mb-2 font-serif text-2xl font-bold text-gray-900">
        Authentication Error
      </h1>
      <p className="text-gray-600">Loading error details...</p>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="group flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-kkpsi-navy transition-all group-hover:text-kkpsi-gold">
              KKΨ
            </span>
            <div className="hidden h-4 w-px bg-gray-300 sm:block"></div>
            <span className="hidden text-sm font-medium text-gray-600 transition-colors group-hover:text-kkpsi-navy sm:block">
              Learning App
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="relative w-full max-w-md">
          {/* Background decorations */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-red-100 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-kkpsi-navy/10 blur-3xl"></div>

          {/* Card */}
          <div className="relative rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200/50">
            {/* Decorative music notes */}
            <div className="absolute -right-3 -top-3 opacity-20">
              <Music className="h-8 w-8 text-kkpsi-gold" />
            </div>

            <Suspense fallback={<ErrorContentFallback />}>
              <ErrorContent />
            </Suspense>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-kkpsi-navy py-6 transition-all hover:scale-[1.02] hover:bg-kkpsi-navy-light"
              >
                <Link href="/auth/signin">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-gray-200 py-6 text-gray-700 transition-all hover:bg-gray-50"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-gray-500">
              If this problem persists, please contact support
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">Kappa Kappa Psi Learning App</p>
        </div>
      </footer>
    </div>
  );
}
