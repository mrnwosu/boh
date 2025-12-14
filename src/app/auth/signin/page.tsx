import { redirect } from "next/navigation";
import Link from "next/link";
import { Music, Sparkles } from "lucide-react";
import { auth, signIn } from "~/server/auth";
import { Button } from "~/components/ui/button";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  // If already signed in, redirect to callback or dashboard
  if (session) {
    redirect(callbackUrl ?? "/dashboard");
  }

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
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-kkpsi-gold/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-kkpsi-navy/10 blur-3xl"></div>

          {/* Card */}
          <div className="relative rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200/50">
            {/* Decorative music notes */}
            <div className="absolute -right-3 -top-3 opacity-20">
              <Music className="h-8 w-8 text-kkpsi-gold" />
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light">
                <span className="font-serif text-2xl font-bold text-white">ΚΚΨ</span>
              </div>
              <h1 className="mb-2 font-serif text-2xl font-bold text-gray-900">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to track your learning progress
              </p>
            </div>

            {/* Sign in form */}
            <form
              action={async () => {
                "use server";
                await signIn("discord", { redirectTo: callbackUrl ?? "/dashboard" });
              }}
            >
              <Button
                type="submit"
                className="w-full bg-[#5865F2] py-6 text-white transition-all hover:scale-[1.02] hover:bg-[#4752C4]"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Continue with Discord
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-sm text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* Guest access */}
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">
                Continue without signing in
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-gray-200 py-6 text-gray-700 transition-all hover:bg-gray-50"
              >
                <Link href="/flashcards">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Browse as Guest
                </Link>
              </Button>
            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-gray-500">
              Sign in to save your progress, track streaks, and compete on leaderboards
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Kappa Kappa Psi Learning App
          </p>
        </div>
      </footer>
    </div>
  );
}
