import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        address: {
            city: { type: String, required: true },
            street: { type: String, required: true },
        },
        price: { type: Number, required: true },
        guests: { type: Number, required: true },
        rooms: { type: Number, required: true },
        photos: { type: [String], default: [] },
        description: { type: String, default: '' },
        coords: {
            lat: { type: Number },
            lng: { type: Number },
        },
    },
    { timestamps: true }
);

propertySchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export const Property = mongoose.model('Property', propertySchema);

