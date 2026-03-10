"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetProducts } from "@/hooks/useProduct";
import GridCard from "./cards/grid-card";

const FeauredAdsSection = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetProducts({
    page: page,
    per_page: 6
  });
  
  const products = data?.data || [];
  const pagination = data?.pagination;
  
  const handlePaginate = (dir: number) => {
    setPage((prev) => prev + dir);
    document.getElementById("trending-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="scroll-smooth border-b-3 border-[#EBEBEB] pb-[45px]">
      <div className="flex items-center justify-between mb-[10px]">
        <h2>Featured Ads</h2>
        <div className="flex items-center gap-2">

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => handlePaginate(-1)}
            disabled={page <= 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => handlePaginate(1)}
            disabled={!pagination || page >= pagination.totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <GridCard products={products} isLoading={isLoading} isSecond={true} />
    </div>
  );
};

export default FeauredAdsSection;