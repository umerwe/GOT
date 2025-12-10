declare global {
  interface Window {
    google: typeof google & {
      maps: typeof google.maps & {
        places: {
          PlaceResult: google.maps.places.PlaceResult
        }
      }
    }
    initGoogleMaps?: () => void
  }
}


class GoogleMapsLoader {
  private static instance: GoogleMapsLoader
  private isLoaded = false
  private isLoading = false
  private loadPromise: Promise<void> | null = null
  private callbacks: (() => void)[] = []

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader()
    }
    return GoogleMapsLoader.instance
  }

  async load(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve()
    }

    if (this.isLoading && this.loadPromise) {
      return this.loadPromise
    }

    if (typeof window !== "undefined" && window.google?.maps) {
      this.isLoaded = true
      this.notifyCallbacks()
      return Promise.resolve()
    }

    this.isLoading = true
    this.loadPromise = new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Google Maps can only be loaded in the browser"))
        return
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        // Script exists, wait for it to load
        const checkGoogle = () => {
          if (window.google?.maps) {
            this.isLoaded = true
            this.isLoading = false
            this.notifyCallbacks()
            resolve()
          } else {
            setTimeout(checkGoogle, 100)
          }
        }
        checkGoogle()
        return
      }

      // Create global callback
      window.initGoogleMaps = () => {
        this.isLoaded = true
        this.isLoading = false
        this.notifyCallbacks()
        resolve()
      }

      // Create and append script
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places&callback=initGoogleMaps`
      script.async = true
      script.defer = true

      script.onerror = () => {
        this.isLoading = false
        reject(new Error("Failed to load Google Maps API"))
      }

      document.head.appendChild(script)
    })

    return this.loadPromise
  }

  onLoad(callback: () => void): void {
    if (this.isLoaded) {
      callback()
    } else {
      this.callbacks.push(callback)
    }
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach((callback) => callback())
    this.callbacks = []
  }

  isApiLoaded(): boolean {
    return this.isLoaded && typeof window !== "undefined" && !!window.google?.maps
  }
}

export default GoogleMapsLoader
