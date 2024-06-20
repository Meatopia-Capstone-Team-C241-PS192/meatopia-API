import Meat from "../models/MeatModel.js";
import path from "path";
import { meatBucket } from '../config/Storage.js';

export const getMeats = async (req, res) => {
  try {
    const response = await Meat.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getMeatById = async (req, res) => {
  try {
    const response = await Meat.findOne(req.params.id);
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveMeat = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
  const { name, description, price, quantityAvailable, type } = req.body;
  const file = req.files.file;
  const ext = path.extname(file.name);
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' });
  if (file.size > 5000000) return res.status(422).json({ msg: 'Image must be less than 5MB' });

  const fileName = `${file.md5}${ext}`;
  const blob = meatBucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err) => {
    res.status(500).json({ msg: err.message });
  });

  blobStream.on('finish', async () => {
    const imageUrl = `https://storage.googleapis.com/${meatBucket.name}/${fileName}`;
    try {
      await Meat.create({ name, description, price, quantityAvailable, type, imageUrl });
      res.status(201).json({ msg: "Meat Image Created Successfully" });
    } catch (error) {
      console.log(error.message);
    }
  });

  blobStream.end(file.data);
};

export const updateMeat = async (req, res) => {
  try {
    const meat = await Meat.findOne(req.params.id);
    if (!meat) return res.status(404).json({ msg: "Data not Found" });

    let fileName = meat.imageUrl.split('/').pop();
    if (req.files != null) {
      const file = req.files.file;
      const ext = path.extname(file.name);
      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' });
      if (file.size > 5000000) return res.status(422).json({ msg: 'Image must be less than 5MB' });

      const oldBlob = meatBucket.file(fileName);
      await oldBlob.delete();

      fileName = `${file.md5}${ext}`;
      const newBlob = meatBucket.file(fileName);
      const blobStream = newBlob.createWriteStream({
        resumable: false,
      });

      blobStream.on('error', (err) => {
        res.status(500).json({ msg: err.message });
      });

      blobStream.end(file.data);
    }

    const { name, description, price, quantityAvailable, type } = req.body;
    const imageUrl = `https://storage.googleapis.com/${meatBucket.name}/${fileName}`;
    await Meat.update(req.params.id, { name, description, price, quantityAvailable, type, imageUrl });
    res.status(200).json({ msg: "Data Updated Successfully" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteMeat = async (req, res) => {
  try {
    const meat = await Meat.findOne(req.params.id);
    if (!meat) return res.status(404).json({ msg: "Data not Found" });

    const fileName = meat.imageUrl.split('/').pop();
    const blob = meatBucket.file(fileName);
    await blob.delete();

    await Meat.delete(req.params.id);
    res.status(200).json({ msg: "Meat Image Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
  }
};

export const getMeatByName = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const response = await Meat.findByName(name);
    if (response.length === 0) {
      return res.status(404).json({ msg: 'No meat found with the given name' });
    }
    res.json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};
