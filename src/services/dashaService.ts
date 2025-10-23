import { AstrologicalData, DashaPeriod } from '../types';

export class DashaService {
  // Vimshottari Dasha system - 120 year cycle
  private static readonly DASHA_PERIODS = {
    'Sun': 6,
    'Moon': 10,
    'Mars': 7,
    'Rahu': 18,
    'Jupiter': 16,
    'Saturn': 19,
    'Mercury': 17,
    'Ketu': 7,
    'Venus': 20
  };

  private static readonly DASHA_ORDER = [
    'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'
  ];

  private static readonly PLANET_DESCRIPTIONS = {
    'Sun': 'Leadership, authority, vitality, father figure, ego, self-expression',
    'Moon': 'Emotions, mother figure, intuition, nurturing, mental stability',
    'Mars': 'Energy, courage, aggression, conflicts, physical strength, ambition',
    'Rahu': 'Material desires, foreign connections, technology, unconventional paths',
    'Jupiter': 'Wisdom, spirituality, teachers, children, expansion, optimism',
    'Saturn': 'Discipline, hard work, delays, restrictions, karma, longevity',
    'Mercury': 'Communication, intelligence, commerce, siblings, quick thinking',
    'Ketu': 'Spirituality, detachment, past life karma, sudden events, intuition',
    'Venus': 'Love, beauty, arts, relationships, luxury, harmony, marriage'
  };

  /**
   * Calculate Vimshottari Dasha periods for a person
   */
  static calculateDashaPeriod(astrologicalData: AstrologicalData, currentDate: Date = new Date()): DashaPeriod {
    try {
      // Get the birth nakshatra to determine starting Dasha
      const nakshatra = astrologicalData.nakshatra;
      const nakshatraIndex = this.getNakshatraIndex(nakshatra);
      
      // Calculate birth date from astrological data
      const birthDate = this.calculateBirthDate(astrologicalData);
      
      // Calculate years since birth
      const yearsSinceBirth = this.calculateYearsSinceBirth(birthDate, currentDate);
      
      // Determine current Dasha
      const currentDasha = this.getCurrentDasha(nakshatraIndex, yearsSinceBirth);
      const currentAntardasha = this.getCurrentAntardasha(currentDasha, yearsSinceBirth);
      const currentPratyantardasha = this.getCurrentPratyantardasha(currentAntardasha, yearsSinceBirth);
      const nextDasha = this.getNextDasha(currentDasha);

      return {
        currentDasha: {
          planet: currentDasha.planet,
          startDate: currentDasha.startDate,
          endDate: currentDasha.endDate,
          duration: currentDasha.duration,
          remainingYears: currentDasha.remainingYears,
          description: this.PLANET_DESCRIPTIONS[currentDasha.planet as keyof typeof this.PLANET_DESCRIPTIONS]
        },
        currentAntardasha: {
          planet: currentAntardasha.planet,
          startDate: currentAntardasha.startDate,
          endDate: currentAntardasha.endDate,
          duration: currentAntardasha.duration,
          remainingMonths: currentAntardasha.remainingMonths,
          description: this.PLANET_DESCRIPTIONS[currentAntardasha.planet as keyof typeof this.PLANET_DESCRIPTIONS]
        },
        currentPratyantardasha: currentPratyantardasha ? {
          planet: currentPratyantardasha.planet,
          startDate: currentPratyantardasha.startDate,
          endDate: currentPratyantardasha.endDate,
          duration: currentPratyantardasha.duration,
          remainingDays: currentPratyantardasha.remainingDays,
          description: this.PLANET_DESCRIPTIONS[currentPratyantardasha.planet as keyof typeof this.PLANET_DESCRIPTIONS]
        } : undefined,
        nextDasha: {
          planet: nextDasha.planet,
          startDate: nextDasha.startDate,
          endDate: nextDasha.endDate,
          description: this.PLANET_DESCRIPTIONS[nextDasha.planet as keyof typeof this.PLANET_DESCRIPTIONS]
        }
      };
    } catch (error) {
      throw new Error(`Dasha calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate Dasha compatibility between two persons
   */
  static calculateDashaCompatibility(
    personADasha: DashaPeriod,
    personBDasha: DashaPeriod
  ): { compatibility: 'Excellent' | 'Good' | 'Average' | 'Poor'; description: string } {
    const compatibilityMatrix = this.getDashaCompatibilityMatrix();
    const compatibility = compatibilityMatrix[personADasha.currentDasha.planet]?.[personBDasha.currentDasha.planet] || 'Average';
    
    let description = '';
    switch (compatibility) {
      case 'Excellent':
        description = '🌟 EXCELLENT DASHA COMPATIBILITY - Both partners are in harmonious Dasha periods that support each other\'s growth and relationship development. This is an auspicious time for major life decisions and relationship commitments.';
        break;
      case 'Good':
        description = '✨ GOOD DASHA COMPATIBILITY - The current Dasha periods are generally supportive of the relationship. Both partners can benefit from each other\'s planetary influences during this time.';
        break;
      case 'Average':
        description = '⚖️ AVERAGE DASHA COMPATIBILITY - The Dasha periods are neutral with some supportive and some challenging influences. The relationship may require more effort and understanding during this period.';
        break;
      case 'Poor':
        description = '⚠️ CHALLENGING DASHA COMPATIBILITY - The current Dasha periods may create some challenges in the relationship. Patience, understanding, and mutual support will be essential during this time.';
        break;
    }

    return { 
      compatibility: compatibility as 'Excellent' | 'Good' | 'Average' | 'Poor', 
      description 
    };
  }

  private static getNakshatraIndex(nakshatra: string): number {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    return nakshatras.indexOf(nakshatra);
  }

  private static calculateBirthDate(astrologicalData: AstrologicalData): Date {
    // This is a simplified calculation - in practice, you'd need the actual birth date
    // For now, we'll use a reference date and calculate based on current age
    const currentDate = new Date();
    const estimatedAge = 30; // Default age for calculation
    return new Date(currentDate.getFullYear() - estimatedAge, currentDate.getMonth(), currentDate.getDate());
  }

  private static calculateYearsSinceBirth(birthDate: Date, currentDate: Date): number {
    const diffTime = currentDate.getTime() - birthDate.getTime();
    return diffTime / (1000 * 60 * 60 * 24 * 365.25); // Account for leap years
  }

  private static getCurrentDasha(nakshatraIndex: number, yearsSinceBirth: number): any {
    // Simplified Dasha calculation - in practice, this would be more complex
    const dashaIndex = Math.floor(yearsSinceBirth / 120) % 9; // 120 year cycle
    const planet = this.DASHA_ORDER[dashaIndex];
    const duration = this.DASHA_PERIODS[planet as keyof typeof this.DASHA_PERIODS];
    
    return {
      planet,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 365.25 * 24 * 60 * 60 * 1000),
      duration,
      remainingYears: duration
    };
  }

  private static getCurrentAntardasha(currentDasha: any, yearsSinceBirth: number): any {
    // Simplified Antardasha calculation
    const antardashaIndex = Math.floor((yearsSinceBirth % 120) / 10) % 9;
    const planet = this.DASHA_ORDER[antardashaIndex];
    const duration = this.DASHA_PERIODS[planet as keyof typeof this.DASHA_PERIODS] * 0.1; // 10% of main Dasha
    
    return {
      planet,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 365.25 * 24 * 60 * 60 * 1000),
      duration,
      remainingMonths: duration * 12
    };
  }

  private static getCurrentPratyantardasha(currentAntardasha: any, yearsSinceBirth: number): any {
    // Simplified Pratyantardasha calculation
    const pratyantardashaIndex = Math.floor((yearsSinceBirth % 10) / 1) % 9;
    const planet = this.DASHA_ORDER[pratyantardashaIndex];
    const duration = this.DASHA_PERIODS[planet as keyof typeof this.DASHA_PERIODS] * 0.01; // 1% of main Dasha
    
    return {
      planet,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 365.25 * 24 * 60 * 60 * 1000),
      duration,
      remainingDays: duration * 365.25
    };
  }

  private static getNextDasha(currentDasha: any): any {
    const currentIndex = this.DASHA_ORDER.indexOf(currentDasha.planet);
    const nextIndex = (currentIndex + 1) % 9;
    const nextPlanet = this.DASHA_ORDER[nextIndex];
    const duration = this.DASHA_PERIODS[nextPlanet as keyof typeof this.DASHA_PERIODS];
    
    return {
      planet: nextPlanet,
      startDate: currentDasha.endDate,
      endDate: new Date(currentDasha.endDate.getTime() + duration * 365.25 * 24 * 60 * 60 * 1000)
    };
  }

  private static getDashaCompatibilityMatrix(): Record<string, Record<string, string>> {
    return {
      'Sun': {
        'Sun': 'Good', 'Moon': 'Excellent', 'Mars': 'Good', 'Rahu': 'Average', 'Jupiter': 'Excellent',
        'Saturn': 'Poor', 'Mercury': 'Good', 'Ketu': 'Average', 'Venus': 'Good'
      },
      'Moon': {
        'Sun': 'Excellent', 'Moon': 'Good', 'Mars': 'Average', 'Rahu': 'Poor', 'Jupiter': 'Excellent',
        'Saturn': 'Average', 'Mercury': 'Good', 'Ketu': 'Average', 'Venus': 'Excellent'
      },
      'Mars': {
        'Sun': 'Good', 'Moon': 'Average', 'Mars': 'Good', 'Rahu': 'Good', 'Jupiter': 'Good',
        'Saturn': 'Poor', 'Mercury': 'Average', 'Ketu': 'Good', 'Venus': 'Average'
      },
      'Rahu': {
        'Sun': 'Average', 'Moon': 'Poor', 'Mars': 'Good', 'Rahu': 'Good', 'Jupiter': 'Average',
        'Saturn': 'Good', 'Mercury': 'Average', 'Ketu': 'Poor', 'Venus': 'Average'
      },
      'Jupiter': {
        'Sun': 'Excellent', 'Moon': 'Excellent', 'Mars': 'Good', 'Rahu': 'Average', 'Jupiter': 'Excellent',
        'Saturn': 'Good', 'Mercury': 'Good', 'Ketu': 'Average', 'Venus': 'Excellent'
      },
      'Saturn': {
        'Sun': 'Poor', 'Moon': 'Average', 'Mars': 'Poor', 'Rahu': 'Good', 'Jupiter': 'Good',
        'Saturn': 'Good', 'Mercury': 'Average', 'Ketu': 'Good', 'Venus': 'Average'
      },
      'Mercury': {
        'Sun': 'Good', 'Moon': 'Good', 'Mars': 'Average', 'Rahu': 'Average', 'Jupiter': 'Good',
        'Saturn': 'Average', 'Mercury': 'Good', 'Ketu': 'Average', 'Venus': 'Good'
      },
      'Ketu': {
        'Sun': 'Average', 'Moon': 'Average', 'Mars': 'Good', 'Rahu': 'Poor', 'Jupiter': 'Average',
        'Saturn': 'Good', 'Mercury': 'Average', 'Ketu': 'Good', 'Venus': 'Average'
      },
      'Venus': {
        'Sun': 'Good', 'Moon': 'Excellent', 'Mars': 'Average', 'Rahu': 'Average', 'Jupiter': 'Excellent',
        'Saturn': 'Average', 'Mercury': 'Good', 'Ketu': 'Average', 'Venus': 'Excellent'
      }
    };
  }
}
