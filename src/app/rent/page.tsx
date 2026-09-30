"use client";

import type { HotelListing } from "@/@types/hotel";
import {
  HotelHeader,
  DestinationCarousel,
  CategoryFilterRow,
} from "@/components/listings";
import { STUB_HOTELS } from "@/lib/mockData/hotels";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LayoutDashboard, Lightbulb } from "lucide-react";

type SortOption = "relevance" | "price-low" | "price-high";

export default function HotelListingPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Family",
    "Students",
  ]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    "San José",
    "Heredia",
  ]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [minPrice, setMinPrice] = useState<number>(3200);
  const [maxPrice, setMaxPrice] = useState<number>(206000);

  const filteredApartments = useMemo(() => {
    const apartments = STUB_HOTELS.filter((apartment) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(apartment.category);
      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.includes(apartment.location);
      const matchesBedroom =
        selectedBedrooms === "all" ||
        apartment.bedrooms === Number(selectedBedrooms);
      const matchesPrice =
        apartment.price >= minPrice && apartment.price <= maxPrice;

      return (
        matchesCategory && matchesLocation && matchesBedroom && matchesPrice
      );
    });

    if (sortOption === "price-low") {
      return [...apartments].sort((left, right) => left.price - right.price);
    }

    if (sortOption === "price-high") {
      return [...apartments].sort((left, right) => right.price - left.price);
    }

    return [...apartments].sort(
      (left, right) => Number(right.promoted) - Number(left.promoted),
    );
  }, [
    maxPrice,
    minPrice,
    selectedBedrooms,
    selectedCategories,
    selectedLocations,
    sortOption,
  ]);

  const toggleValue = (values: string[], value: string) => {
    if (value === "") {
      return [];
    }
    return values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value];
  };

  const handleCategoryToggle = (category: string) => {
    if (category === "") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((current) => toggleValue(current, category));
    }
  };

  const handleApartmentClick = (apartment: HotelListing) => {
    router.push(`/rent/${apartment.id}`);
  };

  const handleReset = () => {
    setSortOption("relevance");
    setSelectedCategories(["Family", "Students"]);
    setSelectedLocations(["San José", "Heredia"]);
    setSelectedBedrooms("all");
    setMinPrice(3200);
    setMaxPrice(206000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
      <HotelHeader />

      <div className="mx-auto max-w-[1180px] px-6 py-8 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[24px] leading-tight text-gray-900 dark:text-white sm:text-[30px]">
              Available for rent in{" "}
              <span className="font-semibold">Costa Rica, San José</span>
            </h1>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              204 units available
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Switch to Host view
            </button>

            <Link
              href="/guest/suggestions"
              className="flex items-center gap-1.5 text-sm font-medium text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Lightbulb aria-hidden="true" className="h-4 w-4" />
              Suggestions view
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <DestinationCarousel
            destinations={filteredApartments}
            onDestinationClick={handleApartmentClick}
          />
        </div>

        <div className="mt-6">
          <CategoryFilterRow
            selectedCategories={selectedCategories}
            selectedLocations={selectedLocations}
            selectedBedrooms={selectedBedrooms}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCategoryToggle={handleCategoryToggle}
            onLocationToggle={(location) =>
              setSelectedLocations((current) => toggleValue(current, location))
            }
            onBedroomSelect={setSelectedBedrooms}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
