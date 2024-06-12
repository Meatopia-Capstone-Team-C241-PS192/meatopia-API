import Users from '../models/UserModel.js';
import argon2 from 'argon2';
import path from 'path';
import { profilePictureBucket } from '../config/Storage.js';

// Fungsi untuk mengunggah gambar profil
export const uploadProfilePicture = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;
  const ext = path.extname(file.name);
  const allowedTypes = ['.png', '.jpg', '.jpeg'];

  if (!allowedTypes.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: 'Invalid image format' });
  }

  if (file.size > 5000000) { // Batasan ukuran file 5MB
    return res.status(422).json({ msg: 'Image must be less than 5MB' });
  }

  const fileName = `${file.md5}${ext}`;
  const blob = profilePictureBucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false
  });

  blobStream.on('error', (err) => {
    res.status(500).json({ msg: err.message });
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${profilePictureBucket.name}/${fileName}`;
    try {
      const user = await Users.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      await Users.update(user.id, { profileImageUrl: publicUrl });
      res.status(200).json({ msg: "Profile image updated successfully", profileImageUrl: publicUrl });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });

  blobStream.end(file.data);
};

// Fungsi untuk mendapatkan semua pengguna
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan pengguna berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk membuat pengguna baru
export const createUser = async (req, res) => {
  const { name, email, phone, address, password, confPassword, role } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: 'Password dan Confirm password tidak cocok' });

  const hashPassword = await argon2.hash(password);
  try {
    const newUser = await Users.create({
      name,
      email,
      phone,
      address,
      password: hashPassword,
      role
    });
    res.status(201).json({ msg: 'Register Berhasil', user: newUser });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Fungsi untuk memperbarui pengguna
export const updateUser = async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });

  const { name, email, phone, address, password, confPassword, role } = req.body;
  let hashPassword;
  if (!password) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword) return res.status(400).json({ msg: 'Password dan Confirm password tidak cocok' });

  try {
    const updatedUser = await Users.update(user.id, {
      name,
      email,
      phone,
      address,
      password: hashPassword,
      role
    });
    res.status(200).json({ msg: 'Update Berhasil', user: updatedUser });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Fungsi untuk menghapus pengguna
export const deleteUser = async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });

  try {
    await Users.delete(user.id);
    res.status(200).json({ msg: 'User Deleted' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
