"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image, { ImageProps, StaticImageData } from "next/image";

interface MyImageProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | File | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackText?: string;
}

const LOADED_IMAGE_CACHE = new Set<string>();

const normalizeUrl = (url: string) => {
  return url.replace(/([^:]\/)\/+/g, "$1");
};

const MyImage = ({
  src,
  alt,
  className,
  fallbackSrc = "/fallback.png",
  fallbackText,
  fill,
  ...rest
}: MyImageProps) => {
  const resolvedSrc = typeof src === "string" ? normalizeUrl(src) : src;
  const srcKey = typeof resolvedSrc === "string" ? resolvedSrc : "";

  const isAlreadyLoaded = srcKey ? LOADED_IMAGE_CACHE.has(srcKey) : false;

  const [isLoading, setIsLoading] = useState(!isAlreadyLoaded);
  const [isError, setIsError] = useState(!src);

  useEffect(() => {
    if (srcKey && LOADED_IMAGE_CACHE.has(srcKey)) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    setIsError(!src);
  }, [srcKey, src]);

  if (isError || !resolvedSrc) {
    return (
      <div className={cn("flex items-center justify-center bg-gray-100 text-gray-400 font-medium", className)}>
        {fallbackText || "Image not available"}
      </div>
    );
  }

  return (
    <>
      {/* PROFESSIONAL SHIMMER LOADER */}
      {isLoading && (
        <div 
          className={cn(
            "animate-shimmer bg-gray-200", 
            fill ? "absolute inset-0 w-full h-full z-10" : "w-full h-full",
            className
          )} 
        />
      )}
      
      <Image
        src={resolvedSrc as string}
        alt={alt}
        fill={fill}
        className={cn(
          "object-cover",
          !isAlreadyLoaded && "transition-opacity duration-500 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoadingComplete={() => {
          if (srcKey) LOADED_IMAGE_CACHE.add(srcKey);
          setIsLoading(false);
        }}
        onError={() => {
          setIsError(true);
          setIsLoading(false);
        }}
        {...rest}
      />
    </>
  );
};

export default MyImage;