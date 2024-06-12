// models/CartModel.js
import db from '../config/Database.js';

const cartCollection = db.collection('carts');

const Cart = {
  addItem: async (userId, item) => {
    const userCartRef = cartCollection.doc(userId);
    const cartDoc = await userCartRef.get();
    if (cartDoc.exists) {
      const cartData = cartDoc.data();
      const items = cartData.items || [];
      items.push(item);
      await userCartRef.update({ items });
    } else {
      await userCartRef.set({ items: [item] });
    }
  },
  getCart: async (userId) => {
    const userCartRef = cartCollection.doc(userId);
    const cartDoc = await userCartRef.get();
    if (cartDoc.exists) {
      return cartDoc.data().items;
    } else {
      return [];
    }
  },
  findByUserId: async (userId) => {
    const userCartRef = cartCollection.doc(userId);
    const cartDoc = await userCartRef.get();
    if (cartDoc.exists) {
      return { id: cartDoc.id, ...cartDoc.data() };
    } else {
      return null;
    }
  },
  removeItem: async (userId, itemId) => {
    const userCartRef = cartCollection.doc(userId);
    const cartDoc = await userCartRef.get();
    if (cartDoc.exists) {
      const items = cartDoc.data().items;
      const updatedItems = items.filter(item => item.meatId !== itemId);
      await userCartRef.update({ items: updatedItems });
    }
  },
  clearCart: async (userId) => {
    const userCartRef = cartCollection.doc(userId);
    await userCartRef.set({ items: [] });
  },
  updateItemQuantity: async (userId, itemId, quantity) => {
    const userCartRef = cartCollection.doc(userId);
    const cartDoc = await userCartRef.get();
    if (cartDoc.exists) {
      const items = cartDoc.data().items;
      const updatedItems = items.map(item => {
        if (item.meatId === itemId) {
          if (quantity === 0) {
            return null; // Mark item for removal
          }
          return { ...item, quantity };
        }
        return item;
      }).filter(item => item !== null); // Remove marked items

      await userCartRef.update({ items: updatedItems });
    }
  },
  create: async (data) => {
    const userCartRef = cartCollection.doc(data.userId);
    await userCartRef.set({ items: data.items });
    return { id: userCartRef.id, ...data };
  },
  update: async (id, data) => {
    const userCartRef = cartCollection.doc(id);
    await userCartRef.update(data);
  },
  delete: async (id) => {
    const userCartRef = cartCollection.doc(id);
    await userCartRef.delete();
  }
};

export default Cart;
