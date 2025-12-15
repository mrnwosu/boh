"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Filter, Building2, Users, Globe } from "lucide-react";
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
import { PageHero, EmptyState, AnimatedSection } from "~/components/shared";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

type ChapterStatus = "Active" | "Inactive" | "Probation" | "Colony" | "Suspended";

export function ChaptersClient() {
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

  // Compute statistics from all chapters (unfiltered)
  const { data: allChapters } = api.content.getChapters.useQuery({});

  const stats = useMemo(() => {
    if (!allChapters) return null;

    const activeCount = allChapters.filter(c => c.Active === "Active").length;
    const hbcuCount = allChapters.filter(c => c["Institution Type"] === "HBCU").length;
    const districts = new Set(allChapters.map(c => c.District)).size;

    return {
      total: allChapters.length,
      active: activeCount,
      hbcu: hbcuCount,
      districts,
    };
  }, [allChapters]);

  const districts = [
    "Northeast", "Mid-Atlantic", "Southeast", "North Central",
    "South Central", "Southwest", "Western", "International"
  ];

  const institutionTypes: Array<{ value: "PWI" | "HBCU"; label: string }> = [
    { value: "PWI", label: "PWI" },
    { value: "HBCU", label: "HBCU" },
  ];

  const statusOptions: Array<{ value: ChapterStatus; label: string }> = [
    { value: "Active", label: "Active" },
    { value: "Probation", label: "Probation" },
    { value: "Colony", label: "Colony" },
    { value: "Suspended", label: "Suspended" },
    { value: "Inactive", label: "Inactive" },
  ];

  const activeFiltersCount = [search, district, institutionType, statusFilter].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Navbar />

      <PageHero
        icon={MapPin}
        title="Chapter Directory"
        description="Explore all chapters of Kappa Kappa Psi across the nation"
      >
        {/* Stats Cards */}
        {stats && (
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-300">Total Chapters</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-kkpsi-gold">{stats.active}</div>
              <div className="text-sm text-gray-300">Active</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.hbcu}</div>
              <div className="text-sm text-gray-300">HBCU Chapters</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.districts}</div>
              <div className="text-sm text-gray-300">Districts</div>
            </div>
          </div>
        )}
      </PageHero>

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
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
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
                  <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
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
            <div className="flex flex-wrap items-center gap-3">
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value as ChapterStatus)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    {search && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {search.length > 15 ? search.slice(0, 15) + "..." : search}
                        <button onClick={() => setSearch("")} className="ml-1 hover:text-foreground">×</button>
                      </Badge>
                    )}
                    {district && (
                      <Badge variant="secondary" className="gap-1">
                        {district}
                        <button onClick={() => setDistrict("")} className="ml-1 hover:text-foreground">×</button>
                      </Badge>
                    )}
                    {institutionType && (
                      <Badge variant="secondary" className="gap-1">
                        {institutionType}
                        <button onClick={() => setInstitutionType("")} className="ml-1 hover:text-foreground">×</button>
                      </Badge>
                    )}
                    {statusFilter && (
                      <Badge variant="secondary" className="gap-1">
                        {statusFilter}
                        <button onClick={() => setStatusFilter("")} className="ml-1 hover:text-foreground">×</button>
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setDistrict("");
                      setInstitutionType("");
                      setStatusFilter("");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </>
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
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Showing {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
                {activeFiltersCount > 0 && " (filtered)"}
              </div>
              <AnimatedSection className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {chapters.map((chapter, index) => (
                  <div
                    key={`${chapter.Number}-${chapter.Chapter}`}
                    className={`animate-on-scroll stagger-${Math.min((index % 9) + 1, 7)} relative rounded-xl bg-card p-6 shadow-sm ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-ring/50 ${
                      chapter.Active === "Inactive" || chapter.Active === "Suspended" ? "opacity-60" : ""
                    }`}
                  >
                    {/* Gradient accent bar */}
                    <div className={`absolute left-0 top-6 h-10 w-1 rounded-r-full bg-gradient-to-b ${
                      chapter.Active === "Active"
                        ? "from-blue-500 to-blue-600"
                        : chapter.Active === "Probation"
                        ? "from-amber-500 to-orange-500"
                        : chapter.Active === "Colony"
                        ? "from-purple-500 to-purple-600"
                        : chapter.Active === "Suspended"
                        ? "from-red-400 to-red-500"
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
                            : chapter.Active === "Colony"
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : chapter.Active === "Suspended"
                            ? "bg-red-500 hover:bg-red-600 text-white"
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
                      {chapter["Institution Type"] && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <Badge variant="outline" className="text-xs">
                            {chapter["Institution Type"]}
                          </Badge>
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
              </AnimatedSection>
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

      {/* Historical Note */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-kkpsi-navy dark:text-foreground">
              A Legacy of Brotherhood
            </h2>
            <p className="text-lg text-muted-foreground">
              Since the founding of Alpha Chapter at Oklahoma A&M College in 1919,
              Kappa Kappa Psi has grown to include over 340 chapters serving college
              and university bands across the nation. Each chapter continues the
              tradition of service to college bands, fostering brotherhood, and
              developing leaders in the musical arts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
