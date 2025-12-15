"use client";

import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Navbar } from "~/components/layout/navbar";
import { PageHero, EmptyState } from "~/components/shared";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

type ChapterStatus = "Active" | "Inactive" | "Probation";

export default function ChaptersPage() {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState<string>("");
  const [institutionType, setInstitutionType] = useState<"PWI" | "HBCU" | "">("");
  const [statusFilter, setStatusFilter] = useState<ChapterStatus | "">("");

  const { data: chapters, isLoading } = api.content.getChapters.useQuery({
    search: search || undefined,
    district: district || undefined,
    institutionType: institutionType || undefined,
    statusFilter: statusFilter || undefined,
  });

  const districts = [
    "Northeast", "Mid-Atlantic", "Southeast", "North Central",
    "South Central", "Southwest", "Western", "International"
  ];

  const institutionTypes: Array<{ value: "PWI" | "HBCU"; label: string }> = [
    { value: "PWI", label: "PWI" },
    { value: "HBCU", label: "HBCU" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      <PageHero
        icon={MapPin}
        title="Chapter Directory"
        description="Explore all 343 chapters of Kappa Kappa Psi across the nation"
      />

      {/* Filters */}
      <section className="border-b border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by chapter name or school..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={district || "all"} onValueChange={(value) => setDistrict(value === "all" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={institutionType || "all"} onValueChange={(value) => setInstitutionType(value === "all" ? "" : value as "PWI" | "HBCU")}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {institutionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value as ChapterStatus)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Probation">Probation</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {(search || district || institutionType || statusFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setDistrict("");
                    setInstitutionType("");
                    setStatusFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Chapters List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
                  <Skeleton className="mb-3 h-6 w-32" />
                  <Skeleton className="mb-4 h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : chapters && chapters.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {chapters.map((chapter) => (
                  <div
                    key={`${chapter.Number}-${chapter.Chapter}`}
                    className={`relative rounded-xl bg-card p-6 shadow-sm ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-ring/50 ${
                      chapter.Active === "Inactive" ? "opacity-60" : ""
                    }`}
                  >
                    {/* Gradient accent bar */}
                    <div className={`absolute left-0 top-6 h-10 w-1 rounded-r-full bg-gradient-to-b ${
                      chapter.Active === "Active"
                        ? "from-blue-500 to-blue-600"
                        : chapter.Active === "Probation"
                        ? "from-amber-500 to-orange-500"
                        : "from-gray-300 to-gray-400"
                    }`} />

                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {chapter.Chapter}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {chapter.School}
                        </p>
                      </div>
                      <Badge
                        variant={chapter.Active === "Active" ? "default" : "secondary"}
                        className={
                          chapter.Active === "Active"
                            ? "bg-green-500 hover:bg-green-600"
                            : chapter.Active === "Probation"
                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : ""
                        }
                      >
                        {chapter.Active}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chapter:</span>
                        <span className="font-medium text-foreground">{chapter.Number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">District:</span>
                        <span className="font-medium text-foreground">{chapter.District}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded:</span>
                        <span className="font-medium text-foreground">{chapter["Founding Date"]}</span>
                      </div>
                      {chapter.Location && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium text-foreground">{chapter.Location}</span>
                        </div>
                      )}
                      {chapter["NCAA Conference"] && (
                        <div className="mt-3 border-t border-border pt-3">
                          <span className="text-xs text-muted-foreground">
                            {chapter["NCAA Conference"]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={MapPin}
              title="No chapters found"
              description="No chapters match your current filters."
              action={{
                label: "Clear Filters",
                onClick: () => {
                  setSearch("");
                  setDistrict("");
                  setInstitutionType("");
                  setStatusFilter("");
                },
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
