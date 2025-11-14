import styles from './AdminBookingFilters.module.css';
import Button from '../../ui/Button';

export default function AdminBookingFilters({ filters, setFilters, onReset }) {
    return (
        <form className={styles.form}>
            <input
                id="filter-city"
                name="city"
                className={styles.input}
                placeholder="Город"
                value={filters.city}
                onChange={(event) =>
                    setFilters((prevFilters) => ({
                        ...prevFilters,
                        city: event.target.value,
                    }))
                }
            />
            <input
                id="filter-from"
                name="from"
                className={styles.input}
                type="date"
                value={filters.from}
                onChange={(event) =>
                    setFilters((prevFilters) => ({
                        ...prevFilters,
                        from: event.target.value,
                    }))
                }
            />
            <input
                id="filter-to"
                name="to"
                className={styles.input}
                type="date"
                value={filters.to}
                onChange={(event) =>
                    setFilters((prevFilters) => ({
                        ...prevFilters,
                        to: event.target.value,
                    }))
                }
            />
            <div className={styles.buttonContainer}>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onReset}
                >
                    Сбросить
                </Button>
            </div>
        </form>
    );
}

