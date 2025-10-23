import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();

// Health check routes
router.get('/health', HealthController.healthCheck);
router.get('/info', HealthController.apiInfo);

export default router;
