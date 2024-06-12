// routes/CartRoute.js
import express from 'express';
import { addToCart, getCart, removeCartItem, clearCart, updateCartItem } from '../controllers/CartController.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.post('/cart', verifyUser, addToCart);
router.get('/cart/:userId', verifyUser, getCart);
router.delete('/cart', verifyUser, removeCartItem);
router.delete('/cart/:userId/clear', verifyUser, clearCart);
router.patch('/cart', verifyUser, updateCartItem);

export default router;
