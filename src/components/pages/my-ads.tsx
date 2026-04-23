"use client"

import AdsTable from '@/components/current-ads'
import { useParams } from 'next/navigation'

const MyAds = () => {
    const params = useParams()
    const statusName = params.name as string

    const displayTitle =
        statusName === 'all'
            ? 'All Ads'
            : statusName === 'inactive'
                ? 'In Active'
                : statusName;

    return (
        <div>
            <div className="flex items-center justify-between mb-[10px] h-[40px]">
                <h2 className="text-[20px] capitalize">
                    {displayTitle}
                </h2>
            </div>

            <AdsTable selectedStatus={statusName === "all" ? undefined : statusName} />
        </div>
    )
}

export default MyAds