import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: true,
        },
        from: { type: Date, required: true },
        to: { type: Date, required: true },
        guests: { type: Number, required: true, min: 1 },
        nights: { type: Number, required: true, min: 1 },
        total: { type: Number, required: true, min: 0 },
        pricePerNight: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
