import { useEffect, useState, useCallback } from 'react';
import { normalizeProperty, normalizeProperties } from '../utils/normalize.js';
import { getAuthHeaders } from '../utils/auth.js';

const PROPERTIES_API = `${
    import.meta.env.VITE_API_URL || 'http://localhost:4000'
}/api/properties`;

export default function useProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(PROPERTIES_API);
            const responseData = await response.json();
            setProperties(normalizeProperties(responseData));
        } catch (e) {
            setError(e);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (payload) => {
        const response = await fetch(PROPERTIES_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: `Ошибка ${response.status}: ${response.statusText}`,
            }));
            throw new Error(
                errorData.error ||
                    errorData.details ||
                    'Ошибка при создании свойства'
            );
        }
        const createdProperty = await response.json();
        setProperties((prevProperties) => [
            normalizeProperty(createdProperty),
            ...prevProperties,
        ]);
        return createdProperty;
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const update = useCallback(async (id, payload) => {
        const url = `${PROPERTIES_API}/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: `Ошибка ${response.status}: ${response.statusText}`,
            }));
            throw new Error(
                errorData.error ||
                    errorData.details ||
                    'Ошибка при обновлении свойства'
            );
        }

        const updatedProperty = await response.json();
        setProperties((prevProperties) =>
            prevProperties.map((property) =>
                String(property.id) === String(id)
                    ? normalizeProperty(updatedProperty)
                    : property
            )
        );
        return updatedProperty;
    }, []);

    const remove = useCallback(async (id) => {
        const response = await fetch(`${PROPERTIES_API}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error(
                `Ошибка ${response.status}: ${response.statusText}`
            );
        }
        setProperties((prevProperties) =>
            prevProperties.filter(
                (property) => String(property.id) !== String(id)
            )
        );
    }, []);

    return {
        properties,
        loading,
        error,
        refresh: fetchAll,
        create,
        update,
        remove,
    };
}
