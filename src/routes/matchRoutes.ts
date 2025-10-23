import { Router } from 'express';
import { MatchController } from '../controllers/matchController';

const router = Router();

// Match calculation routes
router.post('/match', MatchController.calculateMatch);
router.post('/match/analysis/:kootaName', MatchController.getKootaAnalysis);
router.post('/match/suggestions', MatchController.getCompatibilitySuggestions);
router.post('/match/summary', MatchController.getMatchSummary);

// Enhanced match routes with Dasha and transit analysis
router.post('/match/enhanced', MatchController.calculateEnhancedMatch);
router.post('/match/comprehensive', MatchController.getComprehensiveAnalysis);

export default router;
