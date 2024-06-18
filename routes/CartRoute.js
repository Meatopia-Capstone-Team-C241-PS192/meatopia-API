import express from 'express';
import { addToCart, getCart, removeCartItem, clearCart, updateCartItem, checkoutCart } from '../controllers/CartController.js';
import { verifyUser } from '../middleware/AuthUser.js';
import { authenticateJWT } from '../middleware/AuthenticateJWT.js'; // Middleware baru untuk JWT

const router = express.Router();

router.post('/cart', verifyUser, authenticateJWT, addToCart);
router.get('/cart/:userId', verifyUser, authenticateJWT, getCart);
router.delete('/cart', verifyUser, authenticateJWT, removeCartItem);
router.delete('/cart/:userId/clear', verifyUser, authenticateJWT, clearCart);
router.patch('/cart', verifyUser, authenticateJWT, updateCartItem);
router.post('/cart/checkout', verifyUser, authenticateJWT, checkoutCart);

export default router;
