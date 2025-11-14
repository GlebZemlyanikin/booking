import { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import PropertyList from '../components/PropertyList';
import Map from '../components/Map';
import useProperties from '../hooks/useProperties.js';

export default function Home() {
    const [filters, setFilters] = useState({});
    const { properties: items } = useProperties();

    const data = useMemo(() => {
        const filtered = items.filter((property) => {
            if (
                filters.city &&
                !property.address.city
                    .toLowerCase()
                    .includes(filters.city.toLowerCase())
            )
                return false;
            if (filters.guests && property.guests < filters.guests)
                return false;
            return true;
        });
        if (filters.sort === 'asc')
            return filtered.sort((a, b) => a.price - b.price);
        if (filters.sort === 'desc')
            return filtered.sort((a, b) => b.price - a.price);
        return filtered;
    }, [items, filters]);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Найдите идеальную квартиру</h1>
            <SearchBar onSearch={setFilters} />
            <PropertyList items={data} />
            {(() => {
                const propWithCoords = data.find((p) => p.coords);
                const markers = data
                    .filter((p) => p.coords)
                    .map((p) => ({
                        id: p.id,
                        title: p.title,
                        address: p.address,
                        price: p.price,
                        rooms: p.rooms,
                        guests: p.guests,
                        lat: p.coords.lat,
                        lng: p.coords.lng,
                    }));
                return propWithCoords ? (
                    <Map
                        center={[
                            propWithCoords.coords.lat,
                            propWithCoords.coords.lng,
                        ]}
                        markers={markers}
                    />
                ) : null;
            })()}
        </div>
    );
}
