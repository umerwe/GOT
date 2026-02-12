"use client";

import { useParams, useSearchParams } from "next/navigation";
import Container from "@/components/container";
import Hero from "@/components/pages/vendor/hero";
import Tabs from "@/components/pages/vendor/tabs";
import Footer from "@/components/footer";
import { useGetVendorProduct } from "@/hooks/useProduct";
import GridCard from "@/components/cards/grid-card";
import { useMemo } from "react";
import { Product } from "@/types/vendor";
import { Skeleton } from "@/components/ui/skeleton";

export default function Vendor() {
  const params = useParams();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab")?.toLowerCase() || "motorcycles";

  const { data, isLoading } = useGetVendorProduct(params?.id as string);

  const filteredProducts = useMemo(() => {
    const products = data?.products || [];
    if (!products.length) return [];

    return products.filter((product: Product) => {
      return product.category?.type === activeTab;
    });
  }, [data, activeTab]);

  return (
    <section>
      {isLoading ? (
        <VendorHeroSkeleton />
      ) : (
        <Hero
          logo={data?.logo}
          name={data?.name}
          address={data?.address}
        />
      )}
      
      <Tabs />

      <Container className="pt-[40px] pb-[198px]">
        <div className="mb-[30px]">
          <h2 className="text-[24px] font-bold text-[#111111]">
            Active Listings
          </h2>
        </div>

        {/* GridCard handles its own skeleton internally via the isLoading prop */}
        <GridCard
          products={filteredProducts}
          isLoading={isLoading}
          count={8}
          isSecond={true}
        />
      </Container>

      <Footer />
    </section>
  );
}

// Custom Skeleton for the Hero Section to match VendorHero design
function VendorHeroSkeleton() {
  return (
    <div className="bg-white pt-12 pb-[30px] flex flex-col items-center">
      {/* Circle Logo Skeleton */}
      <Skeleton className="w-32 h-32 rounded-full mb-[16px]" />
      
      {/* Name Skeleton */}
      <Skeleton className="h-8 w-48 mb-[10px]" />
      
      {/* Badges Skeleton */}
      <div className="flex gap-3 mb-[10px]">
        <Skeleton className="h-[30px] w-32 rounded-full" />
        <Skeleton className="h-[30px] w-24 rounded-full" />
      </div>
      
      {/* Rating Skeleton */}
      <Skeleton className="h-5 w-40" />
    </div>
  );
}