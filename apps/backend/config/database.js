import mongoose from 'mongoose';

export async function connectDatabase() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('MONGODB_URI не установлен в переменных окружения');
        process.exit(1);
    }
    await mongoose.connect(mongoUri);
}

