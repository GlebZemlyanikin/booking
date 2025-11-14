import { useEffect, useState } from 'react';
import styles from './AddressAutocomplete.module.css';

export default function AddressAutocomplete({
    value,
    onSelect,
    placeholder = 'Адрес',
}) {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    useEffect(() => {
        if (!isOpen) return;
        if (!query || query.length < 3) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }
        const ctrl = new AbortController();
        const t = setTimeout(async () => {
            try {
                setIsLoading(true);

                const url = `http://localhost:4000/api/suggest?text=${encodeURIComponent(
                    query
                )}&lang=ru_RU&results=5`;
                const res = await fetch(url, { signal: ctrl.signal });
                const data = await res.json();
                const out = (data.results || []).map((f, idx) => ({
                    id: f.value + '-' + idx,
                    label: f.title.text ?? f.value,
                    fullAddress: f.value,
                    coords: f._coords || null,
                }));
                setSuggestions(out);
            } catch (err) {
                if (err?.name !== 'AbortError') {
                    console.error(
                        'Ошибка при загрузке подсказок адресов:',
                        err
                    );
                }
            } finally {
                setIsLoading(false);
            }
        }, 250);
        return () => {
            clearTimeout(t);
            ctrl.abort();
        };
    }, [query, isOpen]);

    const getCoordsByAddress = async (address) => {
        const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${encodeURIComponent(
            address
        )}&format=json&lang=ru_RU`;
        const res = await fetch(geocodeUrl);
        const data = await res.json();
        const pos =
            data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject
                ?.Point?.pos;
        return pos ? pos.split(' ').map(Number) : null;
    };

    return (
        <div className={styles.container}>
            <input
                id="address-input"
                name="address"
                className={styles.input}
                value={query}
                onChange={(event) => {
                    const value = event.target.value || '';
                    setQuery(value);
                    setIsOpen(value.length >= 3);
                }}
                placeholder={placeholder}
                autoComplete="off"
                onFocus={() => query && query.length >= 3 && setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') setIsOpen(false);
                }}
            />
            {isOpen && (isLoading || (query && suggestions.length > 0)) && (
                <div className={styles.suggestions}>
                    {isLoading ? (
                        <div className={styles.loading}>Загрузка…</div>
                    ) : (
                        suggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                type="button"
                                className={styles.suggestionItem}
                                onMouseDown={async (event) => {
                                    event.preventDefault();
                                    setQuery(suggestion.label);
                                    setSuggestions([]);
                                    setIsOpen(false);

                                    let finalCoords = suggestion.coords;
                                    if (!finalCoords) {
                                        const coords = await getCoordsByAddress(
                                            suggestion.fullAddress
                                        );
                                        finalCoords = coords
                                            ? { lng: coords[0], lat: coords[1] }
                                            : null;
                                    }
                                    onSelect?.({
                                        ...suggestion,
                                        coords: finalCoords,
                                    });
                                }}
                            >
                                {suggestion.label}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

