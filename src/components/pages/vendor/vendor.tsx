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
      <Hero
        logo={data?.logo}
        name={data?.name}
      />
      <Tabs />

      <Container className="pt-[40px] pb-[198px]">
        <div className="mb-[30px]">
          <h2 className="text-[24px] font-bold text-[#111111]">
            Active Listings
          </h2>
        </div>

        <GridCard
          products={filteredProducts}
          isLoading={isLoading}
          count={8}
          isSecond={true}
        />

        {/* {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-medium">
            No {activeTab} found for this vendor.
          </div>
        )} */}
      </Container>

      <Footer />
    </section>
  );
}