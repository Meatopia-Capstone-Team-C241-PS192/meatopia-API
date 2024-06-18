import express from 'express';
import { createOrder, getOrderHistory, updateOrderStatus } from '../controllers/OrderController.js';
import { verifyUser } from '../middleware/AuthUser.js';
import { authenticateJWT } from '../middleware/AuthenticateJWT.js'; // Middleware baru untuk JWT

const router = express.Router();

router.post('/order', verifyUser, authenticateJWT, createOrder);
router.get('/order/history/:userId', verifyUser, authenticateJWT, getOrderHistory);
router.patch('/order/:orderId/status', verifyUser, authenticateJWT, updateOrderStatus);

export default router;
