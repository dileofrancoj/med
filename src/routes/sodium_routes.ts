import { Router } from 'express';
import * as sodiumHandler from '../handlers/sodium_handler';

const router = Router();

router.get('/sodium/classify', sodiumHandler.classifySodium);
router.post('/sodium/rapid-correction', sodiumHandler.calculateRapidCorrection);
router.post('/sodium/slow-correction', sodiumHandler.calculateSlowCorrection);

export default router;
