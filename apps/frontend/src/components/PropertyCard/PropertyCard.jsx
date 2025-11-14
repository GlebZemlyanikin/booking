import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from '../PriceDisplay';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ item }) {
    const nav = useNavigate();
    const photos = item.photos.length ? item.photos : ['/placeholder.svg'];
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const timerRef = useRef(null);

    function showNextPhoto() {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }
    function showPrevPhoto() {
        setCurrentPhotoIndex(
            (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
        );
    }

    function startAuto() {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => {
            setCurrentPhotoIndex(
                (prevIndex) => (prevIndex + 1) % photos.length
            );
        }, 1500);
    }
    function stopAuto() {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    useEffect(() => () => stopAuto(), []);

    return (
        <div
            className={styles.card}
            onClick={() => nav(`/property/${item.id}`)}
            onMouseEnter={startAuto}
            onMouseLeave={stopAuto}
            onFocus={startAuto}
            onBlur={stopAuto}
            tabIndex={0}
        >
            <div className={styles.imageContainer}>
                {photos.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`${item.title} ${idx + 1}`}
                        className={`${styles.image} ${
                            idx === currentPhotoIndex
                                ? styles.imageVisible
                                : styles.imageHidden
                        }`}
                        draggable={false}
                    />
                ))}
                {photos.length > 1 && (
                    <>
                        <button
                            aria-label="Предыдущая фотография"
                            className={`${styles.navButton} ${styles.navButtonPrev}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                showPrevPhoto();
                            }}
                        >
                            ‹
                        </button>
                        <button
                            aria-label="Следующая фотография"
                            className={`${styles.navButton} ${styles.navButtonNext}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                showNextPhoto();
                            }}
                        >
                            ›
                        </button>
                        <div className={styles.indicators}>
                            {photos.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`${styles.indicator} ${
                                        idx === currentPhotoIndex
                                            ? styles.indicatorActive
                                            : styles.indicatorInactive
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>
                <div className={styles.priceContainer}>
                    <span className={styles.priceLabel}>от</span>
                    <div className={styles.priceValue}>
                        <PriceDisplay amount={item.price} />
                    </div>
                    <span className={styles.priceLabel}>/ сутки</span>
                </div>
            </div>
        </div>
    );
}
