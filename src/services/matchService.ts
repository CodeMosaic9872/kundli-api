import { BirthDetails, MatchResult, KootaScore, AstrologicalData } from '../types';
import { AstrologyService } from './astrologyService';
import { KootaService } from './kootaService';

export class MatchService {
  /**
   * Calculate complete match compatibility between two persons
   */
  static async calculateMatch(personA: BirthDetails, personB: BirthDetails): Promise<MatchResult> {
    try {
      // Validate input data
      this.validateBirthDetails(personA);
      this.validateBirthDetails(personB);

      // Calculate astrological data for both persons
      const personAData = await AstrologyService.calculateAstrologicalData(personA);
      const personBData = await AstrologyService.calculateAstrologicalData(personB);

      // Calculate all Kootas (including name compatibility if names provided)
      const kootas = KootaService.calculateAllKootas(
        personAData,
        personBData,
        personA.gender,
        personB.gender,
        personA.name,
        personB.name
      );

      // Calculate total score (Traditional Guna Milan - exactly 36 points)
      const totalScore = kootas.reduce((sum, koota) => sum + koota.score, 0);
      const maxScore = kootas.reduce((sum, koota) => sum + koota.maxScore, 0);
      
      // Calculate percentage based on traditional 36-point system
      const percentage = Math.round((totalScore / maxScore) * 100);

      // Determine compatibility level
      const compatibility = this.determineCompatibilityLevel(percentage);

      // Check Manglik status
      const personAManglik = AstrologyService.isManglik(personAData);
      const personBManglik = AstrologyService.isManglik(personBData);

      return {
        totalScore,
        maxScore,
        percentage,
        kootas,
        personADetails: {
          nakshatra: personAData.nakshatra,
          rashi: personAData.rashi,
          manglik: personAManglik
        },
        personBDetails: {
          nakshatra: personBData.nakshatra,
          rashi: personBData.rashi,
          manglik: personBManglik
        },
        compatibility
      };
    } catch (error) {
      throw new Error(`Match calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detailed analysis of a specific Koota
   */
  static getKootaAnalysis(kootaName: string, personAData: AstrologicalData, personBData: AstrologicalData): KootaScore {
    const kootas = KootaService.calculateAllKootas(
      personAData,
      personBData,
      'MALE', // Default values for analysis
      'FEMALE'
    );

    const koota = kootas.find(k => k.name === kootaName);
    if (!koota) {
      throw new Error(`Koota ${kootaName} not found`);
    }

    return koota;
  }

  /**
   * Get compatibility suggestions based on match results
   */
  static getCompatibilitySuggestions(matchResult: MatchResult): string[] {
    const suggestions: string[] = [];
    const lowScoreKootas = matchResult.kootas.filter(koota => koota.score < koota.maxScore * 0.5);

    if (matchResult.percentage < 30) {
      suggestions.push('🔴 CRITICAL: Overall compatibility is very low. This match faces significant astrological challenges that may lead to frequent conflicts and relationship difficulties. Strongly consider consulting a qualified Vedic astrologer for detailed analysis, potential remedies, and guidance before proceeding with any commitments.');
    } else if (matchResult.percentage < 50) {
      suggestions.push('🟡 MODERATE: Compatibility shows mixed results with several challenging areas. This relationship will require significant effort, patience, and understanding from both partners. Consider pre-marital counseling, astrological remedies, and open communication to address potential issues early.');
    } else if (matchResult.percentage < 70) {
      suggestions.push('🟢 GOOD: Overall compatibility is solid with good potential for success. While some minor adjustments may be needed, the relationship has strong foundations. Focus on communication, mutual respect, and understanding to maximize the positive aspects of this match.');
    } else {
      suggestions.push('🟢 EXCELLENT: This is an exceptional match with very high compatibility! The relationship has excellent potential for happiness, prosperity, and long-term success. This union is considered highly auspicious in Vedic astrology and promises a harmonious, fulfilling partnership.');
    }

    // Specific suggestions based on low-scoring Kootas
    lowScoreKootas.forEach(koota => {
      switch (koota.name) {
        case 'Varna':
          suggestions.push('📚 VARNA CHALLENGE: Different social and spiritual values may cause conflicts. Focus on understanding each other\'s cultural background, family values, and spiritual beliefs. Consider pre-marital counseling to address potential cultural differences and build mutual respect.');
          break;
        case 'Vashya':
          suggestions.push('💕 VASHYA CHALLENGE: Mutual attraction levels may be different. Work on building emotional connection, understanding each other\'s love languages, and creating shared experiences. Consider relationship counseling to improve intimacy and emotional bonding.');
          break;
        case 'Tara':
          suggestions.push('⭐ TARA CHALLENGE: Birth star differences may affect understanding. Focus on communication, patience, and learning about each other\'s nature. Consider timing important decisions carefully and seek guidance from elders or astrologers for auspicious moments.');
          break;
        case 'Yoni':
          suggestions.push('🔥 YONI CHALLENGE: Physical and sexual compatibility may need attention. Focus on building emotional intimacy first, understanding each other\'s needs, and creating a safe space for physical connection. Consider professional guidance for intimacy issues.');
          break;
        case 'Graha Maitri':
          suggestions.push('🧠 GRAHA MAITRI CHALLENGE: Mental compatibility may be challenging. Work on intellectual bonding, shared interests, and respectful communication. Focus on understanding each other\'s thought processes and finding common ground in discussions.');
          break;
        case 'Gana':
          suggestions.push('😊 GANA CHALLENGE: Different temperaments may cause misunderstandings. Learn about each other\'s nature, practice patience, and develop understanding for different approaches to life. Focus on acceptance and adaptation rather than trying to change each other.');
          break;
        case 'Bhakoot':
          suggestions.push('♈ BHAKOOT CHALLENGE: Zodiac sign compatibility is challenging. Focus on understanding each other\'s personality traits, communication styles, and life approaches. Consider relationship counseling to bridge the differences and build harmony.');
          break;
        case 'Nadi':
          suggestions.push('🧬 NADI CHALLENGE: Genetic compatibility concerns for offspring. This is a serious consideration in Vedic astrology. Consult a qualified astrologer for detailed analysis and potential remedies. Consider genetic counseling and medical advice before planning children.');
          break;
      }
    });

    // Manglik considerations
    if (matchResult.personADetails.manglik && !matchResult.personBDetails.manglik) {
      suggestions.push('🔥 MANGALIK CONSIDERATION: Person A is Manglik (Mars in specific signs). This may cause relationship challenges. Consider Manglik remedies like Kumbh Vivah, wearing red coral, or matching with another Manglik person. Consult a qualified astrologer for specific remedies and guidance.');
    } else if (!matchResult.personADetails.manglik && matchResult.personBDetails.manglik) {
      suggestions.push('🔥 MANGALIK CONSIDERATION: Person B is Manglik (Mars in specific signs). This may cause relationship challenges. Consider Manglik remedies like Kumbh Vivah, wearing red coral, or matching with another Manglik person. Consult a qualified astrologer for specific remedies and guidance.');
    } else if (matchResult.personADetails.manglik && matchResult.personBDetails.manglik) {
      suggestions.push('🔥 MANGALIK MATCH: Both persons are Manglik, which is generally considered compatible in Vedic astrology. This combination neutralizes the Manglik effects and is often preferred for Manglik individuals.');
    }

    return suggestions;
  }

  /**
   * Validate birth details
   */
  private static validateBirthDetails(birthDetails: BirthDetails): void {
    // Name is optional for traditional 36-point Guna Milan
    // if (!birthDetails.name || birthDetails.name.trim().length === 0) {
    //   throw new Error('Name is required');
    // }

    if (!birthDetails.gender || !['MALE', 'FEMALE', 'OTHER'].includes(birthDetails.gender)) {
      throw new Error('Valid gender is required (MALE, FEMALE, OTHER)');
    }

    if (!birthDetails.dateOfBirth) {
      throw new Error('Date of birth is required');
    }

    if (!birthDetails.timeOfBirth) {
      throw new Error('Time of birth is required');
    }

    if (!birthDetails.placeOfBirth || birthDetails.placeOfBirth.trim().length === 0) {
      throw new Error('Place of birth is required');
    }

    // Validate date format
    const birthDate = new Date(birthDetails.dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      throw new Error('Invalid date of birth format');
    }

    // Validate time format
    const birthTime = new Date(birthDetails.timeOfBirth);
    if (isNaN(birthTime.getTime())) {
      throw new Error('Invalid time of birth format');
    }

    // Check if birth date is not in the future
    if (birthDate > new Date()) {
      throw new Error('Birth date cannot be in the future');
    }
  }

  /**
   * Determine compatibility level based on percentage
   */
  private static determineCompatibilityLevel(percentage: number): { level: 'Excellent' | 'Good' | 'Average' | 'Poor'; description: string } {
    if (percentage >= 80) {
      return {
        level: 'Excellent',
        description: '🌟 EXCELLENT MATCH - This is an exceptional astrological compatibility! Both partners share strong spiritual, mental, and physical harmony. This union promises a deeply fulfilling relationship with excellent understanding, mutual respect, and shared values. The couple will likely enjoy a long-lasting, prosperous marriage with minimal conflicts. This match is considered highly auspicious in Vedic astrology and is ideal for marriage.'
      };
    } else if (percentage >= 60) {
      return {
        level: 'Good',
        description: '✨ GOOD MATCH - This is a solid astrological compatibility with strong potential for a successful relationship. The couple shares good understanding, mutual attraction, and compatible temperaments. While some minor adjustments may be needed, the overall harmony is strong. This match promises a stable, loving relationship with good prospects for happiness and prosperity. With mutual effort and understanding, this can be a very fulfilling partnership.'
      };
    } else if (percentage >= 40) {
      return {
        level: 'Average',
        description: '⚖️ AVERAGE MATCH - This compatibility shows mixed results with both positive and challenging aspects. The couple may face some differences in temperament, values, or life approach that require patience and understanding to overcome. While not ideal, this match can work with conscious effort, open communication, and mutual respect. Consider pre-marital counseling or astrological remedies to strengthen the relationship. Success depends largely on both partners\' willingness to adapt and grow together.'
      };
    } else {
      return {
        level: 'Poor',
        description: '⚠️ CHALLENGING MATCH - This compatibility shows significant astrological challenges that may lead to frequent conflicts, misunderstandings, and relationship difficulties. The couple may have fundamental differences in values, temperament, or life goals that are difficult to reconcile. This match requires extensive effort, professional guidance, and possibly astrological remedies to succeed. Consider consulting a qualified Vedic astrologer for detailed analysis and potential solutions before making any commitments.'
      };
    }
  }

  /**
   * Calculate match summary for quick overview
   */
  static getMatchSummary(matchResult: MatchResult): {
    totalScore: number;
    maxScore: number;
    percentage: number;
    compatibility: string;
    keyStrengths: string[];
    keyWeaknesses: string[];
  } {
    const keyStrengths = matchResult.kootas
      .filter(koota => koota.score === koota.maxScore)
      .map(koota => koota.name);

    const keyWeaknesses = matchResult.kootas
      .filter(koota => koota.score === 0)
      .map(koota => koota.name);

    return {
      totalScore: matchResult.totalScore,
      maxScore: matchResult.maxScore,
      percentage: matchResult.percentage,
      compatibility: matchResult.compatibility.level,
      keyStrengths,
      keyWeaknesses
    };
  }
}
