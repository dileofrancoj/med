import { Router } from 'express';
import { PotassiumHandler } from '../handlers/potassium_handler';
import { PotassiumService } from '../services/potassium_service';
import { validate } from '../utils/validate_middleware';
import {
  classifyPotassiumSchema,
  potassiumCalculateSchema,
} from './schemas/potassium/potassium_schemas';

const router = Router();
const potassiumService = new PotassiumService();
const potassiumHandler = new PotassiumHandler(potassiumService);

router.get(
  '/potassium/classify',
  validate(classifyPotassiumSchema),
  potassiumHandler.classifyPotassium,
);

router.post(
  '/potassium/calculate',
  validate(potassiumCalculateSchema),
  potassiumHandler.calculatePotassium,
);

export default router;
