import db from '../config/Database.js';
import { v4 as uuidv4 } from 'uuid';

class Order {
  constructor(userId, items, totalPrice, shippingAddress, status, orderDate, deliveryDate) {
    this.id = uuidv4();
    this.userId = userId;
    this.items = items;
    this.totalPrice = totalPrice;
    this.shippingAddress = shippingAddress;
    this.status = status;
    this.orderDate = orderDate;
    this.deliveryDate = deliveryDate;
  }

  static async findByUserIdAndStatus(userId, status) {
    const snapshot = await db.collection('orders').where('userId', '==', userId).where('status', '==', status).get();
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  }

  static async findById(id) {
    const doc = await db.collection('orders').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async create(data) {
    const order = new Order(data.userId, data.items, data.totalPrice, data.shippingAddress, data.status, data.orderDate, data.deliveryDate);
    await db.collection('orders').doc(order.id).set({ ...order });
    return order;
  }

  static async update(id, data) {
    await db.collection('orders').doc(id).update(data);
  }
}

export default Order;
