import React from 'react'
import Link from 'next/link'
import MyImage from '@/components/custom/MyImage'
import { SpinnerLoader } from '@/common/loader'

interface LogoProps {
    logo: string;
    className?: string;
    navigate?: boolean
}

const Logo = ({ logo, className, navigate = true }: LogoProps) => {
    return (
        <Link href={navigate ? "/" : "/business-management/verification"} className={`relative flex items-center justify-center w-[100px] h-[94px] md:w-[144px] md:h-[134px] ${className}`}>
            {logo ? (
                <MyImage
                    src={logo}
                    alt="logo"
                    fill
                    className="object-contain -rotate-12"
                />
            ) : <SpinnerLoader />}
        </Link>
    )
}

export default Logo