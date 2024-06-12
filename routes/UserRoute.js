import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadProfilePicture
} from '../controllers/UserController.js';
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.post('/users', createUser);
router.patch('/users/:id', verifyUser, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);
router.post('/users/profile-picture', verifyUser, uploadProfilePicture);

export default router;
