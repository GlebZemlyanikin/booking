import { Booking } from '../models/Booking.js';
import { Property } from '../models/Property.js';
import { formatBooking } from '../utils/formatBooking.js';
import { createError } from '../middleware/errorHandler.js';

export async function getAll(req, res, next) {
    try {
        const query = req.query.propertyId
            ? { propertyId: req.query.propertyId }
            : {};
        const bookings = await Booking.find(query)
            .populate('propertyId', 'title')
            .sort({ createdAt: -1 })
            .lean();

        res.json(bookings.map(formatBooking));
    } catch (e) {
        next(e);
    }
}

export async function getById(req, res, next) {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('propertyId', 'title')
            .lean();

        if (!booking) {
            throw createError('Бронирование не найдено', 404);
        }

        res.json(formatBooking(booking));
    } catch (e) {
        next(e);
    }
}

export async function create(req, res, next) {
    try {
        const { propertyId, from, to, guests } = req.body;

        if (!propertyId || !from || !to || !guests) {
            throw createError('Отсутствуют обязательные поля', 400);
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            throw createError('Объект недвижимости не найден', 404);
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (fromDate >= toDate) {
            throw createError('Дата выезда должна быть позже даты заезда', 400);
        }

        const overlappingBookings = await Booking.find({
            propertyId,
            from: { $lte: toDate },
            to: { $gte: fromDate },
        });

        if (overlappingBookings.length > 0) {
            throw createError('На эти даты уже есть бронирование', 409);
        }

        const nights = Math.max(
            1,
            Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24))
        );
        const total = nights * property.price;

        const booking = await Booking.create({
            propertyId,
            from: fromDate,
            to: toDate,
            guests: Number(guests),
            nights,
            total,
            pricePerNight: property.price,
        });

        await booking.populate('propertyId', 'title');
        const populatedBooking = booking.toObject();

        res.status(201).json(formatBooking(populatedBooking));
    } catch (e) {
        next(e);
    }
}

export async function deleteById(req, res, next) {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            throw createError('Бронирование не найдено', 404);
        }
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
}

export async function getByPropertyId(req, res, next) {
    try {
        const bookings = await Booking.find({
            propertyId: req.params.propertyId,
        })
            .populate('propertyId', 'title')
            .sort({ from: 1 })
            .lean();

        res.json(bookings.map(formatBooking));
    } catch (e) {
        next(e);
    }
}
