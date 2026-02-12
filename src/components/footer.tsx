"use client"

import Image from "next/image"
import Link from "next/link"
import { FaLocationDot } from "react-icons/fa6";
import { useAppSelector } from "@/store/hooks";
import { quickLinks, searches, section } from "@/data/footer";
import { useState } from "react";

export default function Footer() {
  const [logoLoading, setLogoLoading] = useState(true)

  const currentYear = new Date().getFullYear();
  const configData = useAppSelector((state) => state.config.data)

  const FooterColumn = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
    <div className={`flex flex-col space-y-[14px]`}>
      <h6 className="text-[white] text-[14px] font-normal uppercase tracking-widest">{title}</h6>
      <ul className="space-y-[5px]">
        {links.map((link) => (
          <li
           key={link.label} className="h-[28px]"
           style={{ fontFamily: "Roboto, sans-serif" }}
           >
            <Link
              href={link.href}
              className="text-[#7E7E7E] hover:text-white text-[14px] transition-colors duration-200 font-normal"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <footer className="bg-[#111111] text-[#999999] pt-[40px] pb-[16px] font-sans px-[34px]">

        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-[130px]">

          {/* Logo Section */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <Link href="/" className="inline-block relative w-[174px] h-[162.38px]">

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
                  className={`object-contain transition-opacity duration-300 -rotate-12 ${logoLoading ? "opacity-0" : "opacity-100"
                    }`}
                  priority
                  onLoadingComplete={() => setLogoLoading(false)}
                />
              )}

            </Link>
          </div>

          {/* Links Section */}
          <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-[60px] lg:mr-auto pb-[12px]">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[15px] gap-6 md:gap-0 mt-[16px] pt-8">

          <div className="flex flex-col md:flex-row items-start md:items-center gap-[26.3px]">
            <div className="flex items-center gap-2 text-white">
              <FaLocationDot className="w-[18px] h-[15px]"/>
              <h6 className="uppercase tracking-wider text-[12px] font-normal">UAE</h6>
            </div>
            <h6 className="text-[#7E7E7E] text-[11px]">
              © {currentYear} GetOutThere. All Rights Reserved
            </h6>
          </div>

          {/* Right Side: Legal Links */}
          <div className="flex items-center gap-6 sm:gap-8 text-[#7E7E7E]">
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors text-[12px]">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors text-[12px]">
              Privacy Policy
            </Link>
          </div>
        </div>
    </footer>
  )
}