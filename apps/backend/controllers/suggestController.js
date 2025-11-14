import { createError } from '../middleware/errorHandler.js';

export async function getSuggestions(req, res, next) {
    try {
        const { text = '', lang = 'ru_RU', results = '5' } = req.query;
        const apiKey = process.env.YANDEX_MAPS_API_KEY;

        if (!apiKey) {
            throw createError('YANDEX_MAPS_API_KEY не установлен', 500);
        }

        if (!text) {
            return res.json({ results: [] });
        }

        const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${encodeURIComponent(
            text
        )}&format=json&results=${results}&lang=${lang}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw createError('Ошибка Yandex API', response.status);
        }

        const data = await response.json();
        const geocoderResults =
            data.response?.GeoObjectCollection?.featureMember || [];

        const suggestResults = geocoderResults.map((f) => {
            const geo = f.GeoObject;
            const coords = geo.Point?.pos?.split(' ').map(Number);
            return {
                value: geo.name,
                title: { text: geo.name },
                subtitle: { text: geo.description || geo.name },
                _coords: coords ? { lng: coords[0], lat: coords[1] } : null,
            };
        });

        res.json({ results: suggestResults });
    } catch (err) {
        next(err);
    }
}
