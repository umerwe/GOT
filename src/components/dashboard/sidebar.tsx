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
  { title: "Dashboard", icon: User, href: "/dashboard" },
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
  { title: "My Profile", icon: User, href: "/dashboard/profile" },
]

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ "My Ads": true });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    dispatch(logout());
    router.replace('/auth/login');
    await signOut({ redirect: false });
    queryClient.clear();
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {
        !isMobileOpen &&
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden absolute right-4 top-1 z-50 bg-[#1a1a1a] text-white p-2 rounded-sm shadow-2xl border border-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>

      }

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          // h-[100dvh] prevents content from being hidden by mobile browser bars
          "fixed md:sticky top-0 left-0 z-50 w-72 md:w-64 pt-[81px] pb-[55px] bg-white flex flex-col transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Header (Pinned) */}
        <div className="relative bg-[#1a1a1a] text-white mt-22 md:mt-0 px-4 h-[40px] flex items-center justify-between flex-shrink-0">
          <div className="absolute left-[8px] w-[16px] h-full bg-white" />

          <h4 className="text-[16px] pl-[20px]">Manage</h4>

          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation (The Scroller) */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar touch-pan-y">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.children ? (
                <div className="space-y-1">
                  <div
                    className="flex items-center justify-between text-gray-800 font-semibold mb-[14px] px-2 cursor-pointer select-none"
                    onClick={() => toggleSection(item.title)}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <h3>{item.title}</h3>
                    </div>
                    {openSections[item.title] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>

                  {openSections[item.title] && (
                    <div className="ml-2 pl-4 space-y-[14px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-between py-2 text-sm font-normal transition-colors",
                            pathname === child.href ? "text-black font-bold" : "text-[#0E1620] hover:text-black"
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
                    "flex items-center text-sm gap-3 px-2 py-1 transition-colors font-medium",
                    pathname === item.href ? "text-black font-bold" : "text-black"
                  )}
                >
                  <h1>{item.title}</h1>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout (Pinned to bottom - Never hidden) */}
        <div className="sm:mt-[432px] bg-white flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 pl-[48px] py-2 w-full text-gray-700 hover:text-red-600 font-normal text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}