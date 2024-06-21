import express from 'express';
import { createOrder, getOrderHistory, updateOrderStatus } from '../controllers/OrderController.js';
import { authenticateJWT } from '../middleware/AuthenticateJWT.js'; // Middleware baru untuk JWT

const router = express.Router();

router.post('/order', authenticateJWT, createOrder);
router.get('/order/history/:userId', authenticateJWT, getOrderHistory);
router.patch('/order/:orderId/status', authenticateJWT, updateOrderStatus);

export default router;
