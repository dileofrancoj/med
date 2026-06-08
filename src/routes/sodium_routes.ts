import { Router } from 'express';
import * as sodiumHandler from '../handlers/sodium_handler';
import { validate } from '../utils/validate_middleware';
import {
  classifySodiumSchema,
  rapidCorrectionSodiumSchema,
  slowCorrectionSodiumSchema,
} from './schemas/sodium/sodium_schemas';

const router = Router();

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
