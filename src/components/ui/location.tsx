"use client"

import { PostAdFormData } from "@/validations/ads"
import { useEffect, useRef, useState, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { useForm, UseFormSetValue } from "react-hook-form"
import { MapPin } from "lucide-react"
import { toast } from "./toast"
import GoogleMapsLoader from "@/utils/googleMapsLoader"

type SetValueType = UseFormSetValue<PostAdFormData>

export function LocationInput({
  setValue,
  errors,
  isPending,
  initialAddress,
  initialLat,
  initialLng,
}: {
  setValue: SetValueType
  register: ReturnType<typeof useForm<PostAdFormData>>["register"]
  errors: ReturnType<typeof useForm<PostAdFormData>>["formState"]["errors"]
  isPending: boolean
  initialAddress?: string
  initialLat?: string | number
  initialLng?: string | number
}) {
  const [lat, setLat] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markerInstance = useRef<google.maps.Marker | null>(null)  // ✅ fixed: Marker not marker

  const mapsLoader = GoogleMapsLoader.getInstance()

  const handleReverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`
      )
      const data = await res.json()

      if (data.status === "OK" && data.results.length > 0) {
        const specificResult = data.results.find((result: google.maps.GeocoderResult) =>
          result.types.includes("street_address") ||
          result.types.includes("route") ||
          result.types.includes("premise")
        ) || data.results[0]

        const address = specificResult.formatted_address

        if (inputRef.current) inputRef.current.value = address

        setValue("address", address, { shouldValidate: true })
        setValue("lat", latitude.toString(), { shouldValidate: true })
        setValue("lng", longitude.toString(), { shouldValidate: true })
        setLat(latitude)

        if (markerInstance.current) markerInstance.current.setPosition({ lat: latitude, lng: longitude })
        if (mapInstance.current) mapInstance.current.panTo({ lat: latitude, lng: longitude })
      } else {
        toast({ title: "Location Error", description: "Could not determine a specific address for this point.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch address", variant: "destructive" })
    }
  }, [setValue])

  const initOrUpdateMap = useCallback((latitude: number, longitude: number) => {
    if (!mapRef.current || !window.google) return

    const coords: google.maps.LatLngLiteral = { lat: latitude, lng: longitude }

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 15,
        disableDefaultUI: false,
      })

      markerInstance.current = new window.google.maps.Marker({
        position: coords,
        map: mapInstance.current,
      })

      mapInstance.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) handleReverseGeocode(e.latLng.lat(), e.latLng.lng())
      })
    } else {
      mapInstance.current.setCenter(coords)
      markerInstance.current?.setPosition(coords)
    }
  }, [handleReverseGeocode])

  // Load Google Maps
  useEffect(() => {
    const init = async () => {
      try {
        await mapsLoader.load()
        setIsMapReady(true)
      } catch (err) {
        console.error("Map load error:", err)
      }
    }
    init()
  }, [mapsLoader])

  // Apply initial values once map is ready (edit mode)
  useEffect(() => {
    if (!isMapReady || !initialAddress) return

    const parsedLat = initialLat != null ? parseFloat(String(initialLat)) : null
    const parsedLng = initialLng != null ? parseFloat(String(initialLng)) : null

    if (inputRef.current) inputRef.current.value = initialAddress

    setValue("address", initialAddress, { shouldValidate: true })

    if (parsedLat !== null && parsedLng !== null && !isNaN(parsedLat) && !isNaN(parsedLng)) {
      setValue("lat", String(parsedLat), { shouldValidate: true })
      setValue("lng", String(parsedLng), { shouldValidate: true })
      setLat(parsedLat)
      initOrUpdateMap(parsedLat, parsedLng)
    }
  }, [isMapReady, initialAddress, initialLat, initialLng, setValue, initOrUpdateMap])

  // Setup Autocomplete
  useEffect(() => {
    if (!isMapReady || !inputRef.current || !window.google) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      fields: ["formatted_address", "geometry"],
      componentRestrictions: { country: "ae" },
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        const newLat = place.geometry.location.lat()
        const newLng = place.geometry.location.lng()
        const address = place.formatted_address || ""

        if (inputRef.current) inputRef.current.value = address

        setValue("address", address, { shouldValidate: true })
        setValue("lat", newLat.toString(), { shouldValidate: true })
        setValue("lng", newLng.toString(), { shouldValidate: true })
        setLat(newLat)

        initOrUpdateMap(newLat, newLng)
      }
    })

    const preventSubmit = (e: KeyboardEvent) => { if (e.key === "Enter") e.preventDefault() }
    inputRef.current.addEventListener("keydown", preventSubmit)

    return () => {
      if (inputRef.current) inputRef.current.removeEventListener("keydown", preventSubmit)
      window.google?.maps?.event?.clearInstanceListeners(autocomplete)
    }
  }, [isMapReady, initOrUpdateMap, setValue])

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Not Supported", description: "Geolocation not supported.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleReverseGeocode(pos.coords.latitude, pos.coords.longitude)
        initOrUpdateMap(pos.coords.latitude, pos.coords.longitude)
        setIsLoading(false)
      },
      () => {
        setIsLoading(false)
        toast({ title: "Location Error", description: "Could not get location.", variant: "destructive" })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <>
      <div className="w-full">
        <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>

        <div className="relative mt-1">
          <input
            id="address"
            ref={inputRef}
            type="text"
            placeholder="Enter location"
            disabled={isLoading || isPending}
            autoComplete="off"
            className={`flex h-[48px] w-full border-[2px] bg-white pl-3 pr-12 text-sm outline-none transition-all ${
              errors.address ? "border-red-500" : "border-[#C7CBD2]"
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {errors.address && (
          <p className="text-red-500 text-sm mt-1.5">{errors.address.message}</p>
        )}
      </div>

      <div className="w-full mt-4">
        <div className={`w-full h-[346px] border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center gap-2 ${lat !== null ? "hidden" : ""}`}>
          <MapPin className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-500 font-medium">No location selected</p>
          <p className="text-xs text-gray-400">Search for an address or click the map</p>
        </div>

        <div ref={mapRef} className={`w-full h-[346px] border bg-gray-100 ${lat === null ? "hidden" : ""}`} />
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLoading || isPending}
        className="w-full text-sm bg-black text-white h-[48px] font-normal hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2 mt-[18px]"
      >
        {isLoading ? "Getting Location..." : "Use Current Location"}
      </button>
    </>
  )
}