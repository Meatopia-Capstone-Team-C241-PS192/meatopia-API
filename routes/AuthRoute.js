import express from 'express';
import { Login, Logout, Me, updateProfile } from '../controllers/AuthController.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.patch('/me', verifyUser, updateProfile); // Route baru untuk update profil
router.delete('/logout', Logout);

export default router;
