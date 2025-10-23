import { AstrologicalData, NakshatraInfo, RashiInfo, KootaScore } from '../types';
import { AstrologyService } from './astrologyService';

export class KootaService {
  private static readonly KOTA_WEIGHTS = {
    Varna: 1,
    Vashya: 2,
    Tara: 3,
    Yoni: 4,
    GrahaMaitri: 5,
    Gana: 6,
    Bhakoot: 7,
    Nadi: 8
  };

  /**
   * Calculate all 8 Kootas for a match
   */
  static calculateAllKootas(
    personAData: AstrologicalData,
    personBData: AstrologicalData,
    personAGender: string,
    personBGender: string,
    personAName?: string,
    personBName?: string
  ): KootaScore[] {
    const kootas: KootaScore[] = [];

    // 1. Varna Koota (1 point)
    kootas.push(this.calculateVarnaKoota(personAData, personBData, personAGender, personBGender));

    // 2. Vashya Koota (2 points)
    kootas.push(this.calculateVashyaKoota(personAData, personBData));

    // 3. Tara Koota (3 points)
    kootas.push(this.calculateTaraKoota(personAData, personBData));

    // 4. Yoni Koota (4 points)
    kootas.push(this.calculateYoniKoota(personAData, personBData));

    // 5. Graha Maitri Koota (5 points)
    kootas.push(this.calculateGrahaMaitriKoota(personAData, personBData));

    // 6. Gana Koota (6 points)
    kootas.push(this.calculateGanaKoota(personAData, personBData));

    // 7. Bhakoot Koota (7 points)
    kootas.push(this.calculateBhakootKoota(personAData, personBData));

    // 8. Nadi Koota (8 points)
    kootas.push(this.calculateNadiKoota(personAData, personBData));

    // Note: Name Compatibility is available as separate calculation if needed
    // Traditional Guna Milan is exactly 36 points (8 Kootas)

    return kootas;
  }

  /**
   * 1. Varna Koota - Based on caste compatibility (1 point)
   */
  private static calculateVarnaKoota(
    personAData: AstrologicalData,
    personBData: AstrologicalData,
    personAGender: string,
    personBGender: string
  ): KootaScore {
    const personANakshatraInfo = AstrologyService.getNakshatraInfo(personAData.nakshatra);
    const personBNakshatraInfo = AstrologyService.getNakshatraInfo(personBData.nakshatra);

    const varnaA = personANakshatraInfo.varna;
    const varnaB = personBNakshatraInfo.varna;

    let score = 0;
    let description = '';

    // Varna compatibility rules with traditional terminology
    if (varnaA === varnaB) {
      score = 1;
      description = 'Same Varna - Perfect work compatibility. Both partners share the same social and spiritual values, ensuring harmony in family life and social interactions.';
    } else if (
      (varnaA === 'Brahmin' && varnaB === 'Kshatriya') ||
      (varnaA === 'Kshatriya' && varnaB === 'Brahmin')
    ) {
      score = 1;
      description = 'Brahmin-Kshatriya compatibility - Excellent work influence. The spiritual wisdom of Brahmin complements the leadership qualities of Kshatriya, creating a balanced partnership.';
    } else if (
      (varnaA === 'Kshatriya' && varnaB === 'Vaishya') ||
      (varnaA === 'Vaishya' && varnaB === 'Kshatriya')
    ) {
      score = 1;
      description = 'Kshatriya-Vaishya compatibility - Good work influence. The leadership qualities of Kshatriya work well with the business acumen of Vaishya, creating a prosperous partnership.';
    } else if (
      (varnaA === 'Vaishya' && varnaB === 'Shudra') ||
      (varnaA === 'Shudra' && varnaB === 'Vaishya')
    ) {
      score = 1;
      description = 'Vaishya-Shudra compatibility - Compatible work influence. The business skills of Vaishya complement the service-oriented nature of Shudra, creating a harmonious relationship.';
    } else if (
      (varnaA === 'Brahmin' && varnaB === 'Vaishya') ||
      (varnaA === 'Vaishya' && varnaB === 'Brahmin') ||
      (varnaA === 'Brahmin' && varnaB === 'Shudra') ||
      (varnaA === 'Shudra' && varnaB === 'Brahmin')
    ) {
      score = 0.5;
      description = 'Partial Varna compatibility - Moderate work influence. While there are some differences in social values, this combination can work with understanding and mutual respect.';
    } else {
      score = 0;
      description = 'Incompatible Varna - Different social values may cause conflicts. This combination requires extra effort to understand and respect each other\'s perspectives and lifestyle choices.';
    }

    return {
      name: 'Work',
      score,
      maxScore: 1,
      description
    };
  }

  /**
   * 2. Vashya Koota - Based on mutual attraction (2 points)
   */
  private static calculateVashyaKoota(personAData: AstrologicalData, personBData: AstrologicalData): KootaScore {
    const personANakshatraInfo = AstrologyService.getNakshatraInfo(personAData.nakshatra);
    const personBNakshatraInfo = AstrologyService.getNakshatraInfo(personBData.nakshatra);

    const vashyaA = personANakshatraInfo.vashya;
    const vashyaB = personBNakshatraInfo.vashya;

    let score = 0;
    let description = '';

    // Vashya compatibility rules with traditional terminology
    if (vashyaA === vashyaB) {
      score = 2;
      description = 'Same Vashya - Excellent work influence. Both partners have similar levels of mutual attraction and understanding, ensuring strong emotional and physical bonding.';
    } else if (
      (vashyaA === 'Chatushpada' && vashyaB === 'Dvipada') ||
      (vashyaA === 'Dvipada' && vashyaB === 'Chatushpada')
    ) {
      score = 2;
      description = 'Chatushpada-Dvipada compatibility - Good work influence. The four-legged and two-legged creatures complement each other well, creating a balanced relationship with mutual respect.';
    } else if (
      (vashyaA === 'Jalachara' && vashyaB === 'Keeta') ||
      (vashyaA === 'Keeta' && vashyaB === 'Jalachara')
    ) {
      score = 2;
      description = 'Jalachara-Keeta compatibility - Compatible work influence. The water-dwelling and insect creatures have complementary natures, creating an interesting and harmonious relationship.';
    } else if (
      (vashyaA === 'Chatushpada' && vashyaB === 'Jalachara') ||
      (vashyaA === 'Jalachara' && vashyaB === 'Chatushpada') ||
      (vashyaA === 'Dvipada' && vashyaB === 'Keeta') ||
      (vashyaA === 'Keeta' && vashyaB === 'Dvipada')
    ) {
      score = 1;
      description = 'Partial Vashya compatibility - Moderate work influence. Some mutual understanding exists, but effort is needed to develop deeper emotional connection.';
    } else if (
      (vashyaA === 'Chatushpada' && vashyaB === 'Keeta') ||
      (vashyaA === 'Keeta' && vashyaB === 'Chatushpada') ||
      (vashyaA === 'Dvipada' && vashyaB === 'Jalachara') ||
      (vashyaA === 'Jalachara' && vashyaB === 'Dvipada')
    ) {
      score = 0.5;
      description = 'Limited Vashya compatibility - Low work influence. Significant effort is required to build mutual understanding and emotional connection.';
    } else {
      score = 0;
      description = 'Incompatible Vashya - Different attraction levels may cause misunderstandings. This combination requires patience and understanding to develop mutual attraction and emotional connection.';
    }

    return {
      name: 'Influence',
      score,
      maxScore: 2,
      description
    };
  }

  /**
   * 3. Tara Koota - Based on birth star compatibility (3 points)
   */
  private static calculateTaraKoota(personAData: AstrologicalData, personBData: AstrologicalData): KootaScore {
    const personANakshatra = personAData.nakshatra;
    const personBNakshatra = personBData.nakshatra;

    const nakshatraIndexA = AstrologyService['NAKSHATRAS'].indexOf(personANakshatra);
    const nakshatraIndexB = AstrologyService['NAKSHATRAS'].indexOf(personBNakshatra);

    const taraA = (nakshatraIndexA % 9) + 1;
    const taraB = (nakshatraIndexB % 9) + 1;

    let score = 0;
    let description = '';

    // Tara compatibility rules with traditional terminology
    if (taraA === taraB) {
      score = 3;
      description = 'Same Tara - Perfect destiny influence. Both partners are born under the same birth star, ensuring excellent understanding, shared values, and harmonious relationship.';
    } else if (Math.abs(taraA - taraB) === 1) {
      score = 2.5;
      description = 'Adjacent Tara - Very good destiny influence. The birth stars are close to each other, indicating excellent understanding and compatibility with minimal adjustments needed.';
    } else if (Math.abs(taraA - taraB) === 2) {
      score = 2; // Adjusted: Give 2 points for Tara difference of 2 (aligned with Shaddi.com)
      description = 'Good Tara compatibility - Good destiny influence. The birth stars have moderate distance, requiring some effort to understand each other\'s nature and build compatibility.';
    } else if (Math.abs(taraA - taraB) === 3) {
      score = 1.5;
      description = 'Moderate Tara compatibility - Moderate destiny influence. The birth stars have some distance, requiring moderate effort to understand each other\'s nature and build compatibility.';
    } else if (Math.abs(taraA - taraB) === 4) {
      score = 1;
      description = 'Limited Tara compatibility - Limited destiny influence. The birth stars have significant distance, requiring considerable effort to understand each other\'s nature and build compatibility.';
    } else if (Math.abs(taraA - taraB) === 5) {
      score = 0.5;
      description = 'Minimal Tara compatibility - Minimal destiny influence. The birth stars are quite far apart, requiring significant effort to understand and adapt to each other\'s nature and life approach.';
    } else {
      score = 0;
      description = 'Incompatible Tara - Different birth stars may cause fundamental differences. This combination requires significant effort to understand and adapt to each other\'s nature and life approach.';
    }

    return {
      name: 'Destiny',
      score,
      maxScore: 3,
      description
    };
  }

  /**
   * 4. Yoni Koota - Based on sexual compatibility (4 points)
   */
  private static calculateYoniKoota(personAData: AstrologicalData, personBData: AstrologicalData): KootaScore {
    const personANakshatraInfo = AstrologyService.getNakshatraInfo(personAData.nakshatra);
    const personBNakshatraInfo = AstrologyService.getNakshatraInfo(personBData.nakshatra);

    const yoniA = personANakshatraInfo.yoni;
    const yoniB = personBNakshatraInfo.yoni;

    let score = 0;
    let description = '';

    // Yoni compatibility rules with traditional terminology
    if (yoniA === yoniB) {
      score = 4;
      description = 'Same Yoni - Perfect work influence. Both partners share the same animal nature, ensuring excellent physical and emotional intimacy, strong sexual attraction, and harmonious physical relationship.';
    } else if (this.areYoniCompatible(yoniA, yoniB)) {
      score = 3.5;
      description = 'Compatible Yoni - Very good work influence. The animal natures complement each other well, creating strong physical attraction and satisfying intimate relationship.';
    } else if (this.areYoniNeutral(yoniA, yoniB)) {
      score = 2;
      description = 'Neutral Yoni compatibility - Moderate work influence. The animal natures are neutral to each other, requiring effort to develop physical and emotional intimacy.';
    } else if (this.areYoniPartiallyCompatible(yoniA, yoniB)) {
      score = 1.5;
      description = 'Partial Yoni compatibility - Limited work influence. Some physical attraction exists, but significant effort is needed to develop satisfying intimate relationship.';
    } else if (this.areYoniSlightlyCompatible(yoniA, yoniB)) {
      score = 1;
      description = 'Limited Yoni compatibility - Low work influence. Minimal physical attraction, requiring considerable effort to develop intimate relationship.';
    } else {
      score = 0;
      description = 'Incompatible Yoni - Different animal natures may cause sexual incompatibility. This combination requires significant effort to understand each other\'s physical and emotional needs, and may need professional guidance for intimacy issues.';
    }

    return {
      name: 'Mentality',
      score,
      maxScore: 4,
      description
    };
  }

  /**
   * 5. Graha Maitri Koota - Based on planetary friendship (5 points)
   */
  private static calculateGrahaMaitriKoota(personAData: AstrologicalData, personBData: AstrologicalData): KootaScore {
    const rashiA = personAData.rashi;
    const rashiB = personBData.rashi;

    const rashiInfoA = AstrologyService.getRashiInfo(rashiA);
    const rashiInfoB = AstrologyService.getRashiInfo(rashiB);

    const lordA = rashiInfoA.lord;
    const lordB = rashiInfoB.lord;

    let score = 0;
    let description = '';

    // Graha Maitri compatibility rules with traditional terminology
    if (lordA === lordB) {
      score = 5;
      description = 'Same planetary lord - Perfect work influence. Both partners are ruled by the same planet, ensuring excellent mental compatibility, shared interests, and strong intellectual bonding.';
    } else if (this.arePlanetsFriendly(lordA, lordB)) {
      score = 4;
      description = 'Friendly planets - Good work influence. The planetary lords are friendly to each other, creating good understanding, mutual respect, and harmonious mental relationship.';
    } else if (this.arePlanetsNeutral(lordA, lordB)) {
      score = 2;
      description = 'Neutral planetary relationship - Moderate work influence. The planetary lords are neutral to each other, requiring effort to understand each other\'s mental approach and build intellectual compatibility.';
    } else {
      score = 0;
      description = 'Enemy planets - Poor work influence. The planetary lords are enemies, which may cause mental conflicts, different thinking patterns, and require significant effort to understand and respect each other\'s perspectives.';
    }

    return {
      name: 'Compatibility',
      score,
      maxScore: 5,
      description
    };
  }

  /**
   * 6. Gana Koota - Based on temperament compatibility (6 points)
   */
  private static calculateGanaKoota(personAData: AstrologicalData, personBData: AstrologicalData): KootaScore {
    const personANakshatraInfo = AstrologyService.getNakshatraInfo(personAData.nakshatra);
    const personBNakshatraInfo = AstrologyService.getNakshatraInfo(personBData.nakshatra);

    const ganaA = personANakshatraInfo.gana;
    const ganaB = personBNakshatraInfo.gana;

    let score = 0;
    let description = '';

    // Gana compatibility rules with traditional terminology
    if (ganaA === ganaB) {
      score = 6;
      description = 'Same Gana - Perfect destiny influence. Both partners share the same temperament (Deva/Manushya/Rakshasa), ensuring excellent understanding, similar nature, and harmonious relationship.';
    } else if (
      (ganaA === 'Deva' && ganaB === 'Manushya') ||
      (ganaA === 'Manushya' && ganaB === 'Deva')
    ) {
      score = 5;
      description = 'Deva-Manushya compatibility - Good destiny influence. The divine nature of Deva complements the human nature of Manushya, creating a balanced and harmonious relationship.';
    } else if (
      (ganaA === 'Manushya' && ganaB === 'Rakshasa') ||
      (ganaA === 'Rakshasa' && ganaB === 'Manushya')
    ) {
      score = 4;
      description = 'Manushya-Rakshasa compatibility - Moderate destiny influence. The human nature of Manushya can work with the demonic nature of Rakshasa, but requires understanding and patience.';
    } else {
      score = 0; // Adjusted: Give 0 points for Deva-Rakshasa (aligned with Shaddi.com)
      description = 'Incompatible Gana - Different temperaments may cause conflicts. This combination (Deva-Rakshasa) has fundamentally different natures that may lead to misunderstandings and require significant effort to build compatibility.';
    }

    return {
      name: 'Temperament',
      score,
      maxScore: 6,
      description
    };
  }

  /**
   * 7. Bhakoot Koota - Based on zodiac sign compatibility (7 points)
   */
  private static calculateBhakootKoota(personAData: AstrologicalData, personBData: AstrologicalData): KootaScore {
    const rashiA = personAData.rashi;
    const rashiB = personBData.rashi;

    const rashiIndexA = AstrologyService['RASHIS'].indexOf(rashiA);
    const rashiIndexB = AstrologyService['RASHIS'].indexOf(rashiB);

    let score = 0;
    let description = '';

    // Bhakoot compatibility rules
    const difference = Math.abs(rashiIndexA - rashiIndexB);
    
    if (difference === 0) {
      score = 0;
      description = 'Same sign - Not recommended. Both partners are born under the same zodiac sign, which may cause similar weaknesses and lack of complementary strengths in the relationship.';
    } else if (difference === 1 || difference === 11) {
      score = 7;
      description = 'Adjacent signs - Excellent work influence. The zodiac signs are next to each other, creating excellent understanding, mutual support, and harmonious relationship with complementary qualities.';
    } else if (difference === 2 || difference === 10) {
      score = 5;
      description = 'Good work influence. The zodiac signs have good distance, creating a balanced relationship with good understanding and mutual respect.';
    } else if (difference === 3 || difference === 9) {
      score = 3;
      description = 'Moderate work influence. The zodiac signs have moderate distance, requiring some effort to understand each other\'s nature and build compatibility.';
    } else if (difference === 4 || difference === 8) {
      score = 2;
      description = 'Fair work influence. The zodiac signs have some distance, requiring effort to understand each other\'s approach to life and build a harmonious relationship.';
    } else if (difference === 5 || difference === 7) {
      score = 1; // Adjusted: Give 1 point for distance of 5 (aligned with Shaddi.com)
      description = 'Poor work influence. The zodiac signs have significant distance, requiring considerable effort to understand and adapt to each other\'s nature and life approach.';
    } else {
      score = 0;
      description = 'Opposite signs - Not recommended. The zodiac signs are opposite to each other (6th and 12th house relationship), which may cause fundamental differences and require significant effort to build compatibility.';
    }

    return {
      name: 'Love',
      score,
      maxScore: 7,
      description
    };
  }

  /**
   * 8. Nadi Koota - Based on genetic compatibility (8 points)
   */
  private static calculateNadiKoota(personAData: AstrologicalData, personBData: AstrologicalData): KootaScore {
    const personANakshatraInfo = AstrologyService.getNakshatraInfo(personAData.nakshatra);
    const personBNakshatraInfo = AstrologyService.getNakshatraInfo(personBData.nakshatra);

    const nadiA = personANakshatraInfo.nadi;
    const nadiB = personBNakshatraInfo.nadi;

    let score = 0;
    let description = '';

    // Nadi compatibility rules
    if (nadiA === nadiB) {
      score = 0;
      description = 'Same Nadi - Not recommended (genetic issues). Both partners have the same Nadi, which may cause genetic problems in offspring and is traditionally considered inauspicious for marriage.';
    } else if (
      (nadiA === 'Adi' && nadiB === 'Antya') ||
      (nadiA === 'Antya' && nadiB === 'Adi')
    ) {
      score = 8;
      description = 'Adi-Antya Nadi - Perfect compatibility. The first and last Nadis create excellent genetic compatibility, ensuring healthy offspring and strong physical compatibility.';
    } else if (
      (nadiA === 'Adi' && nadiB === 'Madhya') ||
      (nadiA === 'Madhya' && nadiB === 'Adi')
    ) {
      score = 6;
      description = 'Adi-Madhya Nadi - Good compatibility. The first and middle Nadis create good genetic compatibility, ensuring healthy offspring and satisfactory physical relationship.';
    } else if (
      (nadiA === 'Madhya' && nadiB === 'Antya') ||
      (nadiA === 'Antya' && nadiB === 'Madhya')
    ) {
      score = 6;
      description = 'Madhya-Antya Nadi - Good compatibility. The middle and last Nadis create good genetic compatibility, ensuring healthy offspring and satisfactory physical relationship.';
    } else {
      score = 0;
      description = 'Incompatible Nadi - Different Nadis may cause genetic issues. This combination may lead to genetic problems in offspring and is not recommended for marriage according to traditional Vedic astrology.';
    }

    return {
      name: 'Health',
      score,
      maxScore: 8,
      description
    };
  }

  // Helper methods for compatibility checks
  private static areYoniCompatible(yoniA: string, yoniB: string): boolean {
    const compatiblePairs = [
      ['Horse', 'Elephant'],
      ['Sheep', 'Snake'],
      ['Dog', 'Cat'],
      ['Rat', 'Cow'],
      ['Buffalo', 'Tiger'],
      ['Deer', 'Monkey'],
      ['Lion', 'Crow']
    ];

    return compatiblePairs.some(pair => 
      (pair[0] === yoniA && pair[1] === yoniB) || 
      (pair[1] === yoniA && pair[0] === yoniB)
    );
  }

  private static areYoniNeutral(yoniA: string, yoniB: string): boolean {
    // Define neutral relationships
    return false; // Simplified for now
  }

  private static areYoniPartiallyCompatible(yoniA: string, yoniB: string): boolean {
    // Define partially compatible relationships
    const partiallyCompatiblePairs = [
      ['Horse', 'Snake'],
      ['Elephant', 'Dog'],
      ['Sheep', 'Cat'],
      ['Snake', 'Rat'],
      ['Dog', 'Cow'],
      ['Cat', 'Buffalo'],
      ['Rat', 'Tiger'],
      ['Cow', 'Deer'],
      ['Buffalo', 'Monkey'],
      ['Tiger', 'Lion'],
      ['Deer', 'Crow'],
      ['Monkey', 'Horse'],
      ['Lion', 'Elephant'],
      ['Crow', 'Sheep']
    ];

    return partiallyCompatiblePairs.some(pair => 
      (pair[0] === yoniA && pair[1] === yoniB) || 
      (pair[1] === yoniA && pair[0] === yoniB)
    );
  }

  private static areYoniSlightlyCompatible(yoniA: string, yoniB: string): boolean {
    // Define slightly compatible relationships
    const slightlyCompatiblePairs = [
      ['Horse', 'Dog'],
      ['Elephant', 'Cat'],
      ['Sheep', 'Rat'],
      ['Snake', 'Cow'],
      ['Dog', 'Buffalo'],
      ['Cat', 'Tiger'],
      ['Rat', 'Deer'],
      ['Cow', 'Monkey'],
      ['Buffalo', 'Lion'],
      ['Tiger', 'Crow'],
      ['Deer', 'Horse'],
      ['Monkey', 'Elephant'],
      ['Lion', 'Sheep'],
      ['Crow', 'Snake']
    ];

    return slightlyCompatiblePairs.some(pair => 
      (pair[0] === yoniA && pair[1] === yoniB) || 
      (pair[1] === yoniA && pair[0] === yoniB)
    );
  }

  private static arePlanetsFriendly(lordA: string, lordB: string): boolean {
    const friendlyPairs = [
      ['Sun', 'Moon'],
      ['Sun', 'Mars'],
      ['Sun', 'Jupiter'],
      ['Moon', 'Mercury'],
      ['Moon', 'Venus'],
      ['Mars', 'Jupiter'],
      ['Mars', 'Saturn'],
      ['Mercury', 'Venus'],
      ['Jupiter', 'Saturn']
    ];

    return friendlyPairs.some(pair => 
      (pair[0] === lordA && pair[1] === lordB) || 
      (pair[1] === lordA && pair[0] === lordB)
    );
  }

  private static arePlanetsNeutral(lordA: string, lordB: string): boolean {
    // Define neutral relationships
    return !this.arePlanetsFriendly(lordA, lordB) && lordA !== lordB;
  }

  /**
   * 9. Name Compatibility Koota - Based on name numerology and compatibility (2 points)
   */
  private static calculateNameCompatibilityKoota(personAName: string, personBName: string): KootaScore {
    const nameNumberA = this.calculateNameNumber(personAName);
    const nameNumberB = this.calculateNameNumber(personBName);
    
    let score = 0;
    let description = '';

    // Name number compatibility rules
    const difference = Math.abs(nameNumberA - nameNumberB);
    
    if (nameNumberA === nameNumberB) {
      score = 2;
      description = 'Same Name Number - Perfect name compatibility. Both partners have the same numerological vibration, ensuring excellent understanding and harmony in the relationship.';
    } else if (difference === 1) {
      score = 1.5;
      description = 'Adjacent Name Numbers - Very good name compatibility. The name numbers are close, creating good understanding and mutual respect.';
    } else if (difference === 2) {
      score = 1;
      description = 'Good Name Numbers - Good name compatibility. The name numbers have good distance, creating balanced understanding and compatibility.';
    } else if (difference === 3) {
      score = 0.5;
      description = 'Moderate Name Numbers - Moderate name compatibility. The name numbers have some distance, requiring effort to understand each other\'s nature.';
    } else if (difference === 4) {
      score = 0.5;
      description = 'Limited Name Numbers - Limited name compatibility. The name numbers have significant distance, requiring considerable effort to build understanding.';
    } else {
      score = 0;
      description = 'Incompatible Name Numbers - Different name vibrations may cause misunderstandings. This combination requires significant effort to understand and respect each other\'s nature.';
    }

    return {
      name: 'Name Compatibility',
      score,
      maxScore: 2,
      description
    };
  }

  /**
   * Calculate name number using Vedic numerology
   */
  private static calculateNameNumber(name: string): number {
    const nameWithoutSpaces = name.replace(/\s+/g, '').toLowerCase();
    let total = 0;
    
    for (let i = 0; i < nameWithoutSpaces.length; i++) {
      const char = nameWithoutSpaces[i];
      if (char) {
        const charCode = char.charCodeAt(0) - 96; // Convert to 1-26
        if (charCode >= 1 && charCode <= 26) {
          total += charCode;
        }
      }
    }
    
    // Reduce to single digit
    while (total > 9) {
      total = Math.floor(total / 10) + (total % 10);
    }
    
    return total;
  }
}
