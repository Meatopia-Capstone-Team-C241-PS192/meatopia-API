import express from 'express';
import { addToCart, getCart, removeCartItem, clearCart, updateCartItem, checkoutCart } from '../controllers/CartController.js';
import { authenticateJWT } from '../middleware/AuthenticateJWT.js'; // Middleware baru untuk JWT

const router = express.Router();

router.post('/cart', authenticateJWT, addToCart);
router.get('/cart/:userId', authenticateJWT, getCart);
router.delete('/cart', authenticateJWT, removeCartItem);
router.delete('/cart/:userId/clear', authenticateJWT, clearCart);
router.patch('/cart', authenticateJWT, updateCartItem);
router.post('/cart/checkout', authenticateJWT, checkoutCart);

export default router;
