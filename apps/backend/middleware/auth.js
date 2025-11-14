import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Недействительный токен' });
    }
}

export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res
            .status(403)
            .json({ error: 'Требуются права администратора' });
    }
    next();
}
