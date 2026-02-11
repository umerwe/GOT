"use client"
import AccessoriesSection from "@/components/accessories-section";
import AllMotorcyclesSection from "@/components/all-motorcycles-section";
import BrandsSection from "@/components/brands-section";
import PopularCategoriesSection from "@/components/popular-categories-section";
import Container from "@/components/container";
import FeaturedSection from "@/components/featured-section";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero";
import FeauredAdsSection from "@/components/featured-ads-section";
import { useHandleSessionAuth } from "@/hooks/useAuth";
import { ExtendedSession } from "@/types/auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const handleSessionAuth = useHandleSessionAuth();

  useEffect(() => {
    if (status === "authenticated" && session) {
      handleSessionAuth(session as ExtendedSession);
    }
  }, [session, status, handleSessionAuth]);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <Container className="space-y-[60px] mb-[60px]">
        <PopularCategoriesSection />
        <FeauredAdsSection />
        <AccessoriesSection />
        <BrandsSection />
        <AllMotorcyclesSection />
        <FeaturedSection />
      </Container>
      <Footer />
    </div>
  );
}
