import db from '../config/Database.js';
import { v4 as uuidv4 } from 'uuid';

class Meat {
  constructor(name, description, price, quantityAvailable, type, imageUrl) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantityAvailable = quantityAvailable;
    this.type = type;
    this.imageUrl = imageUrl;
  }

  static async findAll() {
    const meats = [];
    const snapshot = await db.collection('meats').get();
    snapshot.forEach((doc) => {
      meats.push({ id: doc.id, ...doc.data() });
    });
    return meats;
  }

  static async findOne(id) {
    const doc = await db.collection('meats').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async create(data) {
    const meat = new Meat(data.name, data.description, data.price, data.quantityAvailable, data.type, data.imageUrl);
    await db.collection('meats').doc(meat.id).set({ ...meat });
    return meat;
  }

  static async update(id, data) {
    await db.collection('meats').doc(id).update(data);
  }

  static async delete(id) {
    await db.collection('meats').doc(id).delete();
  }
}

export default Meat;
