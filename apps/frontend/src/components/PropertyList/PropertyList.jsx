import Pagination from '../ui/Pagination';
import { useMemo, useState, useEffect } from 'react';
import PropertyCard from '../PropertyCard';
import styles from './PropertyList.module.css';

const PAGE_SIZE = 6;

export default function PropertyList({ items }) {
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [items?.length]);

    const totalItems = items?.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    const paginatedItems = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE;
        return items.slice(startIndex, startIndex + PAGE_SIZE);
    }, [items, page]);

    if (!items?.length)
        return <div className={styles.emptyMessage}>Ничего не найдено</div>;

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {paginatedItems.map((propertyItem) => (
                    <PropertyCard key={propertyItem.id} item={propertyItem} />
                ))}
            </div>
            <div className={styles.paginationInfo}>
                <div>
                    Показано {(page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, totalItems)} из {totalItems}
                </div>
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                />
            </div>
        </div>
    );
}

