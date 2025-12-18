import Container from "@/components/container"
import Sidebar from "@/components/dashboard/sidebar"
import Footer from "@/components/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 w-full overflow-x-hidden">
          <Container className="px-4 py-6 md:px-6">
            {children}
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  )
}