import { useMemo, useState } from 'react';
import AdminPropertiesForm from '../components/admin/AdminPropertiesForm';
import AdminPropertiesList from '../components/admin/AdminPropertiesList';
import AdminBookingsTable from '../components/admin/AdminBookingsTable';
import useProperties from '../hooks/useProperties.js';
import useBookings from '../hooks/useBookings.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function AdminDashboard() {
    const {
        properties,
        create,
        update,
        remove: removeProperty,
    } = useProperties();
    const [editingProperty, setEditingProperty] = useState(null);
    const [formState, setFormState] = useState({
        title: '',
        city: '',
        street: '',
        price: '',
        rooms: 1,
        guests: 1,
        photosText: '',
        description: '',
        coords: null,
    });
    const {
        bookings,
        remove: removeBookingHook,
        removeByProperty,
    } = useBookings();
    const [filters, setFilters] = useState({ city: '', from: '', to: '' });

    function resetForm() {
        setFormState({
            title: '',
            city: '',
            street: '',
            price: '',
            rooms: 1,
            guests: 1,
            photosText: '',
            description: '',
            coords: null,
        });
        setEditingProperty(null);
    }

    async function handleEdit(property) {
        try {
            const response = await fetch(
                `${API_URL}/api/properties/${property.id}`
            );
            if (!response.ok) {
                console.error(
                    `Объект с ID ${property.id} не найден на сервере (${response.status})`
                );
                alert(`Объект не найден на сервере. Возможно, он был удален.`);
                return;
            }
            const serverProperty = await response.json();
            const propertyToEdit = {
                ...serverProperty,
                id: serverProperty.id,
            };
            setEditingProperty(propertyToEdit);
            setFormState({
                title: serverProperty.title || '',
                city: serverProperty.address?.city || '',
                street: serverProperty.address?.street || '',
                price: String(serverProperty.price || ''),
                rooms: serverProperty.rooms || 1,
                guests: serverProperty.guests || 1,
                photosText: Array.isArray(serverProperty.photos)
                    ? serverProperty.photos.join('\n')
                    : '',
                description: serverProperty.description || '',
                coords: serverProperty.coords || null,
            });
        } catch (error) {
            console.error('Ошибка при проверке объекта:', error);
            alert('Ошибка при загрузке данных объекта');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const payload = {
                title: formState.title,
                address: { city: formState.city, street: formState.street },
                price: Number(formState.price),
                guests: Number(formState.guests),
                rooms: Number(formState.rooms),
                photos: formState.photosText?.trim()
                    ? formState.photosText
                          .split(/[\n,]/)
                          .map((segment) => segment.trim())
                          .filter(Boolean)
                    : ['/placeholder.svg'],
                description: formState.description || '',
                coords: formState.coords || null,
            };

            if (editingProperty) {
                await update(editingProperty.id, payload);
            } else {
                await create(payload);
            }
            resetForm();
        } catch (error) {
            alert(`Ошибка при сохранении: ${error.message}`);
        }
    }

    const total = useMemo(() => properties.length, [properties]);

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Админка — Объекты</h1>
                {editingProperty && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800">
                        Редактирование: {editingProperty.title}
                    </div>
                )}
                <AdminPropertiesForm
                    formState={formState}
                    setFormState={setFormState}
                    onSubmit={handleSubmit}
                    editingProperty={editingProperty}
                    onCancel={resetForm}
                />

                <p className="text-neutral-400">Всего объектов: {total}</p>
                <AdminPropertiesList
                    items={properties}
                    onDelete={(i) => {
                        const id = i.id;
                        removeProperty(id);
                        removeByProperty(id);
                    }}
                    onEdit={handleEdit}
                />
            </div>

            <AdminBookingsTable
                bookings={bookings}
                properties={properties}
                filters={filters}
                setFilters={setFilters}
                onRemove={(b) => removeBookingHook(b.id)}
            />
        </div>
    );
}
