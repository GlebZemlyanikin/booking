import { Property } from '../models/Property.js';
import { parsePropertyId } from '../utils/parsePropertyId.js';
import { createError } from '../middleware/errorHandler.js';

export async function getAll(req, res, next) {
    try {
        const items = await Property.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (e) {
        next(e);
    }
}

export async function getById(req, res, next) {
    try {
        const parsed = parsePropertyId(req.params.id);
        const query =
            parsed.by === '_id' ? { _id: parsed.value } : { id: parsed.value };
        const item = await Property.findOne(query);

        if (!item) {
            throw createError('Не найдено', 404);
        }

        res.json(item);
    } catch (e) {
        next(e);
    }
}

export async function create(req, res, next) {
    try {
        const item = await Property.create(req.body);
        res.status(201).json(item);
    } catch (e) {
        next(e);
    }
}

export async function update(req, res, next) {
    try {
        const parsed = parsePropertyId(req.params.id);
        const query =
            parsed.by === '_id' ? { _id: parsed.value } : { id: parsed.value };

        const item = await Property.findOneAndUpdate(query, req.body, {
            new: true,
            runValidators: true,
        });

        if (!item) {
            throw createError('Не найдено', 404);
        }

        res.json(item);
    } catch (e) {
        next(e);
    }
}

export async function deleteById(req, res, next) {
    try {
        const parsed = parsePropertyId(req.params.id);
        const query =
            parsed.by === '_id' ? { _id: parsed.value } : { id: parsed.value };
        const result = await Property.deleteOne(query);

        if (result.deletedCount === 0) {
            throw createError('Не найдено', 404);
        }

        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
}
