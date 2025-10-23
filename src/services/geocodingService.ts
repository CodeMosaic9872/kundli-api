import axios from 'axios';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class GeocodingService {
  /**
   * Get coordinates for a place name using OpenStreetMap Nominatim API
   */
  static async getCoordinates(placeName: string, city?: string, state?: string, country?: string): Promise<Coordinates> {
    try {
      // Default coordinates for major cities if geocoding fails
      const defaultCoordinates: { [key: string]: Coordinates } = {
        // Indian cities
        'amritsar': { latitude: 31.6330, longitude: 74.8723 },
        'mumbai': { latitude: 19.0760, longitude: 72.8777 },
        'delhi': { latitude: 28.7041, longitude: 77.1025 },
        'bangalore': { latitude: 12.9716, longitude: 77.5946 },
        'chennai': { latitude: 13.0827, longitude: 80.2707 },
        'kolkata': { latitude: 22.5726, longitude: 88.3639 },
        'hyderabad': { latitude: 17.3850, longitude: 78.4867 },
        'pune': { latitude: 18.5204, longitude: 73.8567 },
        'ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
        'jaipur': { latitude: 26.9124, longitude: 75.7873 },
        'lucknow': { latitude: 26.8467, longitude: 80.9462 },
        'kanpur': { latitude: 26.4499, longitude: 80.3319 },
        'nagpur': { latitude: 21.1458, longitude: 79.0882 },
        'indore': { latitude: 22.7196, longitude: 75.8577 },
        'bhopal': { latitude: 23.2599, longitude: 77.4126 },
        'visakhapatnam': { latitude: 17.6868, longitude: 83.2185 },
        'patna': { latitude: 25.5941, longitude: 85.1376 },
        'vadodara': { latitude: 22.3072, longitude: 73.1812 },
        'ludhiana': { latitude: 30.9010, longitude: 75.8573 },
        'agra': { latitude: 27.1767, longitude: 78.0081 },
        'nashik': { latitude: 19.9975, longitude: 73.7898 },
        'faridabad': { latitude: 28.4089, longitude: 77.3178 },
        'meerut': { latitude: 28.9845, longitude: 77.7064 },
        'rajkot': { latitude: 22.3039, longitude: 70.8022 },
        'kalyan': { latitude: 19.2433, longitude: 73.1305 },
        'vasai': { latitude: 19.4083, longitude: 72.8083 },
        'varanasi': { latitude: 25.3176, longitude: 82.9739 },
        'srinagar': { latitude: 34.0837, longitude: 74.7973 },
        'aurangabad': { latitude: 19.8762, longitude: 75.3433 },
        'dhanbad': { latitude: 23.7957, longitude: 86.4304 },
        'amravati': { latitude: 20.9374, longitude: 77.7796 },
        'kolhapur': { latitude: 16.7050, longitude: 74.2433 },
        'sangli': { latitude: 16.8524, longitude: 74.5815 },
        'malegaon': { latitude: 20.5598, longitude: 74.5259 },
        'ulhasnagar': { latitude: 19.2215, longitude: 73.1645 },
        'jalgaon': { latitude: 21.0077, longitude: 75.5626 },
        'akola': { latitude: 20.7006, longitude: 77.0082 },
        'latur': { latitude: 18.4088, longitude: 76.5604 },
        'ahmadnagar': { latitude: 19.0952, longitude: 74.7496 },
        'dhule': { latitude: 20.9028, longitude: 74.7774 },
        'ichalkaranji': { latitude: 16.6959, longitude: 74.4602 },
        'parbhani': { latitude: 19.2460, longitude: 76.4408 },
        'jalna': { latitude: 19.8410, longitude: 75.8864 },
        'bhusawal': { latitude: 21.0436, longitude: 75.7851 },
        'panvel': { latitude: 18.9881, longitude: 73.1101 },
        'satara': { latitude: 17.6805, longitude: 74.0183 },
        'beed': { latitude: 18.9894, longitude: 75.7564 },
        'yavatmal': { latitude: 20.3932, longitude: 78.1320 },
        'kamptee': { latitude: 21.2333, longitude: 79.2000 },
        'gondia': { latitude: 21.4602, longitude: 80.1920 },
        'bhiwandi': { latitude: 19.3002, longitude: 73.0589 },
        'chandrapur': { latitude: 19.9615, longitude: 79.2961 },
        'barshi': { latitude: 18.2348, longitude: 75.6927 },
        'achalpur': { latitude: 21.2567, longitude: 77.5106 },
        'osmanabad': { latitude: 18.1841, longitude: 76.0416 },
        'nandurbar': { latitude: 21.3707, longitude: 74.2401 },
        'wardha': { latitude: 20.7453, longitude: 78.6022 },
        'udgir': { latitude: 18.3956, longitude: 77.1178 },
        'hinganghat': { latitude: 20.5500, longitude: 78.8333 },
        'washim': { latitude: 20.1000, longitude: 77.1333 },
        'amalner': { latitude: 20.9333, longitude: 75.1667 },
        'akot': { latitude: 21.1000, longitude: 77.0667 },
        'sakri': { latitude: 20.9833, longitude: 74.3167 },
        'muktainagar': { latitude: 20.9000, longitude: 75.1167 },
        // International cities
        'new york': { latitude: 40.7128, longitude: -74.0060 },
        'los angeles': { latitude: 34.0522, longitude: -118.2437 },
        'london': { latitude: 51.5074, longitude: -0.1278 },
        'paris': { latitude: 48.8566, longitude: 2.3522 },
        'tokyo': { latitude: 35.6762, longitude: 139.6503 },
        'sydney': { latitude: -33.8688, longitude: 151.2093 },
        'toronto': { latitude: 43.6532, longitude: -79.3832 }
      };

      // Check if we have default coordinates for this place
      const placeParts = placeName.toLowerCase().split(',');
      const placeKey = placeParts[0] ? placeParts[0].trim() : '';
      
      // Also check city if provided
      const cityKey = city ? city.toLowerCase().trim() : '';
      
      if (placeKey && defaultCoordinates[placeKey]) {
        return defaultCoordinates[placeKey];
      }
      
      if (cityKey && defaultCoordinates[cityKey]) {
        return defaultCoordinates[cityKey];
      }

      // Use OpenStreetMap Nominatim API for geocoding
      const searchQuery = city && state && country 
        ? `${city}, ${state}, ${country}`
        : placeName;
        
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchQuery,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'Kundli-API/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        if (result && result.lat && result.lon) {
          return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon)
          };
        }
      }

      // Fallback to default coordinates
      return { latitude: 0, longitude: 0 };
    } catch (error) {
      console.warn(`Geocoding failed for ${placeName}:`, error);
      return { latitude: 0, longitude: 0 };
    }
  }

  /**
   * Get coordinates with caching to avoid repeated API calls
   */
  private static coordinateCache: { [key: string]: Coordinates } = {};

  static async getCoordinatesCached(placeName: string, city?: string, state?: string, country?: string): Promise<Coordinates> {
    const cacheKey = `${placeName}-${city}-${state}-${country}`.toLowerCase();
    
    if (this.coordinateCache[cacheKey]) {
      return this.coordinateCache[cacheKey];
    }

    const coordinates = await this.getCoordinates(placeName, city, state, country);
    this.coordinateCache[cacheKey] = coordinates;
    return coordinates;
  }
}
