import express from 'express';
import { Login, Logout, Me, updateProfile } from '../controllers/AuthController.js';
import { authenticateJWT } from '../middleware/AuthenticateJWT.js'; // Middleware baru untuk JWT

const router = express.Router();

router.get('/me', authenticateJWT, Me);
router.post('/login', Login);
router.patch('/me', authenticateJWT, updateProfile); // Route baru untuk update profil
router.delete('/logout', authenticateJWT, Logout);

export default router;
