import { useEffect, useState } from 'react';
import PriceDisplay from '../../components/PriceDisplay';
import { useParams } from 'react-router-dom';
import BookingForm from '../../components/BookingForm';
import Map from '../../components/Map';
import useProperties from '../../hooks/useProperties.js';
import styles from './PropertyDetails.module.css';

export default function PropertyDetails() {
    const { id } = useParams();
    const { properties } = useProperties();
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const property =
        properties.find((prop) => String(prop.id) === String(id)) || null;

    useEffect(() => {
        setCurrentPhotoIndex(0);
    }, [id]);

    if (!property)
        return <div className="text-neutral-400 py-6">Объект не найден</div>;

    const photos = property.photos.length
        ? property.photos
        : ['/placeholder.svg'];

    function showNextPhoto() {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }

    function showPrevPhoto() {
        setCurrentPhotoIndex(
            (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{property.title}</h1>
            <div className={styles.gallery}>
                {photos.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`${property.title} ${idx + 1}`}
                        className={`${styles.galleryImage} ${
                            idx === currentPhotoIndex
                                ? styles.galleryImageVisible
                                : styles.galleryImageHidden
                        }`}
                        draggable={false}
                    />
                ))}
                {photos.length > 1 && (
                    <>
                        <button
                            aria-label="Предыдущая фотография"
                            className={`${styles.galleryNavButton} ${styles.galleryNavButtonPrev}`}
                            onClick={showPrevPhoto}
                        >
                            ‹
                        </button>
                        <button
                            aria-label="Следующая фотография"
                            className={`${styles.galleryNavButton} ${styles.galleryNavButtonNext}`}
                            onClick={showNextPhoto}
                        >
                            ›
                        </button>
                        <div className={styles.galleryIndicators}>
                            {photos.map((_, idx) => (
                                <button
                                    key={idx}
                                    aria-label={`Перейти к фотографии ${
                                        idx + 1
                                    }`}
                                    className={`${styles.galleryIndicator} ${
                                        idx === currentPhotoIndex
                                            ? styles.galleryIndicatorActive
                                            : styles.galleryIndicatorInactive
                                    }`}
                                    onClick={() => setCurrentPhotoIndex(idx)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className={styles.mainContent}>
                <div className={styles.details}>
                    <p className={styles.description}>{property.description}</p>
                    <div className={styles.info}>
                        <div>
                            <span className={styles.infoLabel}>Адрес:</span>{' '}
                            {property.address.city}, {property.address.street}
                        </div>
                        <div>
                            <span className={styles.infoLabel}>Гостей:</span>{' '}
                            {property.guests}{' '}
                            <span className={styles.infoLabel}>Комнат:</span>{' '}
                            {property.rooms}
                        </div>
                    </div>
                </div>
                <aside className={styles.sidebar}>
                    <div className={styles.priceSection}>
                        <div className={styles.priceContainer}>
                            <span className={styles.priceValue}>
                                <PriceDisplay amount={property.price} />
                            </span>
                            <span className={styles.priceLabel}>/ сутки</span>
                        </div>
                    </div>
                    <div className={styles.formContainer}>
                        <BookingForm
                            propertyId={property.id}
                            defaultPrice={property.price}
                            propertyTitle={property.title}
                        />
                    </div>
                </aside>
            </div>
            {property.coords && (
                <div className={styles.mapContainer}>
                    <Map
                        center={[property.coords.lat, property.coords.lng]}
                        markers={[
                            {
                                id: property.id,
                                title: property.title,
                                address: property.address,
                                price: property.price,
                                rooms: property.rooms,
                                guests: property.guests,
                                lat: property.coords.lat,
                                lng: property.coords.lng,
                            },
                        ]}
                    />
                </div>
            )}
        </div>
    );
}
