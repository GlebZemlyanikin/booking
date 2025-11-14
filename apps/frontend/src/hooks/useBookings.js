import { useEffect, useState, useCallback } from 'react';
import { getAuthHeaders } from '../utils/auth.js';

const BOOKINGS_API = `${
    import.meta.env.VITE_API_URL || 'http://localhost:4000'
}/api/bookings`;

export default function useBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(BOOKINGS_API);
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: ${response.statusText}`
                );
            }
            const data = await response.json();
            setBookings(data);
        } catch (e) {
            setError(e);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const remove = useCallback(
        async (bookingId) => {
            const response = await fetch(`${BOOKINGS_API}/${bookingId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: ${response.statusText}`
                );
            }
            await refresh();
        },
        [refresh]
    );

    const removeByProperty = useCallback(
        async (propertyId) => {
            const propertyBookings = bookings.filter(
                (booking) => String(booking.propertyId) === String(propertyId)
            );
            await Promise.all(
                propertyBookings.map((booking) =>
                    fetch(`${BOOKINGS_API}/${booking.id}`, {
                        method: 'DELETE',
                        headers: getAuthHeaders(),
                    })
                )
            );
            await refresh();
        },
        [bookings, refresh]
    );

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { bookings, loading, error, remove, removeByProperty, refresh };
}
