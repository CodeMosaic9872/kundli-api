import { BirthDetails, EnhancedMatchResult, DashaPeriod, PlanetaryTransit, PlanetaryAspect } from '../types';
import { MatchService } from './matchService';
import { DashaService } from './dashaService';
import { TransitService } from './transitService';
import { AspectService } from './aspectService';

export class EnhancedMatchService {
  /**
   * Calculate enhanced match compatibility with Dasha and transit analysis
   */
  static async calculateEnhancedMatch(personA: BirthDetails, personB: BirthDetails): Promise<EnhancedMatchResult> {
    try {
      // Get basic match result
      const basicMatch = await MatchService.calculateMatch(personA, personB);
      
      // Get enhanced astrological data (this will include Dasha, transits, and aspects)
      const { AstrologyService } = await import('./astrologyService');
      const personAData = await AstrologyService.calculateAstrologicalData(personA);
      const personBData = await AstrologyService.calculateAstrologicalData(personB);
      
      // Calculate Dasha compatibility
      const dashaCompatibility = this.calculateDashaCompatibility(
        personAData.dashaPeriod!,
        personBData.dashaPeriod!
      );
      
      // Calculate transit analysis
      const transitAnalysis = this.calculateTransitAnalysis(
        personAData.currentTransits!,
        personBData.currentTransits!
      );
      
      // Calculate planetary aspects
      const planetaryAspects = this.calculatePlanetaryAspects(
        personAData,
        personBData
      );
      
      return {
        ...basicMatch,
        dashaCompatibility,
        transitAnalysis,
        planetaryAspects
      };
    } catch (error) {
      throw new Error(`Enhanced match calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate Dasha compatibility between two persons
   */
  private static calculateDashaCompatibility(
    personADasha: DashaPeriod,
    personBDasha: DashaPeriod
  ): { personADasha: DashaPeriod; personBDasha: DashaPeriod; compatibility: 'Excellent' | 'Good' | 'Average' | 'Poor'; description: string } {
    const compatibility = DashaService.calculateDashaCompatibility(personADasha, personBDasha);
    
    return {
      personADasha,
      personBDasha,
      compatibility: compatibility.compatibility,
      description: compatibility.description
    };
  }

  /**
   * Calculate transit analysis for both persons
   */
  private static calculateTransitAnalysis(
    personATransits: PlanetaryTransit[],
    personBTransits: PlanetaryTransit[]
  ): { currentTransits: PlanetaryTransit[]; mutualInfluence: string; recommendations: string[] } {
    const mutualInfluence = TransitService.calculateMutualTransitInfluence(personATransits, personBTransits);
    
    // Combine transits for analysis
    const allTransits = [...personATransits, ...personBTransits];
    
    return {
      currentTransits: allTransits,
      mutualInfluence: mutualInfluence.mutualInfluence,
      recommendations: mutualInfluence.recommendations
    };
  }

  /**
   * Calculate planetary aspects between two persons
   */
  private static calculatePlanetaryAspects(
    personAData: any,
    personBData: any
  ): { aspects: PlanetaryAspect[]; overallHarmony: number; keyAspects: PlanetaryAspect[] } {
    const aspects = AspectService.calculatePlanetaryAspects(personAData, personBData);
    const overallHarmony = AspectService.calculatePlanetaryHarmony(aspects);
    const keyAspects = AspectService.getKeyAspects(aspects);
    
    return {
      aspects,
      overallHarmony,
      keyAspects
    };
  }

  /**
   * Get comprehensive match analysis
   */
  static async getComprehensiveAnalysis(personA: BirthDetails, personB: BirthDetails): Promise<{
    basicCompatibility: number;
    dashaCompatibility: string;
    transitInfluence: string;
    planetaryHarmony: number;
    overallScore: number;
    recommendations: string[];
  }> {
    try {
      const enhancedMatch = await this.calculateEnhancedMatch(personA, personB);
      
      // Calculate overall score
      const basicScore = enhancedMatch.percentage;
      const dashaScore = this.getDashaScore(enhancedMatch.dashaCompatibility.compatibility);
      const transitScore = this.getTransitScore(enhancedMatch.transitAnalysis.mutualInfluence);
      const aspectScore = enhancedMatch.planetaryAspects.overallHarmony * 10; // Convert to percentage
      
      const overallScore = Math.round((basicScore * 0.4 + dashaScore * 0.2 + transitScore * 0.2 + aspectScore * 0.2));
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(enhancedMatch);
      
      return {
        basicCompatibility: basicScore,
        dashaCompatibility: enhancedMatch.dashaCompatibility.compatibility,
        transitInfluence: enhancedMatch.transitAnalysis.mutualInfluence,
        planetaryHarmony: enhancedMatch.planetaryAspects.overallHarmony,
        overallScore,
        recommendations
      };
    } catch (error) {
      throw new Error(`Comprehensive analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static getDashaScore(compatibility: string): number {
    switch (compatibility) {
      case 'Excellent': return 90;
      case 'Good': return 75;
      case 'Average': return 60;
      case 'Poor': return 40;
      default: return 50;
    }
  }

  private static getTransitScore(influence: string): number {
    switch (influence) {
      case 'Positive': return 85;
      case 'Neutral': return 60;
      case 'Negative': return 35;
      default: return 50;
    }
  }

  private static generateRecommendations(enhancedMatch: EnhancedMatchResult): string[] {
    const recommendations: string[] = [];
    
    // Basic compatibility recommendations
    if (enhancedMatch.percentage < 50) {
      recommendations.push('🔴 Basic compatibility is low. Consider astrological remedies and relationship counseling.');
    } else if (enhancedMatch.percentage > 75) {
      recommendations.push('🟢 Excellent basic compatibility! This relationship has strong astrological foundations.');
    }
    
    // Dasha recommendations
    if (enhancedMatch.dashaCompatibility.compatibility === 'Excellent') {
      recommendations.push('🌟 Current Dasha periods are highly favorable for relationship development.');
    } else if (enhancedMatch.dashaCompatibility.compatibility === 'Poor') {
      recommendations.push('⚠️ Current Dasha periods may present challenges. Patience and understanding are essential.');
    }
    
    // Transit recommendations
    if (enhancedMatch.transitAnalysis.mutualInfluence === 'Positive') {
      recommendations.push('✨ Current planetary transits are supporting the relationship. This is an excellent time for major decisions.');
    } else if (enhancedMatch.transitAnalysis.mutualInfluence === 'Negative') {
      recommendations.push('⚠️ Current transits may create some tension. Focus on communication and mutual support.');
    }
    
    // Planetary aspects recommendations
    if (enhancedMatch.planetaryAspects.overallHarmony > 7) {
      recommendations.push('🎯 Planetary aspects show excellent harmony between both partners.');
    } else if (enhancedMatch.planetaryAspects.overallHarmony < 4) {
      recommendations.push('⚖️ Planetary aspects indicate some challenges. Consider astrological remedies and relationship counseling.');
    }
    
    // Add specific transit recommendations
    recommendations.push(...enhancedMatch.transitAnalysis.recommendations);
    
    return recommendations;
  }
}
