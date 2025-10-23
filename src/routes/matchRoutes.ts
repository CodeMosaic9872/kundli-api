import { Router } from 'express';
import { MatchController } from '../controllers/matchController';

const router = Router();

// Match calculation routes
router.post('/match', MatchController.calculateMatch);
router.post('/match/analysis/:kootaName', MatchController.getKootaAnalysis);
router.post('/match/suggestions', MatchController.getCompatibilitySuggestions);
router.post('/match/summary', MatchController.getMatchSummary);

export default router;
