// import { Store } from 'express-session';
// import db from '../config/Database.js';

// class FirestoreStore extends Store {
//   constructor(options) {
//     super();
//     this.collection = db.collection('sessions');
//   }

//   async get(sid, callback) {
//     try {
//       const doc = await this.collection.doc(sid).get();
//       if (!doc.exists) return callback(null, null);
//       return callback(null, doc.data());
//     } catch (err) {
//       return callback(err);
//     }
//   }

//   async set(sid, session, callback) {
//     try {
//       const plainSession = JSON.parse(JSON.stringify(session));
//       await this.collection.doc(sid).set(plainSession);
//       return callback(null);
//     } catch (err) {
//       return callback(err);
//     }
//   }

//   async destroy(sid, callback) {
//     try {
//       await this.collection.doc(sid).delete();
//       return callback(null);
//     } catch (err) {
//       return callback(err);
//     }
//   }
// }

// export default FirestoreStore;
