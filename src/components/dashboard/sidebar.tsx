"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { User, FileText, ChevronDown, ChevronRight, Menu, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { logout } from "@/store/slices/AuthSlice"
import { signOut } from "next-auth/react"
import { useQueryClient } from "@tanstack/react-query"

const menuItems = [
  {
    title: "Dashboard",
    icon: User,
    href: "/dashboard",
  },
  {
    title: "My Ads",
    icon: FileText,
    isHeader: true,
    children: [
      { name: "All Ads", href: "/dashboard/status/all" },
      { name: "Pending", href: "/dashboard/status/pending" },
      { name: "Approved", href: "/dashboard/status/approved" },
      { name: "Rejected", href: "/dashboard/status/rejected" },
      { name: "Expired", href: "/dashboard/status/expired" },
    ],
  },
  {
    title: "My Profile",
    icon: User,
    href: "/dashboard/profile",
  },
]


export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  // State to track expanded sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "My Ads": true
  })

  // State to track mobile menu visibility
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleLogout = async () => {
    dispatch(logout())
    router.replace('/auth/login')
    await signOut({ redirect: false });
    queryClient.clear();
  }

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed right-4 top-22 sm:top-29 z-50 bg-black text-white p-2 rounded-md shadow-lg hover:bg-gray-800 transition-colors"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* --- Mobile Overlay (Closes menu when clicking outside) --- */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside
        className={cn(
          // Changed h-screen to h-[calc(100vh-theme(spacing.16))] to account for mt-16 and prevent cutoff
          // Removed overflow-y-auto from here, moved to nav
          "w-64 bg-white border-r h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] mt-16 sm:mt-24 md:mt-24 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out pb-4",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white p-4 h-16 flex items-center justify-between flex-shrink-0">
          <h1 className="text-lg font-medium">Manage</h1>
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation - Added flex-1 and overflow-y-auto to allow scrolling within nav only */}
        <nav className="p-4 space-y-4 flex-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.children ? (
                <div className="space-y-1">
                  <div
                    className="flex items-center justify-between text-gray-800 font-semibold mb-2 px-2 cursor-pointer select-none hover:text-solid transition-colors"
                    onClick={() => toggleSection(item.title)}
                  >
                    <div className="flex items-center gap-2 text-base">
                      <h1>{item.title}</h1>
                    </div>
                    {openSections[item.title] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>

                  {openSections[item.title] && (
                    <div className="ml-2 border-l border-gray-200 pl-4 space-y-1 transition-all duration-300 ease-in-out">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-between py-2 text-sm transition-colors hover:text-solid",
                            pathname === child.href ? "text-solid font-medium" : "text-gray-500"
                          )}
                        >
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href || "#"}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center text-base gap-3 px-2 text-gray-700 hover:text-solid transition-colors font-medium",
                    pathname === item.href ? "text-solid" : ""
                  )}
                >
                  <h1>{item.title}</h1>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* --- Logout Section (Pinned to Bottom) --- */}
        <div className="p-4 pb-0 border-t border-gray-100 mt-auto">
          <button
            onClick={() => handleLogout()}
            className="flex items-center gap-3 px-2 w-full text-gray-700 hover:text-red-600 transition-colors font-medium text-base group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}