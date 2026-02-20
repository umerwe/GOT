"use client"

import Image, { ImageProps } from "next/image"
import { useState, useCallback } from "react"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface MyImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
    wrapperClassName?: string
    loaderClassName?: string
    disableLoader?: boolean
}

export default function MyImage({
    src,
    alt,
    className,
    wrapperClassName,
    loaderClassName,
    disableLoader = false,
    fill,
    width,
    height,
    ...rest
}: MyImageProps) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const handleLoad = useCallback(() => setLoading(false), [])
    const handleError = useCallback(() => {
        setError(true)
        setLoading(false)
    }, [])

    return (
        <div className={cn("relative overflow-hidden w-full h-full bg-gray-100", wrapperClassName)}>
            {/* Shimmer loader */}
            {!disableLoader && loading && !error && (
                <div
                    className={cn(
                        "absolute inset-0 z-10 animate-pulse bg-gray-200",
                        loaderClassName
                    )}
                />
            )}

            {error || !src ? (
                <div
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full text-gray-400 gap-2",
                        className
                    )}
                >
                    <ImageOff className="h-5 w-5" strokeWidth={1.2} />
                </div>
            ) : (
                <Image
                    {...rest}
                    src={src}
                    alt={alt}
                    fill={fill}
                    width={!fill ? width : undefined}
                    height={!fill ? height : undefined}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        "transition-opacity duration-300 object-cover",
                        loading ? "opacity-0" : "opacity-100",
                        className
                    )}
                />
            )}
        </div>
    )
}