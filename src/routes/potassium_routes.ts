import { Router } from 'express';
import * as potassiumHandler from '../handlers/potassium_handler';
import { validate } from '../utils/validate_middleware';
import {
  classifyPotassiumSchema,
  potassiumCalculateSchema,
} from './schemas/potassium/potassium_schemas';

const router = Router();

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
