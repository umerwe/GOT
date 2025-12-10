"use client"
import AdsTable from '@/components/current-ads'
import { useParams } from 'next/navigation'
import React from 'react'

const StatusPage = () => {
    const params = useParams()
    const statusName = params.name as string

    const displayTitle = statusName === 'all' ? 'All Ads' : statusName

    return (
        <div className="space-y-6 max-w-5xl mx-auto px-2">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">
                    {displayTitle}
                </h2>
            </div>

            <AdsTable selectedStatus={statusName === "all" ? undefined : statusName} />
        </div>
    )
}

export default StatusPage