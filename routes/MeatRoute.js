import express from "express";
import { deleteMeat, getMeatById, getMeats, saveMeat, updateMeat, getMeatByName } from "../controllers/MeatController.js";
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';
import { authenticateJWT } from '../middleware/AuthenticateJWT.js'; // Middleware baru untuk JWT

const router = express.Router();

router.get('/meats', getMeats);
router.get('/meats/:id', getMeatById);
router.post('/meats', verifyUser, adminOnly, authenticateJWT, saveMeat);
router.patch('/meats/:id', verifyUser, adminOnly, authenticateJWT, updateMeat);
router.delete('/meats/:id', verifyUser, adminOnly, authenticateJWT, deleteMeat);
router.get('/meats/name/:name', getMeatByName);

export default router;
