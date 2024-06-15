import Users from '../models/UserModel.js';
import argon2 from 'argon2';

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
