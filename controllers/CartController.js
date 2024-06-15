import Cart from '../models/CartModel.js';
import Meat from '../models/MeatModel.js';
import Order from '../models/OrderModel.js';
import moment from 'moment-timezone';

export const addToCart = async (req, res) => {
  const { userId, meatId, quantity } = req.body;

  try {
    const meat = await Meat.findOne(meatId);
    if (!meat) {
      return res.status(404).json({ msg: 'Meat not found' });
    }

    const unitPrice = meat.price;
    const item = {
      meatId,
      name: meat.name,
      unitPrice,
      quantity,
      totalPrice: unitPrice * quantity,
      type: meat.type,
      imageUrl: meat.imageUrl,
    };

    let cart = await Cart.findByUserId(userId);
    if (!cart) {
      cart = await Cart.create({ userId, items: [item] });
    } else {
      const itemIndex = cart.items.findIndex(cartItem => cartItem.meatId === meatId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * unitPrice;
      } else {
        cart.items.push(item);
      }
      await Cart.update(cart.id, { items: cart.items });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findByUserId(userId);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { userId, meatId, quantity } = req.body;

  try {
    const cart = await Cart.findByUserId(userId);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.meatId === meatId);
    if (itemIndex > -1) {
      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].totalPrice = cart.items[itemIndex].unitPrice * quantity;
      }
      await Cart.update(cart.id, { items: cart.items });
      res.status(200).json(cart);
    } else {
      res.status(404).json({ msg: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  const { userId, meatId } = req.body;

  try {
    const cart = await Cart.findByUserId(userId);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.meatId === meatId);
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await Cart.update(cart.id, { items: cart.items });
      res.status(200).json(cart);
    } else {
      res.status(404).json({ msg: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findByUserId(userId);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    cart.items = [];
    await Cart.update(cart.id, { items: cart.items });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const checkoutCart = async (req, res) => {
  const { userId, shippingAddress } = req.body;

  try {
    const cart = await Cart.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ msg: 'Cart is empty' });
    }

    const items = cart.items;
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const orderDate = moment().tz("Asia/Jakarta").format();
    const deliveryDate = moment(orderDate).add(1, 'hour').tz("Asia/Jakarta").format();

    const order = await Order.create({ userId, items, totalPrice, shippingAddress, status: 'delivering', orderDate, deliveryDate });

    await Cart.clearCart(userId);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
