"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGetProducts } from "@/hooks/useProduct";
import SkeletonLoader from "@/common/skeleton-loader";
import NoListingsFound from "@/common/no-listing-found";
import Listing from "@/components/pages/listing";

function ListingBySearchInner() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const { data = [], isLoading } = useGetProducts(
    { search: title || "" },
    { enabled: !!title }
  );

  if (!title) return <NoListingsFound isFilterPage={false} />;
  if (isLoading) return <SkeletonLoader type="alllisting" />;
  if (!data.data || data.data.length === 0)
    return <NoListingsFound isFilterPage={false} />;

  const filteredData = data.data[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <Listing key={data.data.id} product={filteredData} />
    </div>
  );
}

export default function ListingBySearch() {
  return (
    <Suspense fallback={<SkeletonLoader type="alllisting" />}>
      <ListingBySearchInner />
    </Suspense>
  );
}

// "use client"

// import { useSearchParams } from "next/navigation"
// import { useGetProducts } from "@/hooks/useProduct"
// import SkeletonLoader from "@/common/skeleton-loader"
// import NoListingsFound from "@/common/no-listing-found"
// import Listing from "@/components/pages/listing"

// export default function ListingBySearch() {
//   const searchParams = useSearchParams()
//   const title = searchParams.get("title")

//   const { data = [], isLoading } = useGetProducts(
//     { search: title || "" },
//     { enabled: !!title }
//   )

//   if (!title) return <NoListingsFound isFilterPage={false} />
//   if (isLoading) return <SkeletonLoader type="alllisting" />
//   if (!data.data || data.data.length === 0) return <NoListingsFound isFilterPage={false} />

//   const filteredData = data.data[0]

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
//       <Listing key={data.data.id} product={filteredData} />
//     </div>
//   )

// }
