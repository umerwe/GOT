import Sidebar from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="px-2 md:ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}