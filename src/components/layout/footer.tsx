"use client"

import Image from "@/components/custom/MyImage"
import Link from "next/link"
import { FaLocationDot } from "react-icons/fa6";
import { section } from "@/data/footer";
import { useGetConfig } from "@/hooks/useConfig";
import Logo from "../logo";
import { useGetCategories } from "@/hooks/useCategories";
import { useState } from "react";
import LoginDialog from "@/components/dialogs/loginDialog";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Category } from "@/types/business";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: configData } = useGetConfig();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategories();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const footerCategories = categoriesData?.slice(0, 5).map((cat: Category) => ({
    label: cat.title,
    href: `/categories/${cat.id}`
  })) || [];

  const FooterColumn = ({ 
    title, 
    links, 
    isLoading 
  }: { 
    title: string; 
    links: { label: string; href: string }[]; 
    isLoading?: boolean 
  }) => (
    <div className={`flex flex-col space-y-[14px]`}>
      <h6 className="text-[white] text-[14px] font-normal uppercase tracking-widest">{title}</h6>
      <ul className="space-y-[5px]">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="h-[28px] flex items-center">
              <Skeleton className="h-3 w-24 bg-[#1a1a1a]" />
            </li>
          ))
        ) : (
          links.map((link, index) => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const isAdvertisingProtected = link.label === "Advertising" && !token;

            return (
              <li
                key={`${link.label}-${index}`} className="h-[28px]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {isAdvertisingProtected ? (
                  <button
                    onClick={() => setIsLoginDialogOpen(true)}
                    className="text-[#7E7E7E] hover:text-white text-[14px] transition-colors duration-200 font-normal text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-[#7E7E7E] hover:text-white text-[14px] transition-colors duration-200 font-normal"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  )

  return (
    <footer className="bg-black text-[#999999] pt-[40px] pb-[16px] font-sans px-[34px]">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-[130px]">
        <div className="w-full lg:w-auto flex-shrink-0">
          <Logo
            logo={configData?.braaap_logo}
            className="w-[174px] h-[162px]"
          />
        </div>

        <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-[60px] lg:mr-auto pb-[12px]">
          <FooterColumn
            title="SECTIONS"
            links={section}
          />

          <FooterColumn
            title="CATEGORIES"
            links={footerCategories}
            isLoading={isCategoriesLoading}
          />
        </div>

        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <div className="flex items-center gap-3">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[15px] gap-6 md:gap-0 mt-[16px] pt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-[26.3px]">
          <div className="flex items-center gap-2 text-white">
            <FaLocationDot className="w-[18px] h-[15px]" />
            <h6 className="uppercase tracking-wider text-[12px] font-normal">UAE</h6>
          </div>
          <h6 className="text-[#7E7E7E] text-[11px]">
            © {currentYear} GetOutThere. All Rights Reserved
          </h6>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 text-[#7E7E7E]">
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors text-[12px]">
            Terms of Use
          </Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors text-[12px]">
            Privacy Policy
          </Link>
        </div>
      </div>

      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </footer>
  )
}