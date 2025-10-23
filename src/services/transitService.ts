import { AstrologicalData, PlanetaryTransit } from '../types';
import * as swisseph from 'swisseph';

export class TransitService {
  private static readonly TRANSIT_PLANETS = [
    'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'
  ];

  private static readonly PLANET_INFLUENCES = {
    'Sun': {
      positive: 'Leadership, confidence, recognition, vitality',
      negative: 'Ego conflicts, authority issues, health problems',
      neutral: 'General energy and vitality'
    },
    'Moon': {
      positive: 'Emotional harmony, intuition, nurturing',
      negative: 'Mood swings, emotional instability, family issues',
      neutral: 'Emotional patterns and habits'
    },
    'Mars': {
      positive: 'Energy, courage, action, passion',
      negative: 'Aggression, conflicts, accidents, impatience',
      neutral: 'Physical energy and drive'
    },
    'Mercury': {
      positive: 'Communication, learning, business success',
      negative: 'Miscommunication, nervousness, technical issues',
      neutral: 'Mental activity and communication'
    },
    'Jupiter': {
      positive: 'Expansion, wisdom, opportunities, growth',
      negative: 'Overconfidence, excess, legal issues',
      neutral: 'Philosophical and spiritual growth'
    },
    'Venus': {
      positive: 'Love, beauty, harmony, relationships',
      negative: 'Relationship issues, financial problems, indulgence',
      neutral: 'Aesthetic and relationship matters'
    },
    'Saturn': {
      positive: 'Discipline, hard work, long-term success',
      negative: 'Restrictions, delays, depression, limitations',
      neutral: 'Karma and life lessons'
    }
  };

  /**
   * Calculate current planetary transits for a person
   */
  static calculateCurrentTransits(astrologicalData: AstrologicalData, currentDate: Date = new Date()): PlanetaryTransit[] {
    try {
      const transits: PlanetaryTransit[] = [];
      
      // Calculate current planetary positions
      const currentPositions = this.getCurrentPlanetaryPositions(currentDate);
      
      // Calculate house positions for each planet
      const houseCusps = astrologicalData.houseCusps;
      
      for (const planet of this.TRANSIT_PLANETS) {
        const planetPosition = currentPositions[planet];
        if (planetPosition !== undefined) {
          const currentSign = this.getSignFromLongitude(planetPosition);
          const currentHouse = this.getHouseFromLongitude(planetPosition, houseCusps);
          const influence = this.calculatePlanetaryInfluence(planet, currentSign, currentHouse);
          
          transits.push({
            planet,
            currentSign,
            currentHouse,
            description: this.getTransitDescription(planet, currentSign, currentHouse),
            influence: influence.type,
            intensity: influence.intensity
          });
        }
      }
      
      return transits;
    } catch (error) {
      throw new Error(`Transit calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate mutual transit influence between two persons
   */
  static calculateMutualTransitInfluence(
    personATransits: PlanetaryTransit[],
    personBTransits: PlanetaryTransit[]
  ): { mutualInfluence: string; recommendations: string[] } {
    const recommendations: string[] = [];
    let overallInfluence = 'Neutral';
    
    // Analyze mutual planetary influences
    for (const transitA of personATransits) {
      for (const transitB of personBTransits) {
        if (transitA.planet === transitB.planet) {
          const mutualInfluence = this.analyzeMutualPlanetaryInfluence(transitA, transitB);
          if (mutualInfluence.recommendation) {
            recommendations.push(mutualInfluence.recommendation);
          }
          if (mutualInfluence.influence === 'Positive') {
            overallInfluence = 'Positive';
          } else if (mutualInfluence.influence === 'Negative' && overallInfluence !== 'Positive') {
            overallInfluence = 'Negative';
          }
        }
      }
    }
    
    // Add general recommendations based on overall influence
    if (overallInfluence === 'Positive') {
      recommendations.push('🌟 This is an excellent time for relationship development and major commitments.');
    } else if (overallInfluence === 'Negative') {
      recommendations.push('⚠️ This period may require extra patience and understanding in the relationship.');
    } else {
      recommendations.push('⚖️ This is a neutral period for relationship development with mixed influences.');
    }
    
    return {
      mutualInfluence: overallInfluence,
      recommendations
    };
  }

  private static getCurrentPlanetaryPositions(currentDate: Date): Record<string, number> {
    const positions: Record<string, number> = {};
    
    try {
      // Convert current date to Julian day
      const jd = this.dateToJulianDay(currentDate);
      
      // Calculate positions for each planet
      const planetIds = {
        'Sun': swisseph.SE_SUN,
        'Moon': swisseph.SE_MOON,
        'Mars': swisseph.SE_MARS,
        'Mercury': swisseph.SE_MERCURY,
        'Jupiter': swisseph.SE_JUPITER,
        'Venus': swisseph.SE_VENUS,
        'Saturn': swisseph.SE_SATURN
      };
      
      for (const [planet, planetId] of Object.entries(planetIds)) {
        try {
          const result = swisseph.swe_calc_ut(jd, planetId, swisseph.SEFLG_SWIEPH);
          if ('longitude' in result) {
            positions[planet] = result.longitude;
          }
        } catch (error) {
          console.warn(`Error calculating ${planet} position: ${error}`);
        }
      }
    } catch (error) {
      console.warn(`Error calculating planetary positions: ${error}`);
    }
    
    return positions;
  }

  private static dateToJulianDay(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    
    return swisseph.swe_julday(year, month, day, hour + minute / 60 + second / 3600, swisseph.SE_GREG_CAL);
  }

  private static getSignFromLongitude(longitude: number): string {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    const signIndex = Math.floor(longitude / 30);
    return signs[signIndex % 12] || 'Unknown';
  }

  private static getHouseFromLongitude(longitude: number, houseCusps: number[]): number {
    if (!houseCusps || houseCusps.length < 12) {
      return 1; // Default to 1st house
    }
    
    // Find which house the longitude falls into
    for (let i = 0; i < 12; i++) {
      const currentCusp = houseCusps[i] || 0;
      const nextCusp = houseCusps[(i + 1) % 12] || 0;
      
      // Handle the 12th house (last house)
      if (i === 11) {
        if (longitude >= currentCusp || longitude < nextCusp) {
          return i + 1;
        }
      } else {
        if (longitude >= currentCusp && longitude < nextCusp) {
          return i + 1;
        }
      }
    }
    
    return 1; // Default to 1st house
  }

  private static calculatePlanetaryInfluence(planet: string, sign: string, house: number): { type: 'Positive' | 'Negative' | 'Neutral'; intensity: number } {
    const influences = this.PLANET_INFLUENCES[planet as keyof typeof this.PLANET_INFLUENCES];
    
    // Simplified influence calculation based on house and sign
    let intensity = 5; // Default neutral intensity
    let type: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
    
    // House-based influence
    if ([1, 5, 9].includes(house)) {
      intensity += 2; // Angular houses - stronger influence
    } else if ([3, 6, 11].includes(house)) {
      intensity -= 1; // Cadent houses - weaker influence
    }
    
    // Sign-based influence (simplified)
    const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
    const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
    const airSigns = ['Gemini', 'Libra', 'Aquarius'];
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
    
    if (fireSigns.includes(sign)) {
      intensity += 1;
      type = 'Positive';
    } else if (earthSigns.includes(sign)) {
      intensity += 0.5;
      type = 'Neutral';
    } else if (waterSigns.includes(sign)) {
      intensity -= 0.5;
      type = 'Neutral';
    }
    
    // Clamp intensity between 1 and 10
    intensity = Math.max(1, Math.min(10, Math.round(intensity)));
    
    return { type, intensity };
  }

  private static getTransitDescription(planet: string, sign: string, house: number): string {
    const influences = this.PLANET_INFLUENCES[planet as keyof typeof this.PLANET_INFLUENCES];
    const houseNames = [
      '1st House (Self)', '2nd House (Wealth)', '3rd House (Communication)', '4th House (Home)',
      '5th House (Creativity)', '6th House (Health)', '7th House (Partnership)', '8th House (Transformation)',
      '9th House (Philosophy)', '10th House (Career)', '11th House (Friends)', '12th House (Spirituality)'
    ];
    
    return `${planet} transiting through ${sign} in the ${houseNames[house - 1] || 'Unknown House'}. This transit influences ${influences.neutral.toLowerCase()}.`;
  }

  private static analyzeMutualPlanetaryInfluence(transitA: PlanetaryTransit, transitB: PlanetaryTransit): { influence: string; recommendation?: string } {
    const planet = transitA.planet;
    const influences = this.PLANET_INFLUENCES[planet as keyof typeof this.PLANET_INFLUENCES];
    
    let influence = 'Neutral';
    let recommendation = '';
    
    // Analyze mutual influence based on planetary combinations
    if (transitA.influence === 'Positive' && transitB.influence === 'Positive') {
      influence = 'Positive';
      recommendation = `🌟 Both partners are experiencing positive ${planet} transits, creating excellent mutual support and harmony.`;
    } else if (transitA.influence === 'Negative' && transitB.influence === 'Negative') {
      influence = 'Negative';
      recommendation = `⚠️ Both partners are experiencing challenging ${planet} transits, requiring extra patience and understanding.`;
    } else if (transitA.influence === 'Positive' && transitB.influence === 'Negative') {
      influence = 'Neutral';
      recommendation = `⚖️ One partner's positive ${planet} transit can help support the other during their challenging period.`;
    } else if (transitA.influence === 'Negative' && transitB.influence === 'Positive') {
      influence = 'Neutral';
      recommendation = `⚖️ One partner's positive ${planet} transit can help support the other during their challenging period.`;
    }
    
    return { influence, recommendation };
  }
}
