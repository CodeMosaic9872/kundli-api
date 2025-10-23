// @ts-ignore - astronomia doesn't have TypeScript definitions
import { julian, solar, moonposition, planetposition, data, sidereal, sexagesimal as sexa } from 'astronomia';
// @ts-ignore - swisseph doesn't have TypeScript definitions
import * as swisseph from 'swisseph';
import { BirthDetails, AstrologicalData, NakshatraInfo, RashiInfo } from '../types';
import { GeocodingService } from './geocodingService';

export class AstrologyService {
  private static readonly NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  private static readonly RASHIS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  private static readonly NAKSHATRA_LORDS = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
    'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun',
    'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
    'Jupiter', 'Saturn', 'Mercury'
  ];

  private static readonly RASHI_LORDS = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
  ];

  /**
   * Calculate astrological data for a given birth details
   */
  static async calculateAstrologicalData(birthDetails: BirthDetails): Promise<AstrologicalData> {
    try {
      const birthDate = new Date(birthDetails.dateOfBirth);
      const birthTime = new Date(birthDetails.timeOfBirth);
      
      // Combine date and time
      const fullDateTime = new Date(
        birthDate.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate(),
        birthTime.getHours(),
        birthTime.getMinutes(),
        birthTime.getSeconds()
      );

      // Convert to Julian day
      const jd = julian.CalendarGregorianToJD(
        fullDateTime.getFullYear(),
        fullDateTime.getMonth() + 1,
        fullDateTime.getDate(),
        fullDateTime.getHours() + fullDateTime.getMinutes() / 60 + fullDateTime.getSeconds() / 3600
      );

      // Calculate planetary positions using Swiss Ephemeris
      const sunPos = this.getPlanetPositionSwiss(jd, swisseph.SE_SUN);
      const moonPos = this.getPlanetPositionSwiss(jd, swisseph.SE_MOON);
      
      // Calculate other planetary positions using Swiss Ephemeris
      const marsPos = this.getPlanetPositionSwiss(jd, swisseph.SE_MARS);
      const venusPos = this.getPlanetPositionSwiss(jd, swisseph.SE_VENUS);
      const jupiterPos = this.getPlanetPositionSwiss(jd, swisseph.SE_JUPITER);
      const saturnPos = this.getPlanetPositionSwiss(jd, swisseph.SE_SATURN);
      const mercuryPos = this.getPlanetPositionSwiss(jd, swisseph.SE_MERCURY);
      
      // Calculate Rahu and Ketu (Lunar nodes) using Swiss Ephemeris
      const { rahu, ketu } = this.calculateLunarNodesSwiss(jd);

      // Calculate Nakshatra
      const nakshatra = this.getNakshatra(moonPos);
      
      // Calculate Rashi (Moon sign)
      const rashi = this.getRashi(moonPos);

      // Get coordinates from place name if not provided
      let latitude = birthDetails.latitude;
      let longitude = birthDetails.longitude;
      
      if (!latitude || !longitude) {
        const coordinates = await GeocodingService.getCoordinatesCached(
          birthDetails.placeOfBirth,
          birthDetails.city,
          birthDetails.state,
          birthDetails.country
        );
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }

      // Calculate Ascendant using Swiss Ephemeris
      const ascendant = this.calculateAscendantSwiss(jd, latitude, longitude);

      // Calculate house cusps
      const houseCusps = this.calculateHouseCusps(jd, latitude, longitude);

      return {
        nakshatra,
        rashi,
        longitude: longitude,
        latitude: latitude,
        ascendant,
        sunPosition: sunPos,
        moonPosition: moonPos,
        marsPosition: marsPos,
        venusPosition: venusPos,
        jupiterPosition: jupiterPos,
        saturnPosition: saturnPos,
        mercuryPosition: mercuryPos,
        ketuPosition: ketu,
        rahuPosition: rahu,
        houseCusps
      };
    } catch (error) {
      throw new Error(`Astrological calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Nakshatra information including lord, gana, yoni, etc.
   */
  static getNakshatraInfo(nakshatraName: string): NakshatraInfo {
    const index = this.NAKSHATRAS.indexOf(nakshatraName);
    if (index === -1) {
      throw new Error(`Invalid nakshatra: ${nakshatraName}`);
    }

    return {
      name: nakshatraName,
      lord: this.NAKSHATRA_LORDS[index] || 'Unknown',
      gana: this.getGana(index),
      yoni: this.getYoni(index),
      nadi: this.getNadi(index),
      varna: this.getVarna(index),
      vashya: this.getVashya(index)
    };
  }

  /**
   * Get Rashi information
   */
  static getRashiInfo(rashiName: string): RashiInfo {
    const index = this.RASHIS.indexOf(rashiName);
    if (index === -1) {
      throw new Error(`Invalid rashi: ${rashiName}`);
    }

    return {
      name: rashiName,
      element: this.getElement(index),
      quality: this.getQuality(index),
      lord: this.RASHI_LORDS[index] || 'Unknown',
      sign: index + 1
    };
  }

  /**
   * Check if a person is Manglik (Mars in certain signs)
   */
  static isManglik(astrologicalData: AstrologicalData): boolean {
    const marsSign = this.getRashi(astrologicalData.marsPosition);
    const manglikSigns = ['Aries', 'Scorpio', 'Leo', 'Sagittarius', 'Capricorn'];
    return manglikSigns.includes(marsSign);
  }

  // Private helper methods using Swiss Ephemeris
  private static getPlanetPositionSwiss(jd: number, planetId: number): number {
    try {
      const result = swisseph.swe_calc_ut(jd, planetId, swisseph.SEFLG_SWIEPH);
      // Check if result has longitude property (ecliptic coordinates)
      if ('longitude' in result) {
        return result.longitude;
      }
      return 0;
    } catch (error) {
      console.warn(`Error calculating planet position: ${error}`);
      return 0;
    }
  }

  private static calculateLunarNodesSwiss(jd: number): { rahu: number; ketu: number } {
    try {
      const rahuResult = swisseph.swe_calc_ut(jd, swisseph.SE_TRUE_NODE, swisseph.SEFLG_SWIEPH);
      if ('longitude' in rahuResult) {
        const ketu = (rahuResult.longitude + 180) % 360; // Ketu is 180 degrees from Rahu
        return {
          rahu: rahuResult.longitude,
          ketu: ketu
        };
      }
      return { rahu: 0, ketu: 0 };
    } catch (error) {
      console.warn(`Error calculating lunar nodes: ${error}`);
      return {
        rahu: 0,
        ketu: 0
      };
    }
  }

  private static getNakshatra(moonLongitude: number): string {
    const nakshatraIndex = Math.floor(moonLongitude / 13.333333);
    return this.NAKSHATRAS[nakshatraIndex % 27] || 'Unknown';
  }

  private static getRashi(longitude: number): string {
    const rashiIndex = Math.floor(longitude / 30);
    return this.RASHIS[rashiIndex % 12] || 'Unknown';
  }

  private static calculateAscendantSwiss(jd: number, latitude: number, longitude: number): number {
    try {
      // Calculate houses using Placidus system
      const houses = swisseph.swe_houses(jd, latitude, longitude, 'P');
      
      // Check if result has ascendant property
      if ('ascendant' in houses) {
        return houses.ascendant;
      }
      return 0;
    } catch (error) {
      console.warn(`Error calculating ascendant: ${error}`);
      return 0;
    }
  }

  private static calculateHouseCusps(jd: number, latitude: number, longitude: number): number[] {
    try {
      // Calculate houses using Placidus system
      const houses = swisseph.swe_houses(jd, latitude, longitude, 'P');
      
      // Check if result has required properties
      if ('ascendant' in houses && 'house' in houses && Array.isArray(houses.house)) {
        // Return all 12 house cusps with null checks
        return [
          houses.ascendant,    // 1st house
          houses.house[1] || 0,     // 2nd house
          houses.house[2] || 0,     // 3rd house
          houses.house[3] || 0,     // 4th house (IC)
          houses.house[4] || 0,     // 5th house
          houses.house[5] || 0,     // 6th house
          houses.house[6] || 0,     // 7th house (Descendant)
          houses.house[7] || 0,     // 8th house
          houses.house[8] || 0,     // 9th house
          houses.house[9] || 0,     // 10th house (MC)
          houses.house[10] || 0,    // 11th house
          houses.house[11] || 0      // 12th house
        ];
      }
      return new Array(12).fill(0);
    } catch (error) {
      console.warn(`Error calculating house cusps: ${error}`);
      return new Array(12).fill(0);
    }
  }

  private static getGana(nakshatraIndex: number): string {
    const ganas = ['Deva', 'Manushya', 'Rakshasa'];
    return ganas[nakshatraIndex % 3] || 'Unknown';
  }

  private static getYoni(nakshatraIndex: number): string {
    const yonis = ['Horse', 'Elephant', 'Sheep', 'Snake', 'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Lion', 'Crow'];
    return yonis[nakshatraIndex % 14] || 'Unknown';
  }

  private static getNadi(nakshatraIndex: number): string {
    const nadis = ['Adi', 'Madhya', 'Antya'];
    return nadis[nakshatraIndex % 3] || 'Unknown';
  }

  private static getVarna(nakshatraIndex: number): string {
    const varnas = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra'];
    return varnas[nakshatraIndex % 4] || 'Unknown';
  }

  private static getVashya(nakshatraIndex: number): string {
    const vashyas = ['Chatushpada', 'Dvipada', 'Jalachara', 'Keeta', 'Vanachara'];
    return vashyas[nakshatraIndex % 5] || 'Unknown';
  }

  private static getElement(rashiIndex: number): string {
    const elements = ['Fire', 'Earth', 'Air', 'Water'];
    return elements[rashiIndex % 4] || 'Unknown';
  }

  private static getQuality(rashiIndex: number): string {
    const qualities = ['Cardinal', 'Fixed', 'Mutable'];
    return qualities[rashiIndex % 3] || 'Unknown';
  }
}
