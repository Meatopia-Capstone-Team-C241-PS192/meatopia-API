import express from 'express';
import { Login, Logout, Me, updateProfile } from '../controllers/AuthController.js';
import { verifyUser } from '../middleware/AuthUser.js';
import { authenticateJWT } from '../middleware/AuthenticateJWT.js'; // Middleware baru untuk JWT

const router = express.Router();

router.get('/me', verifyUser, authenticateJWT, Me);
router.post('/login', Login);
router.patch('/me', verifyUser, authenticateJWT, updateProfile); // Route baru untuk update profil
router.delete('/logout', Logout);

export default router;
