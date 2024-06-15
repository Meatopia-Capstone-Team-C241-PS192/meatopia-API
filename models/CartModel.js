import db from '../config/Database.js';

const cartCollection = db.collection('carts');

const Cart = {
  findByUserId: async (userId) => {
    const userCartRef = cartCollection.doc(userId);
    const cartDoc = await userCartRef.get();
    if (cartDoc.exists) {
      return { id: cartDoc.id, ...cartDoc.data() };
    } else {
      return null;
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
            return null; // Tandai item untuk dihapus
          }
          item.totalPrice = item.unitPrice * quantity;
          return { ...item, quantity };
        }
        return item;
      }).filter(item => item !== null); // Hapus item yang ditandai

      await userCartRef.update({ items: updatedItems });
    }
  },
  delete: async (id) => {
    const userCartRef = cartCollection.doc(id);
    await userCartRef.delete();
  }
};

export default Cart;
