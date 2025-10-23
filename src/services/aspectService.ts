import { AstrologicalData, PlanetaryAspect } from '../types';

export class AspectService {
  private static readonly ASPECT_ORBS = {
    'Conjunction': 8,    // 0° ± 8°
    'Opposition': 8,     // 180° ± 8°
    'Trine': 6,          // 120° ± 6°
    'Square': 6,         // 90° ± 6°
    'Sextile': 4,        // 60° ± 4°
    'Quincunx': 3        // 150° ± 3°
  };

  private static readonly ASPECT_DESCRIPTIONS = {
    'Conjunction': {
      positive: 'Strong mutual influence, shared goals, intense connection',
      negative: 'Overwhelming influence, conflicts, power struggles',
      neutral: 'Close association, similar energies'
    },
    'Opposition': {
      positive: 'Complementary energies, balance, mutual attraction',
      negative: 'Polarization, conflicts, opposing forces',
      neutral: 'Tension and balance, different approaches'
    },
    'Trine': {
      positive: 'Harmonious flow, natural understanding, ease of expression',
      negative: 'Lack of challenge, complacency, missed opportunities',
      neutral: 'Smooth interaction, natural compatibility'
    },
    'Square': {
      positive: 'Dynamic energy, motivation, growth through challenge',
      negative: 'Tension, conflicts, obstacles, power struggles',
      neutral: 'Challenging but productive interaction'
    },
    'Sextile': {
      positive: 'Opportunities, cooperation, mutual support',
      negative: 'Missed opportunities, lack of action',
      neutral: 'Potential for growth and development'
    },
    'Quincunx': {
      positive: 'Adaptation, adjustment, unique solutions',
      negative: 'Irritation, unease, constant adjustment needed',
      neutral: 'Requires effort and adaptation'
    }
  };

  /**
   * Calculate planetary aspects between two persons
   */
  static calculatePlanetaryAspects(
    personAData: AstrologicalData,
    personBData: AstrologicalData
  ): PlanetaryAspect[] {
    try {
      const aspects: PlanetaryAspect[] = [];
      
      // Get planetary positions for both persons
      const personAPlanets = this.getPlanetaryPositions(personAData);
      const personBPlanets = this.getPlanetaryPositions(personBData);
      
      // Calculate aspects between corresponding planets
      for (const [planetA, positionA] of Object.entries(personAPlanets)) {
        for (const [planetB, positionB] of Object.entries(personBPlanets)) {
          if (planetA === planetB) {
            const aspect = this.calculateAspect(planetA, positionA, positionB);
            if (aspect) {
              aspects.push(aspect);
            }
          }
        }
      }
      
      // Calculate cross-aspects between different planets
      for (const [planetA, positionA] of Object.entries(personAPlanets)) {
        for (const [planetB, positionB] of Object.entries(personBPlanets)) {
          if (planetA !== planetB) {
            const aspect = this.calculateAspect(`${planetA}-${planetB}`, positionA, positionB);
            if (aspect) {
              aspects.push(aspect);
            }
          }
        }
      }
      
      return aspects;
    } catch (error) {
      throw new Error(`Aspect calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate overall planetary harmony
   */
  static calculatePlanetaryHarmony(aspects: PlanetaryAspect[]): number {
    let totalHarmony = 0;
    let totalAspects = 0;
    
    for (const aspect of aspects) {
      let harmonyScore = 0;
      
      // Base harmony score by aspect type
      switch (aspect.aspectType) {
        case 'Conjunction':
          harmonyScore = aspect.influence === 'Positive' ? 8 : aspect.influence === 'Negative' ? 2 : 5;
          break;
        case 'Trine':
          harmonyScore = aspect.influence === 'Positive' ? 9 : aspect.influence === 'Negative' ? 3 : 6;
          break;
        case 'Sextile':
          harmonyScore = aspect.influence === 'Positive' ? 7 : aspect.influence === 'Negative' ? 4 : 6;
          break;
        case 'Square':
          harmonyScore = aspect.influence === 'Positive' ? 6 : aspect.influence === 'Negative' ? 2 : 4;
          break;
        case 'Opposition':
          harmonyScore = aspect.influence === 'Positive' ? 7 : aspect.influence === 'Negative' ? 3 : 5;
          break;
        case 'Quincunx':
          harmonyScore = aspect.influence === 'Positive' ? 5 : aspect.influence === 'Negative' ? 3 : 4;
          break;
      }
      
      // Adjust for orb strength
      if (aspect.strength === 'Strong') {
        harmonyScore *= 1.2;
      } else if (aspect.strength === 'Weak') {
        harmonyScore *= 0.8;
      }
      
      totalHarmony += harmonyScore;
      totalAspects++;
    }
    
    return totalAspects > 0 ? Math.round((totalHarmony / totalAspects) * 10) / 10 : 5;
  }

  /**
   * Get key aspects (most significant)
   */
  static getKeyAspects(aspects: PlanetaryAspect[]): PlanetaryAspect[] {
    return aspects
      .filter(aspect => aspect.strength === 'Strong' || aspect.strength === 'Moderate')
      .sort((a, b) => {
        // Sort by influence priority
        const influenceOrder = { 'Positive': 3, 'Neutral': 2, 'Negative': 1 };
        return influenceOrder[b.influence] - influenceOrder[a.influence];
      })
      .slice(0, 5); // Top 5 key aspects
  }

  private static getPlanetaryPositions(astrologicalData: AstrologicalData): Record<string, number> {
    return {
      'Sun': astrologicalData.sunPosition,
      'Moon': astrologicalData.moonPosition,
      'Mars': astrologicalData.marsPosition,
      'Mercury': astrologicalData.mercuryPosition,
      'Jupiter': astrologicalData.jupiterPosition,
      'Venus': astrologicalData.venusPosition,
      'Saturn': astrologicalData.saturnPosition,
      'Rahu': astrologicalData.rahuPosition,
      'Ketu': astrologicalData.ketuPosition
    };
  }

  private static calculateAspect(planetName: string, positionA: number, positionB: number): PlanetaryAspect | null {
    const orb = Math.abs(positionA - positionB);
    const normalizedOrb = Math.min(orb, 360 - orb); // Normalize to 0-180 degrees
    
    // Find the closest aspect
    const aspects = [
      { type: 'Conjunction', angle: 0, orb: this.ASPECT_ORBS.Conjunction },
      { type: 'Sextile', angle: 60, orb: this.ASPECT_ORBS.Sextile },
      { type: 'Square', angle: 90, orb: this.ASPECT_ORBS.Square },
      { type: 'Trine', angle: 120, orb: this.ASPECT_ORBS.Trine },
      { type: 'Quincunx', angle: 150, orb: this.ASPECT_ORBS.Quincunx },
      { type: 'Opposition', angle: 180, orb: this.ASPECT_ORBS.Opposition }
    ];
    
    for (const aspect of aspects) {
      if (Math.abs(normalizedOrb - aspect.angle) <= aspect.orb) {
        const exactOrb = Math.abs(normalizedOrb - aspect.angle);
        const strength = this.getAspectStrength(exactOrb, aspect.orb);
        const influence = this.getAspectInfluence(aspect.type, exactOrb);
        const description = this.getAspectDescription(aspect.type, influence);
        
        const planetParts = planetName.split('-');
        return {
          planet1: planetParts[0] || planetName,
          planet2: planetParts[1] || planetName,
          aspectType: aspect.type as any,
          orb: exactOrb,
          strength,
          influence,
          description
        };
      }
    }
    
    return null; // No significant aspect found
  }

  private static getAspectStrength(exactOrb: number, maxOrb: number): 'Strong' | 'Moderate' | 'Weak' {
    const orbPercentage = exactOrb / maxOrb;
    
    if (orbPercentage <= 0.5) {
      return 'Strong';
    } else if (orbPercentage <= 0.8) {
      return 'Moderate';
    } else {
      return 'Weak';
    }
  }

  private static getAspectInfluence(aspectType: string, exactOrb: number): 'Positive' | 'Negative' | 'Neutral' {
    // Simplified influence calculation
    const influences = this.ASPECT_DESCRIPTIONS[aspectType as keyof typeof this.ASPECT_DESCRIPTIONS];
    
    // For now, we'll use a simplified approach
    // In practice, this would be more complex and consider planetary natures
    if (aspectType === 'Trine' || aspectType === 'Sextile') {
      return 'Positive';
    } else if (aspectType === 'Square' || aspectType === 'Opposition') {
      return 'Negative';
    } else {
      return 'Neutral';
    }
  }

  private static getAspectDescription(aspectType: string, influence: string): string {
    const descriptions = this.ASPECT_DESCRIPTIONS[aspectType as keyof typeof this.ASPECT_DESCRIPTIONS];
    return descriptions[influence as keyof typeof descriptions] || 'Unknown aspect influence';
  }
}
