import express from "express";
import { deleteMeat, getMeatById, getMeats, saveMeat, updateMeat } from "../controllers/MeatController.js";

const router = express.Router()

router.get('/meats', getMeats)
router.get('/meats/:id', getMeatById)
router.post('/meats', saveMeat)
router.patch('/meats/:id', updateMeat)
router.delete('/meats/:id', deleteMeat)

export default router