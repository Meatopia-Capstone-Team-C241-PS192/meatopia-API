// routes/PredictRoute.js
import express from 'express';
import PredictController from '../controllers/PredictController.js';
import { verifyUser } from '../middleware/AuthUser.js';
import { authenticateJWT } from '../middleware/AuthenticateJWT.js'; // Middleware baru untuk JWT

const router = express.Router();

router.post('/predict', verifyUser, authenticateJWT, PredictController.predict);

export default router;

