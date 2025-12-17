"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetProduct } from "@/hooks/useProduct";
import LocationSection from "@/components/location-section";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SkeletonLoader from "@/common/skeleton-loader";
import { capitalizeWords } from "@/utils/capitalizeWords";

export default function MyListing() {
  const { id } = useParams();
  const { data: product_data, isLoading, error } = useGetProduct(id as string);

  const [showLoginDialog, setShowLoginDialog] = useState(false);

  if (isLoading) {
    return (
      <SkeletonLoader type="mylisting" />
    );
  }


  if (error || !product_data) {
    return (
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-red-600">Error loading listing.</p>
        </div>
      </div>
    );
  }

  const specs = [
    { k: "Condition", v: `${product_data.condition}/10` },
    { k: "Brand", v: product_data.brand.title },
    { k: "Category", v: product_data.category.title },
    { k: "Subcategory", v: product_data?.subcategory?.title },
    { k: "Usage", v: product_data.usage.replace("_", " ").toUpperCase() },
    { k: "Mileage", v: `${product_data.mileage} ${product_data.mileage_unit}` },
    { k: "Manufacturing Year", v: product_data.manufacturing_year },
    { k: "Final Drive System", v: product_data.final_drive_system.replace("_", " ").toUpperCase() },
    { k: "Wheels", v: product_data.wheels.replace("_", " ").toUpperCase() },
    { k: "Engine Size", v: `${product_data.engine_size}` },
    { k: "Warranty", v: product_data.warranty === "1" ? "Yes" : "No" },
    { k: "Seller Type", v: product_data.seller_type.toUpperCase() },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Gallery */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {product_data.product_images.map((src: string, i: number) => (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={src}
                alt={`${product_data.title} ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </section>

        {/* Title + Desc */}
        <section className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#000000]">
            {product_data.title}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {product_data.description}
          </p>
        </section>

        {/* Specs */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Specifications
          </h2>
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <dl className="divide-y">
                {specs.map((s) => (
                  <div
                    key={s.k}
                    className="grid grid-cols-2 gap-3 py-3 text-sm"
                  >
                    <dt className="text-gray-500">{s.k}</dt>
                    <dd className="text-[#000000]">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </section>

        {/* Price */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Price
          </h2>
          <div className="text-3xl font-bold text-[#000000]">
            د.إ {product_data.price}
          </div>
        </section>

        {/* Location */}
        <LocationSection product_data={product_data} />

        {/* Contact */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Contact Information
          </h2>
          <Card className="border">
            <CardContent className="p-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <div className="text-gray-500">Contact Name</div>
                  <div className="text-[#000000]">{capitalizeWords(product_data.user.name)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Phone</div>
                  <div className="text-[#000000]">
                    {product_data.user.phoneNumber}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Email</div>
                  <div className="text-[#000000]">{product_data.user.email}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* 🔑 Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You must be logged in to send a message.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
            <Link href="/auth/login">
              <Button variant="default">Login</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
