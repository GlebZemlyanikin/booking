import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: 'Email и пароль обязательны' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Неверные учетные данные' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Доступ запрещен' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (error) {
        next(error);
    }
}

export async function verify(req, res) {
    res.json({ user: req.user, authenticated: true });
}
