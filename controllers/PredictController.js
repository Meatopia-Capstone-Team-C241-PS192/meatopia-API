import loadModel from '../services/loadModel.js';
import storeData from '../services/storeData.js';
import ClientError from '../exceptions/ClientError.js';
import * as tf from '@tensorflow/tfjs-node';
import { v4 as uuidv4 } from 'uuid';

class PredictController {
    static async predict(req, res) {
        try {
            if (!req.files || !req.files.image) {
                throw new ClientError('File gambar harus disertakan');
            }

            const id = uuidv4(); // Generate random ID
            const createdAt = new Date().toISOString();
            const model = await loadModel();
            const imageBuffer = req.files.image.data;

            // Proses gambar menjadi tensor
            const tensor = tf.node
                .decodeImage(imageBuffer)
                .resizeNearestNeighbor([224, 224])
                .expandDims()
                .toFloat();

            // Melakukan prediksi menggunakan model
            const prediction = model.predict(tensor);
            const score = await prediction.data();
            const confidenceScore = Math.max(...score) * 100;

            const result = score[0] > 0.5 ? 'Fresh Meat' : 'Spoiled Meat';

            const data = {
                id,
                prediction: result,
                confidence: confidenceScore,
                createdAt
            };

            await storeData(id, data);

            res.status(200).json({
                status: 'success',
                data
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                status: 'fail',
                message: error.message
            });
        }
    }
}

export default PredictController;
