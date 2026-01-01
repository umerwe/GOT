import AdsTable from "@/components/current-ads"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardPage() {
    return (
        <div>
            <h2 className="text-[20px] mb-[10px] h-[40px]">Dashboard</h2>

            <div className="flex items-center justify-between mb-[10px] h-[36px]">
                <h1 className="text-[20px] font-semibold text-[#000000]">
                    Latest Ads
                </h1>

                <Select>
                    <SelectTrigger className="w-[156px] h-[36px] text-[14px] font-normal bg-white border-[#E5E7EB] text-[#0E1620]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <AdsTable selectedStatus={undefined} />
        </div>
    )
}