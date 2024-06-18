import loadModel from '../services/loadModel.js';
import storeData from '../services/storeData.js';
import ClientError from '../exceptions/ClientError.js';
import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
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

            // Resize image to the expected shape [100, 100]
            const resizedImageBuffer = await sharp(imageBuffer)
                .resize(100, 100)
                .toFormat('jpg')
                .toBuffer();

            // Log the size and shape of resized image buffer
            console.log('Resized Image Buffer Length:', resizedImageBuffer.length);

            // Decode image to tensor
            let tensor = tf.node.decodeImage(resizedImageBuffer, 3); // Ensure it decodes to a 3-channel image
            console.log('Tensor shape after decodeImage:', tensor.shape);

            // Further process the tensor
            tensor = tensor.expandDims(0).toFloat().div(tf.scalar(255)); // Normalize pixel values and expand dimensions
            console.log('Tensor shape after expandDims and normalization:', tensor.shape);

            // Ensure the tensor shape is correct
            if (tensor.shape.length !== 4 || tensor.shape[1] !== 100 || tensor.shape[2] !== 100 || tensor.shape[3] !== 3) {
                throw new Error(`Invalid tensor shape: ${tensor.shape}. Expected [1, 100, 100, 3]`);
            }

            // Predict using the model
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
            console.error('Error during prediction:', error); // Log error for debugging
            res.status(error.statusCode || 500).json({
                status: 'fail',
                message: error.message
            });
        }
    }
}

export default PredictController;



