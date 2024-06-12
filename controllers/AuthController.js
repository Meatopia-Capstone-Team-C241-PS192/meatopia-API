import Users from '../models/UserModel.js';
import argon2 from 'argon2';

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

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Mohon login ke akun anda' });
  }
  const user = await Users.findById(req.session.userId);
  if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
  res.status(200).json(user);
};

export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: 'Tidak dapat logout' });
    res.status(200).json({ msg: 'Anda telah logout' });
  });
};
