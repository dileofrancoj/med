import { Router } from 'express';
import * as potassiumHandler from '../handlers/potassium_handler';
import { validate } from '../utils/validate_middleware';
import {
  classifyPotassiumSchema,
  rapidCorrectionSchema,
  maintenanceSchema,
} from './schemas/potassium/potassium_schemas';

const router = Router();

router.get(
  '/potassium/classify',
  validate(classifyPotassiumSchema),
  potassiumHandler.classifyPotassium,
);
router.post(
  '/potassium/rapid-correction',
  validate(rapidCorrectionSchema),
  potassiumHandler.calculateRapidCorrection,
);
router.post(
  '/potassium/maintenance',
  validate(maintenanceSchema),
  potassiumHandler.calculateMaintenance,
);

export default router;
