import mongoose from 'mongoose';

export function parsePropertyId(raw) {
    const id = String(raw);
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { by: '_id', value: id };
    }
    return { by: 'id', value: id };
}
