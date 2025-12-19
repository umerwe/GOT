"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin} from "lucide-react"
import { useAppSelector } from "@/store/hooks";
import { quickLinks, searches, section } from "@/data/footer";
import { useState } from "react";

export default function Footer() {
  const [logoLoading, setLogoLoading] = useState(true)

  const currentYear = new Date().getFullYear();
  const configData = useAppSelector((state) => state.config.data)

  const FooterColumn = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
    <div className={`flex flex-col space-y-4`}>
      <h6 className="text-white text-[14px] uppercase tracking-widest">{title}</h6>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[#999999] hover:text-white text-[14px] transition-colors duration-200 font-normal"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <footer className="bg-[#111111] text-[#999999] pt-10 md:pt-20 pb-10 font-sans px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-20 mb-10 md:mb-20">

          {/* Logo Section */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <Link href="/" className="inline-block relative w-[174px] h-[162px]">

              {/* Skeleton */}
              {logoLoading && (
                <div className="absolute inset-0 bg-[#2a2a2a] rounded-lg animate-pulse" />
              )}

              {configData?.site_logo && (
                <Image
                  src={configData.site_logo}
                  alt="Get Out There Logo"
                  width={174}
                  height={162}
                  className={`object-contain -rotate-12 transition-opacity duration-300 ${logoLoading ? "opacity-0" : "opacity-100"
                    }`}
                  priority
                  onLoadingComplete={() => setLogoLoading(false)}
                />
              )}

            </Link>
          </div>

          {/* Links Section */}
          <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 xl:gap-14 lg:mr-auto">
            <FooterColumn
              title="SECTIONS"
              links={section}
            />

            <FooterColumn
              title="QUICK LINKS"
              links={quickLinks}
            />

            <FooterColumn
              title="SEARCHES"
              links={searches}
            />
          </div>

          <div className="w-full lg:w-auto flex justify-start lg:justify-end">
            <div className="flex items-center gap-3">
              {/* Facebook Link */}
              <Link
                href="https://web.facebook.com/people/Get-Out-There-UAE/100086864606365/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/fb.png"
                  alt="Facebook"
                  width={256}
                  height={256}
                  className="w-[30px] h-[30px] object-contain hover:opacity-75 transition-opacity duration-300"
                />
              </Link>

              {/* Instagram Link */}
              <Link
                href="https://www.instagram.com/getoutthereuae/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/insta.png"
                  alt="Instagram"
                  width={256}
                  height={256}
                  className="w-[30px] h-[30px] object-contain hover:opacity-75 transition-opacity duration-300"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[15px] gap-6 md:gap-0 border-t border-[#222] pt-8">

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5" />
              <span className="uppercase tracking-wider font-semibold">UAE</span>
            </div>
            <p>
              © {currentYear} GetOutThere. All Rights Reserved
            </p>
          </div>

          {/* Right Side: Legal Links */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}