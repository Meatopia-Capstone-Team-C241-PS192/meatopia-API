import db from '../config/Database.js';

const usersCollection = db.collection('users');

const Users = {
  findOne: async (query) => {
    console.log('Query:', query);
    const snapshot = await usersCollection.where('email', '==', query.email).get();
    if (snapshot.empty) {
      return null;
    }
    let user;
    snapshot.forEach(doc => {
      user = { id: doc.id, ...doc.data() };
    });
    return user;
  },
  findById: async (id) => {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  },
  create: async (data) => {
    const docRef = await usersCollection.add(data);
    return { id: docRef.id, ...data };
  },
  update: async (id, data) => {
    await usersCollection.doc(id).update(data);
    return { id, ...data };
  },
  delete: async (id) => {
    await usersCollection.doc(id).delete();
  },
  findAll: async () => {
    const snapshot = await usersCollection.get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  }
};

export default Users;
