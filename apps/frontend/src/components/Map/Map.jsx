import { Map as YMap, Placemark } from '@pbe/react-yandex-maps';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import styles from './Map.module.css';

function ClickablePlacemark({ marker, onMarkerClick }) {
    const instanceRef = useRef(null);
    const handlerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (
                instanceRef.current &&
                instanceRef.current.events &&
                handlerRef.current
            ) {
                instanceRef.current.events.remove('click', handlerRef.current);
            }
        };
    }, []);

    return (
        <Placemark
            key={marker.id}
            geometry={[marker.lat, marker.lng]}
            options={{
                cursor: 'pointer',
                preset: 'islands#blueIcon',
            }}
            instanceRef={(ref) => {
                if (ref && ref.events) {
                    if (
                        instanceRef.current &&
                        instanceRef.current.events &&
                        handlerRef.current
                    ) {
                        instanceRef.current.events.remove(
                            'click',
                            handlerRef.current
                        );
                    }

                    instanceRef.current = ref;

                    const handler = () => {
                        onMarkerClick(marker.id);
                    };
                    handlerRef.current = handler;

                    ref.events.add('click', handler);
                }
            }}
        />
    );
}

export default function Map({ center, markers }) {
    const navigate = useNavigate();
    const mapCenter = center || [55.751244, 37.618423];
    const mapInstanceRef = useRef(null);

    const handleMarkerClick = (markerId) => {
        navigate(`/property/${markerId}`);
    };

    useEffect(() => {
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className={styles.container}>
            <YMap
                defaultState={{ center: mapCenter, zoom: 12 }}
                width="100%"
                height="100%"
                instanceRef={(ref) => {
                    mapInstanceRef.current = ref;
                }}
            >
                {markers.map((marker) => (
                    <ClickablePlacemark
                        key={marker.id}
                        marker={marker}
                        onMarkerClick={handleMarkerClick}
                    />
                ))}
            </YMap>
        </div>
    );
}

