"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Target,
  Trash2,
  Check,
  Loader2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Slider } from "~/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { toast } from "sonner";

// Avatar options
const AVATAR_OPTIONS = [
  { id: "default", label: "Default", emoji: null },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "trumpet", label: "Trumpet", emoji: "🎺" },
  { id: "drum", label: "Drum", emoji: "🥁" },
  { id: "guitar", label: "Guitar", emoji: "🎸" },
  { id: "microphone", label: "Microphone", emoji: "🎤" },
  { id: "piano", label: "Piano", emoji: "🎹" },
  { id: "star", label: "Star", emoji: "⭐" },
  { id: "fire", label: "Fire", emoji: "🔥" },
  { id: "lightning", label: "Lightning", emoji: "⚡" },
  { id: "rocket", label: "Rocket", emoji: "🚀" },
  { id: "crown", label: "Crown", emoji: "👑" },
  { id: "diamond", label: "Diamond", emoji: "💎" },
  { id: "heart", label: "Heart", emoji: "💜" },
  { id: "book", label: "Book", emoji: "📚" },
  { id: "graduation", label: "Graduation", emoji: "🎓" },
] as const;

function AvatarDisplay({
  avatar,
  image,
  name,
  size = "md",
}: {
  avatar: string | null | undefined;
  image: string | null | undefined;
  name: string | null | undefined;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-lg",
    md: "h-12 w-12 text-2xl",
    lg: "h-20 w-20 text-4xl",
  };

  const avatarOption = AVATAR_OPTIONS.find((a) => a.id === avatar);

  if (avatarOption?.emoji) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light ${sizeClasses[size]}`}
      >
        <span>{avatarOption.emoji}</span>
      </div>
    );
  }

  if (image) {
    return (
      <img
        src={image}
        alt={name ?? "User"}
        className={`rounded-full object-cover ${sizeClasses[size]}`}
      />
    );
  }

  // Default initials
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-kkpsi-navy to-kkpsi-navy-light font-semibold text-white ${sizeClasses[size]}`}
    >
      {initials}
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/settings");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-kkpsi-navy" />
      </div>
    );
  }

  return <SettingsContent />;
}

function SettingsContent() {
  const utils = api.useUtils();

  // Fetch settings
  const { data: settings, isLoading } = api.settings.getSettings.useQuery();
  const { data: stats } = api.settings.getStatsSummary.useQuery();

  // State for form fields
  const [displayName, setDisplayName] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [dailyCardGoal, setDailyCardGoal] = useState(10);
  const [dailyQuizGoal, setDailyQuizGoal] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);

  // Initialize form when settings load
  useState(() => {
    if (settings) {
      setDisplayName(settings.displayName ?? "");
      setSelectedAvatar(settings.customAvatar);
      setShowOnLeaderboard(settings.showOnLeaderboard);
      setDailyCardGoal(settings.dailyCardGoal);
      setDailyQuizGoal(settings.dailyQuizGoal);
    }
  });

  // Mutations
  const updateDisplayName = api.settings.updateDisplayName.useMutation({
    onSuccess: () => {
      toast.success("Display name updated");
      void utils.settings.getSettings.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update display name");
    },
  });

  const updateAvatar = api.settings.updateAvatar.useMutation({
    onSuccess: () => {
      toast.success("Avatar updated");
      void utils.settings.getSettings.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update avatar");
    },
  });

  const updateLeaderboard = api.settings.updateLeaderboardVisibility.useMutation({
    onSuccess: () => {
      toast.success("Leaderboard visibility updated");
      void utils.settings.getSettings.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update settings");
    },
  });

  const updateGoals = api.settings.updateDailyGoals.useMutation({
    onSuccess: () => {
      toast.success("Daily goals updated");
      void utils.settings.getSettings.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update goals");
    },
  });

  const resetProgress = api.settings.resetProgress.useMutation({
    onSuccess: () => {
      toast.success("Progress has been reset");
      setIsDeleteDialogOpen(false);
      void utils.settings.getStatsSummary.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reset progress");
    },
  });

  const deleteAccount = api.settings.deleteAccount.useMutation({
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      // Sign out and redirect to home page
      await signOut({ callbackUrl: "/" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-kkpsi-navy" />
        </div>
      </div>
    );
  }

  const currentAvatar = selectedAvatar ?? settings.customAvatar;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Settings</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your profile and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Customize how you appear to others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Selection */}
              <div className="space-y-3">
                <Label>Avatar</Label>
                <div className="flex items-center gap-4">
                  <AvatarDisplay
                    avatar={currentAvatar}
                    image={settings.image}
                    name={settings.displayName ?? settings.name}
                    size="lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Choose a custom avatar or use your account picture
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {AVATAR_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedAvatar(option.id === "default" ? null : option.id);
                        updateAvatar.mutate({
                          customAvatar: option.id === "default" ? null : option.id,
                        });
                      }}
                      className={`relative flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xl transition-all hover:scale-105 ${
                        (option.id === "default" && !currentAvatar) ||
                        currentAvatar === option.id
                          ? "border-kkpsi-navy bg-kkpsi-navy/10 dark:border-kkpsi-navy-light"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      title={option.label}
                    >
                      {option.emoji ? (
                        option.emoji
                      ) : settings.image ? (
                        <img
                          src={settings.image}
                          alt="Default"
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                      {((option.id === "default" && !currentAvatar) ||
                        currentAvatar === option.id) && (
                        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-kkpsi-navy text-white dark:bg-kkpsi-navy-light">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <p className="text-sm text-muted-foreground">
                  This is how your name appears on leaderboards and in the app
                </p>
                <div className="flex gap-2">
                  <Input
                    id="displayName"
                    placeholder={settings.name ?? "Enter display name"}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="max-w-xs"
                    maxLength={30}
                  />
                  <Button
                    onClick={() =>
                      updateDisplayName.mutate({
                        displayName: displayName.trim() || null,
                      })
                    }
                    disabled={
                      updateDisplayName.isPending ||
                      displayName === (settings.displayName ?? "")
                    }
                  >
                    {updateDisplayName.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to use your account name: {settings.name}
                </p>
              </div>

              {/* Account Info */}
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="mb-2 text-sm font-medium">Account Information</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Email:</span>{" "}
                    {settings.email}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Member since:</span>{" "}
                    {new Date(settings.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy
              </CardTitle>
              <CardDescription>Control your visibility and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show on Leaderboards</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow your name and scores to appear on public leaderboards
                  </p>
                </div>
                <Switch
                  checked={showOnLeaderboard}
                  onCheckedChange={(checked: boolean) => {
                    setShowOnLeaderboard(checked);
                    updateLeaderboard.mutate({ showOnLeaderboard: checked });
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Daily Goals Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Goals
              </CardTitle>
              <CardDescription>
                Set your daily learning targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cards Goal */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Daily Card Goal</Label>
                  <span className="rounded-md bg-muted px-2 py-1 text-sm font-medium">
                    {dailyCardGoal} cards
                  </span>
                </div>
                <Slider
                  value={[dailyCardGoal]}
                  onValueChange={(values: number[]) => setDailyCardGoal(values[0] ?? 10)}
                  onValueCommit={(values: number[]) => {
                    const value = values[0];
                    if (value !== undefined && value !== settings.dailyCardGoal) {
                      updateGoals.mutate({ dailyCardGoal: value });
                    }
                  }}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  How many flashcards you want to study each day
                </p>
              </div>

              {/* Quiz Goal */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Daily Quiz Goal</Label>
                  <span className="rounded-md bg-muted px-2 py-1 text-sm font-medium">
                    {dailyQuizGoal} {dailyQuizGoal === 1 ? "quiz" : "quizzes"}
                  </span>
                </div>
                <Slider
                  value={[dailyQuizGoal]}
                  onValueChange={(values: number[]) => setDailyQuizGoal(values[0] ?? 1)}
                  onValueCommit={(values: number[]) => {
                    const value = values[0];
                    if (value !== undefined && value !== settings.dailyQuizGoal) {
                      updateGoals.mutate({ dailyQuizGoal: value });
                    }
                  }}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  How many quizzes you want to complete each day
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Summary of your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-kkpsi-navy dark:text-kkpsi-navy-light">
                      {stats.totalCardsStudied}
                    </p>
                    <p className="text-xs text-muted-foreground">Cards Studied</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-kkpsi-gold">
                      {stats.totalQuizzesTaken}
                    </p>
                    <p className="text-xs text-muted-foreground">Quizzes Taken</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-orange-500">
                      {stats.longestStreak}
                    </p>
                    <p className="text-xs text-muted-foreground">Longest Streak</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.totalDaysActive}
                    </p>
                    <p className="text-xs text-muted-foreground">Days Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that affect your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reset Progress */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-medium">Reset All Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Delete all flashcard progress, quiz history, and streaks.
                    This cannot be undone.
                  </p>
                </div>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="shrink-0">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Reset Progress
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Reset All Progress?
                      </DialogTitle>
                      <DialogDescription className="pt-2">
                        This will permanently delete:
                        <ul className="mt-2 list-inside list-disc space-y-1">
                          <li>All flashcard progress ({stats?.totalCardsStudied ?? 0} cards)</li>
                          <li>All quiz history ({stats?.totalQuizzesTaken ?? 0} quizzes)</li>
                          <li>Your current streak ({stats?.currentStreak ?? 0} days)</li>
                          <li>All achievements and badges</li>
                        </ul>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        This action cannot be undone. Your learning progress will be permanently erased.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          resetProgress.mutate({ confirmText: "DELETE MY PROGRESS" })
                        }
                        disabled={resetProgress.isPending}
                      >
                        {resetProgress.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Yes, Reset Everything
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border-t border-red-200 dark:border-red-900" />

              {/* Delete Account */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                    You will be signed out immediately.
                  </p>
                </div>
                <Dialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="shrink-0">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Your Account?
                      </DialogTitle>
                      <DialogDescription className="pt-2">
                        This will permanently delete:
                        <ul className="mt-2 list-inside list-disc space-y-1">
                          <li>Your user account and profile</li>
                          <li>All flashcard progress ({stats?.totalCardsStudied ?? 0} cards)</li>
                          <li>All quiz history ({stats?.totalQuizzesTaken ?? 0} quizzes)</li>
                          <li>Your streaks and achievements</li>
                          <li>All connected sign-in methods</li>
                        </ul>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        This action cannot be undone. Your account and all data will be permanently deleted. You will need to create a new account to use the app again.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteAccountDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          deleteAccount.mutate({ confirmText: "DELETE MY ACCOUNT" })
                        }
                        disabled={deleteAccount.isPending}
                      >
                        {deleteAccount.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Yes, Delete My Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
