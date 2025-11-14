import 'dotenv/config';
import { connectDatabase } from '../config/database.js';
import { User } from '../models/User.js';

async function createAdmin() {
    try {
        await connectDatabase();

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log('Администратор уже существует');
            process.exit(0);
        }

        const admin = await User.create({
            email,
            password,
            role: 'admin',
        });

        console.log('Администратор создан:', {
            id: admin.id,
            email: admin.email,
            role: admin.role,
        });

        process.exit(0);
    } catch (error) {
        console.error('Ошибка при создании администратора:', error);
        process.exit(1);
    }
}

createAdmin();
