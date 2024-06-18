// services/loadModel.js
import * as tf from '@tensorflow/tfjs-node';
import dotenv from 'dotenv';

dotenv.config();

async function loadModel() {
    console.log('Loading model...');
    console.log(process.env.MODEL_URL);
    const model = await tf.loadGraphModel(process.env.MODEL_URL);
    console.log('Model loaded successfully');
    return model;
}

export default loadModel;



