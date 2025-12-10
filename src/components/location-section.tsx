"use client"
import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import GoogleMapsLoader from "@/utils/googleMapsLoader"
import { toast } from "./ui/toast"

interface LocationSectionProps {
  product_data: {
    lat: string
    lng: string
    address: string
  }
}

export default function LocationSection({ product_data }: LocationSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markerInstance = useRef<google.maps.Marker | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false)

  const mapsLoader = GoogleMapsLoader.getInstance()

  // Memoized map initializer (so useEffect can safely depend on it)
  const initializeMap = useCallback((): void => {
    if (
      !mapRef.current ||
      !mapsLoader.isApiLoaded() ||
      isNaN(Number.parseFloat(product_data.lat)) ||
      isNaN(Number.parseFloat(product_data.lng))
    ) {
      return
    }

    const latitude = Number.parseFloat(product_data.lat)
    const longitude = Number.parseFloat(product_data.lng)

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
      })

      markerInstance.current = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: mapInstance.current,
        label: "P",
      })
    } else {
      mapInstance.current.setCenter({ lat: latitude, lng: longitude })
      markerInstance.current?.setPosition({ lat: latitude, lng: longitude })
    }
  }, [mapsLoader, product_data.lat, product_data.lng])

  // Initialize Google Maps API
  useEffect(() => {
    const setupMap = async () => {
      try {
        await mapsLoader.load()
        setIsMapLoaded(true)
      } catch {
        toast({
          title: "Failed to load Google Maps",
          variant: "destructive",
        });
      }
    }
    setupMap()
  }, [mapsLoader])

  // Initialize map when API is loaded and coords change
  useEffect(() => {
    if (isMapLoaded) {
      if (mapsLoader.isApiLoaded()) {
        initializeMap()
      } else {
        mapsLoader.onLoad(initializeMap)
      }
    }
  }, [isMapLoaded, mapsLoader, initializeMap])

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current = null
      }
      if (markerInstance.current) {
        markerInstance.current.setMap(null)
        markerInstance.current = null
      }
    }
  }, [])

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Location</h2>
      <p className="text-sm text-gray-600">{product_data.address}</p>
      <div className="relative h-44 w-full overflow-hidden rounded-lg border bg-gray-100">
        <div ref={mapRef} className="h-full w-full" />
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-500">Loading map...</div>
          </div>
        )}
        <Link
          href={`https://www.google.com/maps?q=${product_data.lat},${product_data.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs font-medium rounded shadow-md hover:bg-gray-100"
        >
          Open in Google Maps
        </Link>
      </div>
    </section>
  )
}
