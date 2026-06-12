import { Router } from 'express';
import { SodiumHandler } from '../handlers/sodium_handler';
import { SodiumService } from '../services/sodium_service';
import { validate } from '../utils/validate_middleware';
import {
  classifySodiumSchema,
  rapidCorrectionSodiumSchema,
  slowCorrectionSodiumSchema,
} from './schemas/sodium/sodium_schemas';

const router = Router();
const sodiumService = new SodiumService();
const sodiumHandler = new SodiumHandler(sodiumService);

router.get('/sodium/classify', validate(classifySodiumSchema), sodiumHandler.classifySodium);
router.post(
  '/sodium/rapid-correction',
  validate(rapidCorrectionSodiumSchema),
  sodiumHandler.calculateRapidCorrection,
);
router.post(
  '/sodium/slow-correction',
  validate(slowCorrectionSodiumSchema),
  sodiumHandler.calculateSlowCorrection,
);

export default router;
