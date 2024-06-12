// controllers/CartController.js
import Cart from '../models/CartModel.js';

export const addToCart = async (req, res) => {
  const { userId, item } = req.body;
  try {
    let cart = await Cart.findByUserId(userId);
    if (!cart) {
      cart = await Cart.create({ userId, items: [item] });
    } else {
      const itemIndex = cart.items.findIndex(cartItem => cartItem.meatId === item.meatId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += item.quantity;
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
    res.status500().json({ msg: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { userId, meatId, quantity } = req.body;

  try {
    const cart = await Cart.findByUserId(userId);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.meatId === meatId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
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
