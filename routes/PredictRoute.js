import express from 'express';
import PredictController from '../controllers/PredictController.js';

const router = express.Router();

router.post('/predict', PredictController.predict);

export default router;

