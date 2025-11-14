import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onChange }) {
    const pageNumbers = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );
    return (
        <div className={styles.container}>
            <button
                className={styles.buttonDisabled}
                onClick={() => onChange(Math.max(1, page - 1))}
                disabled={page === 1}
            >
                Назад
            </button>
            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={pageNumber === page ? styles.buttonActive : styles.button}
                    onClick={() => onChange(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}
            <button
                className={styles.buttonDisabled}
                onClick={() => onChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
            >
                Вперёд
            </button>
        </div>
    );
}

