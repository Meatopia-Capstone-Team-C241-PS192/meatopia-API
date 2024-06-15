import db from '../config/Database.js';

async function storeData(id, data) {
    const predictCollection = db.collection('predictions');
    await predictCollection.doc(id).set(data);
}

export default storeData;

