"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import GoogleMapsLoader from "@/utils/googleMapsLoader";
import { BusinessDetailsValues } from "@/validations/business";
import { toast } from "./ui/toast";

interface LocationInputProps {
  // Using 'any' here to allow this to work for both Registration and Profile forms
  setValue: (name: any, value: any, options?: any) => void;
  errors: any;
  isPending: boolean;
}

export function BusinessLocationInput({ setValue, errors, isPending }: LocationInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  const mapsLoader = GoogleMapsLoader.getInstance();

  // Load Google Maps API
  useEffect(() => {
    const init = async () => {
      try {
        await mapsLoader.load();
        setIsMapReady(true);
      } catch (err) {
        console.error("Map load error:", err);
      }
    };
    init();
  }, [mapsLoader]);

  const updateMap = useCallback((latitude: number, longitude: number, address: string) => {
    if (!mapRef.current || !window.google) return;

    // Update Form State and trigger validation to clear errors
    setValue("address", address, { shouldValidate: true });
    setValue("latitude", latitude);
    setValue("longitude", longitude);

    const coords = { lat: latitude, lng: longitude };

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 15,
      });
      markerInstance.current = new window.google.maps.Marker({
        position: coords,
        map: mapInstance.current,
        draggable: true
      });

      // Handle marker drag to update address
      markerInstance.current.addListener("dragend", async () => {
        const newPos = markerInstance.current?.getPosition();
        if (newPos) {
          handleReverseGeocode(newPos.lat(), newPos.lng());
        }
      });
    } else {
      mapInstance.current.setCenter(coords);
      markerInstance.current?.setPosition(coords);
    }
  }, [setValue]);

  // Setup Autocomplete
  useEffect(() => {
    if (!isMapReady || !inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      fields: ["formatted_address", "geometry"], // Optimized fields
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || "";

        // CRITICAL FIX: Manually update the input display value
        if (inputRef.current) {
          inputRef.current.value = address;
        }

        updateMap(lat, lng, address);
      }
    });

    // Prevent form submission when pressing Enter on a suggestion
    const preventSubmit = (e: KeyboardEvent) => {
        if (e.key === "Enter") e.preventDefault();
    };
    inputRef.current.addEventListener("keydown", preventSubmit);

    return () => {
        if (inputRef.current) {
            inputRef.current.removeEventListener("keydown", preventSubmit);
        }
        window.google?.maps?.event?.clearInstanceListeners(autocomplete);
    };
  }, [isMapReady, updateMap]);

  const handleReverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`);
      const data = await res.json();
      if (data.results[0]) {
        const addr = data.results[0].formatted_address;
        
        // Update input UI
        if (inputRef.current) {
          inputRef.current.value = addr;
        }
        
        updateMap(lat, lng, addr);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to get address", variant: "destructive" });
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
        toast({ title: "Not Supported", description: "Geolocation is not supported by your browser." });
        return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleReverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        toast({ title: "Location Error", description: "Could not access your location." });
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4">
      <div className="w-full">
        <Label htmlFor="address">Business Address</Label>
        <div className="relative mt-1">
          <input
            id="address"
            ref={inputRef}
            type="text"
            placeholder="Search business location"
            disabled={isPending}
            autoComplete="off"
            className="flex h-[48px] w-full border-[#C7CBD2] border-[2px] bg-white pl-3 pr-12 text-sm outline-none focus:border-gray-500 disabled:opacity-50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
      </div>

      <div 
        ref={mapRef} 
        className="w-full h-[300px] border border-gray-200 bg-gray-50 rounded-md overflow-hidden" 
      />

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLoading || isPending}
        className="w-full bg-black text-white h-[48px] text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        ) : null}
        {isLoading ? "Locating..." : "Use Current Location"}
      </button>
    </div>
  );
}