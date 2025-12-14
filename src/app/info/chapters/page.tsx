"use client";

import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Navbar } from "~/components/layout/navbar";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

export default function ChaptersPage() {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState<string>("");
  const [institutionType, setInstitutionType] = useState<string>("");
  const [showInactive, setShowInactive] = useState(false);

  const { data: chapters, isLoading } = api.content.getChapters.useQuery({
    search: search || undefined,
    district: district || undefined,
    institutionType: institutionType || undefined,
    activeOnly: !showInactive,
  });

  const districts = [
    "Northeast", "Mid-Atlantic", "Southeast", "North Central",
    "South Central", "Southwest", "Western", "International"
  ];

  const institutionTypes = ["Public", "Private", "HBCU"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-kkpsi-navy via-kkpsi-navy-light to-kkpsi-navy py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <MapPin className="mx-auto mb-4 h-16 w-16 text-kkpsi-gold" />
            <h1 className="mb-4 font-serif text-5xl font-bold text-white">
              Chapter Directory
            </h1>
            <p className="text-xl text-gray-200">
              Explore all 343 chapters of Kappa Kappa Psi across the nation
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by chapter name or school..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={district} onValueChange={setDistrict}>
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
              <Select value={institutionType} onValueChange={setInstitutionType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {institutionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={showInactive ? "default" : "outline"}
                size="sm"
                onClick={() => setShowInactive(!showInactive)}
                className={showInactive ? "bg-kkpsi-navy hover:bg-kkpsi-navy-light" : ""}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showInactive ? "Showing Inactive" : "Active Only"}
              </Button>
              {(search || district || institutionType) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setDistrict("");
                    setInstitutionType("");
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
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : chapters && chapters.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {chapters.map((chapter) => (
                  <Card
                    key={`${chapter.Number}-${chapter.Chapter}`}
                    className={`border-2 transition-all hover:shadow-lg ${
                      chapter.Active === "Yes"
                        ? "hover:border-kkpsi-navy"
                        : "opacity-60"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl text-kkpsi-navy">
                            {chapter.Chapter}
                          </CardTitle>
                          <CardDescription className="mt-1 font-medium">
                            {chapter.School}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={chapter.Active === "Yes" ? "default" : "secondary"}
                          className={
                            chapter.Active === "Yes"
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {chapter.Active === "Yes" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chapter:</span>
                        <span className="font-medium">{chapter.Number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">{chapter.District}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Founded:</span>
                        <span className="font-medium">{chapter["Founding Date"]}</span>
                      </div>
                      {chapter.Location && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{chapter.Location}</span>
                        </div>
                      )}
                      {chapter["NCAA Conference"] && (
                        <div className="mt-2 pt-2 border-t">
                          <span className="text-gray-600 text-xs">
                            {chapter["NCAA Conference"]}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600">
                No chapters found matching your filters.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setDistrict("");
                  setInstitutionType("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
