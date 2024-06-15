import express from 'express';
import { createOrder, getOrderHistory, updateOrderStatus } from '../controllers/OrderController.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.post('/order', verifyUser, createOrder);
router.get('/order/history/:userId', verifyUser, getOrderHistory);
router.patch('/order/:orderId/status', verifyUser, updateOrderStatus);

export default router;
