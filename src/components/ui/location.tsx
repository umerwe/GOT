import { PostAdFormData } from "@/validations/ads"
import { useEffect, useRef, useState, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { MapPin, Search } from "lucide-react"
import { toast } from "./toast"
import GoogleMapsLoader from "@/utils/googleMapsLoader"

export function LocationInput({
  setValue,
  errors,
  isPending,
}: {
  setValue: (name: keyof PostAdFormData, value: string) => void
  register: ReturnType<typeof useForm<PostAdFormData>>["register"]
  errors: ReturnType<typeof useForm<PostAdFormData>>["formState"]["errors"]
  isPending: boolean
}) {
  const [lat, setLat] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markerInstance = useRef<google.maps.Marker | null>(null)

  const mapsLoader = GoogleMapsLoader.getInstance()

  // Load Google Maps API
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

  // Update map, marker & form values
  const updateMap = useCallback(
    (latitude: number, longitude: number, address: string) => {
      if (!mapRef.current || !window.google) return

      setValue("address", address)
      setValue("lat", latitude.toString())
      setValue("lng", longitude.toString())
      setLat(latitude)

      const coords = { lat: latitude, lng: longitude }

      if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: coords,
          zoom: 15,
        })
        markerInstance.current = new window.google.maps.Marker({
          position: coords,
          map: mapInstance.current,
          draggable: true,
        })

        // Allow dragging marker to update address
        markerInstance.current.addListener("dragend", () => {
          const newPos = markerInstance.current?.getPosition()
          if (newPos) {
            handleReverseGeocode(newPos.lat(), newPos.lng())
          }
        })
      } else {
        mapInstance.current.setCenter(coords)
        markerInstance.current?.setPosition(coords)
      }
    },
    [setValue]
  )

  // Setup native Google Autocomplete
  useEffect(() => {
    if (!isMapReady || !inputRef.current || !window.google) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      fields: ["formatted_address", "geometry"],
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        const newLat = place.geometry.location.lat()
        const newLng = place.geometry.location.lng()
        const address = place.formatted_address || ""

        if (inputRef.current) inputRef.current.value = address
        updateMap(newLat, newLng, address)
      }
    })

    // Prevent form submit on Enter key inside autocomplete
    const preventSubmit = (e: KeyboardEvent) => {
      if (e.key === "Enter") e.preventDefault()
    }
    inputRef.current.addEventListener("keydown", preventSubmit)

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keydown", preventSubmit)
      }
      window.google?.maps?.event?.clearInstanceListeners(autocomplete)
    }
  }, [isMapReady, updateMap])

  // Reverse geocode lat/lng → address
  const handleReverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`
      )
      const data = await res.json()
      if (data.results[0]) {
        const address = data.results[0].formatted_address
        if (inputRef.current) inputRef.current.value = address
        updateMap(latitude, longitude, address)
      }
    } catch {
      toast({ title: "Error", description: "Failed to get address", variant: "destructive" })
    }
  }

  // Use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleReverseGeocode(pos.coords.latitude, pos.coords.longitude)
        setIsLoading(false)
      },
      (error) => {
        setIsLoading(false)

        let errorTitle = "Location Error"
        let errorDescription = "Could not get your current location."

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorTitle = "Permission Denied"
            errorDescription = "Please enable location access in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorTitle = "Location Unavailable"
            errorDescription = "Location information is unavailable. Ensure GPS is turned on."
            break
          case error.TIMEOUT:
            errorTitle = "Request Timeout"
            errorDescription = "The request to get your location timed out. Please try again."
            break
        }

        toast({ title: errorTitle, description: errorDescription, variant: "destructive" })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  return (
    <>
      <div className="w-full">
        <Label htmlFor="address">Address</Label>

        <div className="relative mt-1">
          <input
            id="address"
            ref={inputRef}
            type="text"
            placeholder="Enter location"
            disabled={isLoading || isPending}
            autoComplete="off"
            className="flex h-[48px] w-full border-[#C7CBD2] border-[2px] bg-white pl-3 pr-12 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:ring-[1px] focus-visible:ring-gray-500 focus-visible:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
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
        {/* Placeholder — always render map div so mapRef is never null */}
        <div
          className={`w-full h-[346px] border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center gap-2 ${
            lat !== null ? "hidden" : ""
          }`}
        >
          <MapPin className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-500 font-medium">No location selected</p>
          <p className="text-xs text-gray-400">Search for an address or use your current location</p>
        </div>

        <div
          ref={mapRef}
          className={`w-full h-[346px] border bg-gray-100 ${lat === null ? "hidden" : ""}`}
        />
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLoading || isPending}
        className="w-full text-sm bg-black text-white h-[48px] font-normal hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-[18px]"
      >
        {isLoading && (
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        )}
        {isLoading ? "Getting Location..." : "Use Current Location"}
      </button>
    </>
  )
}