"use client"
import AdsTable from '@/components/current-ads'
import { useParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const StatusPage = () => {
    const params = useParams()
    const statusName = params.name as string

    const displayTitle = statusName === 'all' ? 'All Ads' : statusName

    return (
        <div>
            <div className="flex items-center justify-between mb-[10px] h-[40px]">
                <h2 className="text-[20px] capitalize">
                    {displayTitle}
                </h2>
                <Select>
                    <SelectTrigger className="w-[156px] h-[36px] text-[14px] font-normal bg-white border-[#E5E7EB] text-[#0E1620]">
                        <SelectValue placeholder="Sort by" className="" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <AdsTable selectedStatus={statusName === "all" ? undefined : statusName} />
        </div>
    )
}

export default StatusPage