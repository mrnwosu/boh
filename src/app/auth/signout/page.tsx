import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Music } from "lucide-react";
import { auth, signOut } from "~/server/auth";
import { Button } from "~/components/ui/button";

export default async function SignOutPage() {
  const session = await auth();

  // If not signed in, redirect to home
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/50">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="group flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-kkpsi-navy dark:text-kkpsi-navy-light transition-all group-hover:text-kkpsi-gold">
              KKΨ
            </span>
            <div className="hidden h-4 w-px bg-border sm:block"></div>
            <span className="hidden text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground sm:block">
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
          <div className="relative rounded-2xl bg-card p-8 shadow-xl ring-1 ring-border">
            {/* Decorative music notes */}
            <div className="absolute -right-3 -top-3 opacity-20">
              <Music className="h-8 w-8 text-kkpsi-gold" />
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <LogOut className="h-7 w-7 text-muted-foreground" />
              </div>
              <h1 className="mb-2 font-serif text-2xl font-bold text-card-foreground">
                Sign Out
              </h1>
              <p className="text-muted-foreground">
                Are you sure you want to sign out?
              </p>
            </div>

            {/* User info */}
            <div className="mb-6 flex items-center justify-center gap-3 rounded-lg bg-muted p-4">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-10 w-10 rounded-full ring-2 ring-background"
                />
              )}
              <div className="text-left">
                <p className="font-medium text-card-foreground">
                  {session.user.displayName ?? session.user.name}
                </p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
            </div>

            {/* Sign out form */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button
                type="submit"
                variant="destructive"
                className="w-full py-6 transition-all hover:scale-[1.02]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>

            {/* Cancel link */}
            <div className="mt-4 text-center">
              <Button
                asChild
                variant="ghost"
              >
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Your progress is saved and will be here when you return
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Kappa Kappa Psi Learning App
          </p>
        </div>
      </footer>
    </div>
  );
}
