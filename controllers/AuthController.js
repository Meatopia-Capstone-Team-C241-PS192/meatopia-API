import Users from '../models/UserModel.js';
import argon2 from 'argon2';
import path from 'path';
import { profilePictureBucket } from '../config/Storage.js';

// Fungsi untuk login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Email:', email, 'Password:', password);

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const user = await Users.findOne({ email: email });
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });

    const match = await argon2.verify(user.password, password);
    if (!match) return res.status(400).json({ msg: 'Wrong Password' });

    req.session.userId = user.id;
    const { id, name, role } = user;
    res.status(200).json({ id, name, email, role });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan data diri pengguna yang sedang login
export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Mohon login ke akun anda' });
  }
  const user = await Users.findById(req.session.userId);
  if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
  res.status(200).json(user);
};

// Fungsi untuk logout
export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: 'Tidak dapat logout' });
    res.status(200).json({ msg: 'Anda telah logout' });
  });
};

// Fungsi untuk memperbarui profil pengguna
export const updateProfile = async (req, res) => {
  const user = await Users.findById(req.session.userId);
  if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });

  const { name, email, phone, address, password, confPassword } = req.body;
  let hashPassword;
  if (!password) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword) return res.status(400).json({ msg: 'Password dan Confirm password tidak cocok' });

  let profileImageUrl = user.profileImageUrl;
  if (req.files && req.files.file) {
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
      profileImageUrl = `https://storage.googleapis.com/${profilePictureBucket.name}/${fileName}`;
      try {
        await Users.update(user.id, {
          name,
          email,
          phone,
          address,
          password: hashPassword,
          profileImageUrl
        });
        res.status(200).json({ msg: 'Update Berhasil', profileImageUrl });
      } catch (error) {
        res.status(400).json({ msg: error.message });
      }
    });

    blobStream.end(file.data);
  } else {
    try {
      await Users.update(user.id, {
        name,
        email,
        phone,
        address,
        password: hashPassword
      });
      res.status(200).json({ msg: 'Update Berhasil', profileImageUrl });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
};
