import Sidebar from "@/components/dashboard/sidebar"
import Footer from "@/components/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F6]">
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 w-full overflow-x-hidden px-[30px] py-[70px] pb-[126px]">
            {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}