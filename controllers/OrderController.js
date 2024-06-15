import Order from '../models/OrderModel.js';
import Meat from '../models/MeatModel.js';
import moment from "moment-timezone";

export const createOrder = async (req, res) => {
  const { userId, meatId, quantity, shippingAddress } = req.body;

  try {
    // Ambil data meat berdasarkan meatId
    const meat = await Meat.findOne(meatId);
    if (!meat) {
      return res.status(404).json({ msg: 'Meat not found' });
    }

    const unitPrice = meat.price;
    const totalPrice = unitPrice * quantity;
    const items = [{
      meatId,
      name: meat.name,
      unitPrice,
      quantity,
      totalPrice,
      type: meat.type,
      imageUrl: meat.imageUrl,
    }];

    const orderDate = moment().tz("Asia/Jakarta").format();
    const deliveryDate = moment(orderDate).add(1, 'hour').tz("Asia/Jakarta").format();
    
    const order = await Order.create({
      userId,
      items,
      totalPrice,
      shippingAddress,
      status: 'delivering',
      orderDate,
      deliveryDate
    });

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
