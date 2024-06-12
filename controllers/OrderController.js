import Order from "../models/OrderModel.js";
import moment from "moment-timezone";

export const createOrder = async (req, res) => {
  const { userId, items, totalPrice, shippingAddress } = req.body;
  const orderDate = moment().tz("Asia/Jakarta").format();
  const deliveryDate = moment(orderDate).add(1, 'hour').tz("Asia/Jakarta").format();
  
  try {
    const order = await Order.create({ userId, items, totalPrice, shippingAddress, status: 'delivering', orderDate, deliveryDate });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOrderHistory = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;

  try {
    const orders = await Order.findByUserIdAndStatus(userId, status);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    await Order.update(orderId, { status });
    res.status(200).json({ msg: "Order status updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
