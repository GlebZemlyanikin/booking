export function errorHandler(err, req, res, next) {
    console.error('Ошибка:', err.message);

    const status = err.status || 500;
    const message = err.message || 'Внутренняя ошибка сервера';

    res.status(status).json({ error: message });
}

export function createError(message, status = 500) {
    const error = new Error(message);
    error.status = status;
    return error;
}
