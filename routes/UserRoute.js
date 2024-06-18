import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/UserController.js';
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';
import { authenticateJWT } from '../middleware/AuthenticateJWT.js'; // Middleware baru untuk JWT

const router = express.Router();

router.get('/users', verifyUser, adminOnly, authenticateJWT, getUsers);
router.get('/users/:id', verifyUser, adminOnly, authenticateJWT, getUserById);
router.post('/users', createUser);
router.patch('/users/:id', verifyUser, adminOnly, authenticateJWT, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, authenticateJWT, deleteUser);

export default router;
