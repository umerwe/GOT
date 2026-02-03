"use client";

import { useSearchParams } from "next/navigation";
import Container from "@/components/container";
import Hero from "@/components/pages/seller/hero";
import Tabs from "@/components/pages/seller/tabs";
import Footer from "@/components/footer";
import { useGetProducts } from "@/hooks/useProduct";
import GridCard from "@/components/cards/grid-card";

export default function SellerPageClient() {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab")?.toLowerCase() || "motorcycles";

  const isAccessories = activeTab === "gear" || activeTab === "accessories";

  const { data, isLoading } = useGetProducts({
    type: isAccessories ? "accessories" : "motor_bike",
    per_page: 8,
  });

  const displayData = data?.data || [];

  return (
    <section>
      <Hero />
      <Tabs />

      <Container className="pt-[40px] pb-[198px]">
        <div className="mb-[30px]">
          <h2 className="text-[24px] font-bold text-[#111111]">
            Active Listings
          </h2>
        </div>

        <GridCard
          products={displayData}
          isLoading={isLoading}
          count={8}
          isSecond={true}
        />
      </Container>

      <Footer />
    </section>
  );
}
