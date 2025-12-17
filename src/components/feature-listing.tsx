"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FeaturedListings = () => {
  const [sortBy, setSortBy] = useState("Most Recent");

  const sortOptions = [
    "Most Recent",
    "Price: Low to High",
    "Price: High to Low",
    "Most Popular",
    "Oldest First",
  ];

  const filters = [
    { name: "Brand", active: true },
    { name: "Condition", active: false },
    { name: "Seller Type", active: false },
    { name: "Price Range", active: false },
    { name: "Location", active: false },
  ];

  return (
    <div className="bg-gray-100 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6 mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#000000] mb-4 sm:mb-0">
          Featured Listings
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm font-medium">Sort By:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="min-w-[180px] text-black justify-between bg-solid hover:bg-hover border border-gray-300 rounded-md">
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <Select key={filter.name}>
            <SelectTrigger
              className={`rounded-full min-w-[100px] justify-between text-black ${filter.active
                  ? "bg-solid hover:bg-hover"
                  : "bg-white hover:bg-gray-50 border-gray-300"
                }`}
            >
              <SelectValue placeholder={filter.name} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder" disabled>
                {filter.name} options would go here
              </SelectItem>
            </SelectContent>
          </Select>
        ))}
      </div>
    </div>
  );
};

export default FeaturedListings;
