import { Request, Response } from 'express';
import { MatchService } from '../services/matchService';
import { ApiResponse, MatchRequest, MatchResult } from '../types';
import { ErrorHandler } from '../middleware/errorHandler';

export class MatchController {
  /**
   * Calculate match compatibility between two persons
   */
  static calculateMatch = ErrorHandler.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { personA, personB }: MatchRequest = req.body;

    // Validate request body
    if (!personA || !personB) {
      const response: ApiResponse = {
        success: false,
        error: 'Both personA and personB are required',
        message: 'Please provide birth details for both persons'
      };
      res.status(400).json(response);
      return;
    }

    // Calculate match
    const matchResult = await MatchService.calculateMatch(personA, personB);

    const response: ApiResponse<MatchResult> = {
      success: true,
      data: matchResult,
      message: 'Match calculation completed successfully'
    };

    res.status(200).json(response);
  });

  /**
   * Get detailed analysis of a specific Koota
   */
  static getKootaAnalysis = ErrorHandler.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { kootaName } = req.params;
    const { personA, personB }: MatchRequest = req.body;

    if (!personA || !personB) {
      const response: ApiResponse = {
        success: false,
        error: 'Both personA and personB are required',
        message: 'Please provide birth details for both persons'
      };
      res.status(400).json(response);
      return;
    }

    if (!kootaName) {
      const response: ApiResponse = {
        success: false,
        error: 'Koota name is required',
        message: 'Please specify which Koota to analyze'
      };
      res.status(400).json(response);
      return;
    }

    // Calculate match first to get astrological data
    const matchResult = await MatchService.calculateMatch(personA, personB);
    
    // Get specific Koota analysis
    const kootaAnalysis = MatchService.getKootaAnalysis(
      kootaName,
      matchResult.personADetails as any, // Type assertion for now
      matchResult.personBDetails as any
    );

    const response: ApiResponse = {
      success: true,
      data: kootaAnalysis,
      message: `Analysis for ${kootaName} Koota completed successfully`
    };

    res.status(200).json(response);
  });

  /**
   * Get compatibility suggestions
   */
  static getCompatibilitySuggestions = ErrorHandler.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { personA, personB }: MatchRequest = req.body;

    if (!personA || !personB) {
      const response: ApiResponse = {
        success: false,
        error: 'Both personA and personB are required',
        message: 'Please provide birth details for both persons'
      };
      res.status(400).json(response);
      return;
    }

    // Calculate match
    const matchResult = await MatchService.calculateMatch(personA, personB);
    
    // Get suggestions
    const suggestions = MatchService.getCompatibilitySuggestions(matchResult);

    const response: ApiResponse<{ suggestions: string[]; matchSummary: any }> = {
      success: true,
      data: {
        suggestions,
        matchSummary: MatchService.getMatchSummary(matchResult)
      },
      message: 'Compatibility suggestions generated successfully'
    };

    res.status(200).json(response);
  });

  /**
   * Get match summary
   */
  static getMatchSummary = ErrorHandler.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { personA, personB }: MatchRequest = req.body;

    if (!personA || !personB) {
      const response: ApiResponse = {
        success: false,
        error: 'Both personA and personB are required',
        message: 'Please provide birth details for both persons'
      };
      res.status(400).json(response);
      return;
    }

    // Calculate match
    const matchResult = await MatchService.calculateMatch(personA, personB);
    
    // Get summary
    const summary = MatchService.getMatchSummary(matchResult);

    const response: ApiResponse = {
      success: true,
      data: summary,
      message: 'Match summary generated successfully'
    };

    res.status(200).json(response);
  });
}