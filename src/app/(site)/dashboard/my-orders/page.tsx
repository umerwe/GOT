"use client"
import { useGetOrderList } from "@/hooks/useOrder";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import SkeletonLoader from "@/common/skeleton-loader";
import Pagination from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
export interface OrderProduct {
  id: number;
  product_id: number;
  product: {
    id: number;
    title: string;
    image: string;
  };
  order_id: number;
  price: string | number;
  quantity: number;
  discount_on_item: string;
  discount_type: string;
  tax_amount: string;
  total_add_on_price: string;
  order_amount: number;
}

export interface Order {
  id: number;
  order_amount: string;
  coupon_discount_amount: string;
  coupon_discount_title: string | null;
  payment_status: "paid" | "unpaid" | string;
  order_status: "pending" | "delivered" | "canceled" | string;
  total_tax_amount: string;
  payment_method: string;
  order_note: string | null;
  order_type: string;
  delivery_address: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  vendor: {
    id: number;
    name: string | null;
    email: string;
  };
  order_details: OrderProduct[];
  created_at: string;
  updated_at: string;
}
export default function MyOrdersPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<string>("newest");

    // 1. Server-Side Pagination: Pass only the page to the hook
    const { data: orderResponse, isLoading } = useGetOrderList(currentPage);

    const rawOrders = orderResponse?.data ?? [];
    // 2. Server-Side Metadata: Use totalPages from the API
    const totalPages = orderResponse?.pagination?.totalPages || 1;
    const itemsPerPage = orderResponse?.pagination?.per_page || 10;

    // 3. Client-Side Sorting: Only sorts the items currently visible on this page
    const sortedOrders = useMemo(() => {
        const result = [...rawOrders];

        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            if (sortBy === "oldest") {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }
            return 0;
        });

        return result;
    }, [rawOrders, sortBy]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-[10px] h-[40px]">
                <h2 className="text-[20px] capitalize font-medium text-[#111111]">
                    My Orders
                </h2>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                    <SelectTrigger className="w-[156px] h-[36px] text-[14px] font-normal bg-white border-[#E5E7EB] text-[#0E1620]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white border border-gray-200 overflow-x-auto">
                <div className="min-w-[1000px]">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-[14px] font-bold text-[#111111] uppercase tracking-wide">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-3">Product</div>
                        <div className="col-span-2">Total Amount</div>
                        <div className="col-span-2">Payment</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Date</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center">
                                    <div className="col-span-1"><Skeleton className="h-4 w-8" /></div>
                                    <div className="col-span-3 flex items-center gap-3">
                                        <Skeleton className="w-[60px] h-[60px] flex-shrink-0" />
                                        <div className="space-y-2 w-full">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                    <div className="col-span-2"><Skeleton className="h-4 w-20" /></div>
                                    <div className="col-span-2"><Skeleton className="h-6 w-16" /></div>
                                    <div className="col-span-2"><Skeleton className="h-4 w-24" /></div>
                                    <div className="col-span-2"><Skeleton className="h-4 w-20" /></div>
                                </div>
                            ))
                        ) : sortedOrders.length > 0 ? (
                            sortedOrders.map((order: Order, index: number) => (
                                <div
                                    key={order.id}
                                    className="grid grid-cols-12 gap-4 p-4 transition-colors items-center hover:bg-gray-50/50"
                                >
                                    <div className="col-span-1 text-sm font-medium text-gray-900">
                                        #{(currentPage - 1) * itemsPerPage + (index + 1)}
                                    </div>

                                    <div className="col-span-3 flex items-center gap-3">
                                        <div className="w-[60px] h-[60px] bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-200">
                                            <Image
                                                src={order.order_details[0]?.product?.image || "/placeholder.svg"}
                                                alt="product"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h1 className="text-sm text-[#000000] font-medium truncate">
                                                {order.order_details[0]?.product?.title}
                                            </h1>
                                            <p className="text-xs text-[#6A7282]">
                                                Qty: {order.order_details[0]?.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <p className="text-sm font-bold text-[#111111]">
                                            AED {parseFloat(order.order_amount).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="col-span-2">
                                        <span className={cn(
                                            "px-3 py-1 text-[11px] font-bold uppercase rounded-none border whitespace-nowrap",
                                            order.payment_status === "paid"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-orange-50 text-orange-700 border-orange-200"
                                        )}>
                                            {order.payment_status}
                                        </span>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "w-2 h-2 rounded-full flex-shrink-0",
                                                order.order_status === "pending" ? "bg-yellow-400" : "bg-blue-400"
                                            )} />
                                            <span className="text-sm font-normal text-[#6A7282] capitalize truncate">
                                                {order.order_status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-xs text-[#6A7282] whitespace-nowrap">
                                        {new Date(order.created_at).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No orders found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Pagination is tied to the server totalPages --- */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}