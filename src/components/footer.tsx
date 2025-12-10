"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Facebook, Instagram } from "lucide-react"
import { useAppSelector } from "@/store/hooks";
import { quickLinks, searches, section } from "@/data/footer";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const configData = useAppSelector((state) => state.config.data)

  const FooterColumn = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
    <div className="flex flex-col space-y-4">
      <h3 className="text-white text-sm font-bold uppercase tracking-widest">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[#999999] hover:text-white text-[15px] transition-colors duration-200 font-normal"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  const SocialIcon = ({ href, icon }: { href: string; icon: React.ReactNode }) => {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-[#2a2a2a] text-[#999999] hover:bg-white hover:text-black transition-all duration-300 rounded-full w-10 h-10 flex items-center justify-center"
      >
        <div className="transition-transform duration-300 group-hover:rotate-12">
          {icon}
        </div>
      </a>
    )
  }

  return (
    <footer className="bg-[#111111] text-[#999999] pt-20 pb-10 font-sans px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-28">

          <div className="w-full lg:w-auto flex-shrink-0 mb-8 lg:mb-0">
            <Link href="/" className="inline-block">
              <Image
                src={configData?.site_logo as string}
                alt="Get Out There Logo"
                width={110}
                height={110}
                className="object-contain -rotate-12"
                priority
              />
            </Link>
          </div>

          <div className="max-w-4xl mx-auto lg:flex-1 grid grid-cols-1 sm:grid-cols-3 lg:px-12 xl:px-24">

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
              <SocialIcon href="https://web.facebook.com/people/Get-Out-There-UAE/100086864606365/" icon={<Facebook className="w-5 h-5" />} />
              <SocialIcon href="https://www.instagram.com/getoutthereuae/" icon={<Instagram className="w-5 h-5" />} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[15px] gap-6 md:gap-0">

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
          <div className="flex items-center gap-8">
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
