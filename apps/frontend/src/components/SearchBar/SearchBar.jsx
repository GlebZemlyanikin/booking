import { useEffect, useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch }) {
    const [city, setCity] = useState('');
    const [guestsCount, setGuestsCount] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        onSearch({
            city,
            guests: guestsCount ? Number(guestsCount) : undefined,
            sort: sortOrder,
        });
    }, [city, guestsCount, sortOrder, onSearch]);

    return (
        <form className={styles.form}>
            <input
                id="city-input"
                className={styles.input}
                placeholder="Город"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="off"
            />
            <div className={styles.guestsContainer}>
                <span className={styles.guestsLabel}>Количество гостей</span>
                <select
                    id="guests"
                    className={styles.select}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                >
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(
                        (optionValue) => (
                            <option key={optionValue} value={optionValue}>
                                {optionValue}
                            </option>
                        )
                    )}
                </select>
            </div>
            <select
                id="sort-order"
                name="sort"
                className={styles.select}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
            >
                <option value="asc">По цене: дешевле сначала</option>
                <option value="desc">По цене: дороже сначала</option>
            </select>
        </form>
    );
}
