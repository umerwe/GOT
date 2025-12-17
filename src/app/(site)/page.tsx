"use client"
import AccessoriesSection from "@/components/accessories-section";
import AllMotorcyclesSection from "@/components/all-motorcycles-section";
import BrandsSection from "@/components/brands-section";
import CategoriesSection from "@/components/categories-section";
import Container from "@/components/container";
import Features from "@/components/features";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero";
import Products from "@/components/products";
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
    <div className="flex flex-col gap-[60px]">
      <HeroSection />
      <Container className="space-y-[60px]">
        <CategoriesSection />
        <Products />
        <AccessoriesSection />
        <BrandsSection />
        <AllMotorcyclesSection />
        <Features />
      </Container>
      <Footer />
    </div>
  );
}
