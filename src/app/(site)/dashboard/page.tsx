import AdsTable from "@/components/current-ads"

export default function DashboardPage() {
    return (
        <div className="max-w-5xl mx-auto px-2">
            <h2 className="text-2xl font-bold text-[#000000] mb-6">Dashboard</h2>

            <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl text-[#000000] capitalize tracking-tight">
                    Latest Ads
                </h1>
            </div>

            <AdsTable selectedStatus={undefined} />
        </div>
    )
}
