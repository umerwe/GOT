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
        <Link href={navigate ? "/" : "/business-management/verification"} className={`relative flex items-center justify-center w-[120px] h-[74px] md:w-[200px] md:h-[104px] ${className}`}>
            {logo ? (
                <MyImage
                    src={logo}
                    alt="logo"
                    width={256}
                    height={256}
                    className="object-contain"
                />
            ) : <SpinnerLoader />}
        </Link>
    )
}

export default Logo