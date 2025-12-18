import NextLink from "next/link"
import Image from "next/image"
import React from "react"

type BrandProps = {
    logo?: string
}

const Logo = ({ logo }: BrandProps) => {
    return (
        <div className="flex items-center gap-3 text-base sm:text-xl font-semibold flex-shrink-0">
            <NextLink
                href="/"
                className="relative flex items-center justify-center"
            >
                {logo ? (
                    <Image
                        src={logo}
                        width={256}
                        height={256}
                        alt="logo-img"
                        className="object-contain -rotate-12 w-[93px] h-[87px]"
                    />
                ) : (
                    <div className="w-[80px] h-[87px] bg-gray-200 animate-pulse rounded" />
                )}
            </NextLink>
        </div>
    )
}

export default Logo
