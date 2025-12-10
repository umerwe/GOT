import { PostAdFormData } from "@/validations/ads"
import { useEffect, useRef, useState, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { Search } from "lucide-react"
import { toast } from "./toast"
import GoogleMapsLoader from "@/utils/googleMapsLoader"

interface PlaceAutocompleteElement extends HTMLElement {
  place?: google.maps.places.PlaceResult
}

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
  const [location, setLocation] = useState<string>("")
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMapReady, setIsMapReady] = useState<boolean>(false)

  const autocompleteRef = useRef<PlaceAutocompleteElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const mapInstance = useRef<google.maps.Map | null>(null)
  const markerInstance = useRef<google.maps.Marker | null>(null)

  const mapsLoader = GoogleMapsLoader.getInstance()

  // Keep form values synced
  useEffect(() => {
    setValue("address", location)
    setValue("lat", lat !== null ? lat.toString() : "")
    setValue("lng", lng !== null ? lng.toString() : "")
  }, [location, lat, lng, setValue])

  // Initialize Google Maps API
  useEffect(() => {
    const initializeMaps = async () => {
      try {
        await mapsLoader.load()
        setIsMapReady(true)
      } catch {
        console.error("Failed to load Google Maps")
      }
    }
    initializeMaps()
  }, [mapsLoader])

  // Update map & marker
  const updateMap = useCallback(
    (latitude: number, longitude: number) => {
      if (!mapRef.current || !mapsLoader.isApiLoaded()) return

      if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 14,
        })

        markerInstance.current = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance.current,
        })
      } else {
        mapInstance.current.setCenter({ lat: latitude, lng: longitude })
        markerInstance.current?.setPosition({ lat: latitude, lng: longitude })
      }
    },
    [mapsLoader]
  )

  // Setup Google Autocomplete
  useEffect(() => {
    if (!isMapReady || !inputRef.current || autocompleteRef.current) return

    const setupAutocomplete = () => {
      if (typeof window.google === "undefined") return

      const autocompleteContainer = document.createElement("place-autocomplete-element")
      autocompleteContainer.setAttribute("types", '["geocode"]')
      inputRef.current!.parentElement?.insertBefore(autocompleteContainer, inputRef.current)
      autocompleteContainer.appendChild(inputRef.current!)

      autocompleteRef.current = autocompleteContainer as PlaceAutocompleteElement

      autocompleteRef.current.addEventListener("place-changed", () => {
        const place = autocompleteRef.current?.place
        if (place?.geometry?.location) {
          const newLat = place.geometry.location.lat()
          const newLng = place.geometry.location.lng()
          setLocation(place.formatted_address ?? "")
          setLat(newLat)
          setLng(newLng)
          updateMap(newLat, newLng)
        }
      })
    }

    if (mapsLoader.isApiLoaded()) {
      setupAutocomplete()
    } else {
      mapsLoader.onLoad(setupAutocomplete)
    }
  }, [isMapReady, mapsLoader, updateMap])

  // Manual search
  const handleManualSearch = async (searchLocation: string) => {
    if (!searchLocation.trim()) return
    setIsLoading(true)

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchLocation
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`
      )
      const data = await response.json()

      if (data.results && data.results[0]) {
        const result = data.results[0]
        const newLat = result.geometry.location.lat
        const newLng = result.geometry.location.lng

        setLocation(result.formatted_address)
        setLat(newLat)
        setLng(newLng)
        updateMap(newLat, newLng)

        if (inputRef.current) {
          inputRef.current.value = result.formatted_address
        }
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different search term.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Search failed",
        description: "Error searching location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchClick = () => {
    const searchValue = inputRef.current?.value || location
    if (searchValue) {
      handleManualSearch(searchValue)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearchClick()
    }
  }

  // Use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support location access.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentLat = position.coords.latitude
        const currentLng = position.coords.longitude

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLat},${currentLng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`
          )
          const data = await response.json()

          if (data.results[0]) {
            const address = data.results[0].formatted_address || ""
            setLocation(address)
            setLat(currentLat)
            setLng(currentLng)

            if (inputRef.current) {
              inputRef.current.value = address
            }
            updateMap(currentLat, currentLng)
          }
        } catch {
          toast({
            title: "Error getting address",
            description: "We could not fetch your address. Using coordinates instead.",
            variant: "destructive",
          })
          setLat(currentLat)
          setLng(currentLng)
          updateMap(currentLat, currentLng)
        } finally {
          setIsLoading(false)
        }
      },
      () => {
        setIsLoading(false)
        toast({
          title: "Location error",
          description: "Could not get your current location.",
          variant: "destructive",
        })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  return (
    <>
      <div className="relative">
        <Label htmlFor="address">Address</Label>

        {/* Input + Button container */}
        <div className="relative">
          <input
            id="address"
            ref={inputRef}
            type="text"
            placeholder="Enter location"
            className="w-full text-sm py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-solid bg-gray-100 mt-1"
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || isPending}
          />
          <button
            type="button"
            onClick={handleSearchClick}
            disabled={isLoading || isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 pt-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            ) : (
              <Search className="w-4.5 h-4.5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Error below input */}
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      <div ref={mapRef} className="w-full h-64 rounded border bg-gray-100 mt-4">
        {!isMapReady && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading map...
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLoading || isPending}
        className="w-full bg-solid text-black p-2 rounded hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
            Getting Location...
          </>
        ) : (
          <>Use Current Location</>
        )}
      </button>
    </>
  )
}
