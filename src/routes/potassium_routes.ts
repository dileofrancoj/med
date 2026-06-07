import { Router } from 'express';
import * as potassiumHandler from '../handlers/potassium_handler';

const router = Router();

router.get('/potassium/classify', potassiumHandler.classifyPotassium);
router.post('/potassium/rapid-correction', potassiumHandler.calculateRapidCorrection);
router.post('/potassium/maintenance', potassiumHandler.calculateMaintenance);

export default router;
