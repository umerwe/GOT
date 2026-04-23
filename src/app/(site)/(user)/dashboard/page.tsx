import AdsTable from "@/components/current-ads"

export default function DashboardPage() {
    return (
        <div>
            <h2 className="text-[20px] mb-[10px] h-[40px]">Dashboard</h2>

            <div className="flex items-center justify-between mb-[10px] h-[36px]">
                <h1 className="text-[20px] font-semibold text-[#000000]">
                    Latest Ads
                </h1>
            </div>

            <AdsTable selectedStatus={undefined} />
        </div>
    )
}