import AddressAutocomplete from '../../AddressAutocomplete';
import TextInput from '../../ui/TextInput';
import SelectInput from '../../ui/SelectInput';
import PhotoPreviewGrid from '../../ui/PhotoPreviewGrid';
import Button from '../../ui/Button';
import styles from './AdminPropertiesForm.module.css';

export default function AdminPropertiesForm({
    formState,
    setFormState,
    onSubmit,
    editingProperty = null,
    onCancel,
}) {
    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <TextInput
                label="Название"
                placeholder="Например, Уютная студия"
                value={formState.title}
                onChange={(value) =>
                    setFormState((prevForm) => ({ ...prevForm, title: value }))
                }
            />
            <TextInput
                label="Город"
                placeholder="Например, Москва"
                value={formState.city}
                onChange={(value) =>
                    setFormState((prevForm) => ({ ...prevForm, city: value }))
                }
            />
            <label className={styles.addressLabel}>
                <span className={styles.labelText}>Адрес</span>
                <AddressAutocomplete
                    value={
                        formState.street
                            ? `${formState.city ? formState.city + ', ' : ''}${
                                  formState.street
                              }`
                            : ''
                    }
                    onSelect={(selection) => {
                        setFormState((prevForm) => ({
                            ...prevForm,
                            city: selection.city || prevForm.city,
                            street: selection.label,
                            coords:
                                selection.coords?.lat && selection.coords?.lng
                                    ? {
                                          lat: selection.coords.lat,
                                          lng: selection.coords.lng,
                                      }
                                    : null,
                        }));
                    }}
                    placeholder="Начните вводить адрес..."
                />
            </label>
            <div className={styles.priceSection}>
                <TextInput
                    className={styles.priceInput}
                    label="Цена за ночь"
                    placeholder="4500"
                    value={formState.price}
                    onChange={(value) =>
                        setFormState((prevForm) => ({
                            ...prevForm,
                            price: value,
                        }))
                    }
                />
                <SelectInput
                    label="Комнат"
                    value={formState.rooms}
                    onChange={(value) =>
                        setFormState((prevForm) => ({
                            ...prevForm,
                            rooms: value,
                        }))
                    }
                >
                    {Array.from({ length: 5 }, (_, index) => index + 1).map(
                        (optionValue) => (
                            <option key={optionValue} value={optionValue}>
                                {optionValue}
                            </option>
                        )
                    )}
                </SelectInput>
                <SelectInput
                    label="Гостей"
                    value={formState.guests}
                    onChange={(value) =>
                        setFormState((prevForm) => ({
                            ...prevForm,
                            guests: value,
                        }))
                    }
                >
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(
                        (optionValue) => (
                            <option key={optionValue} value={optionValue}>
                                {optionValue}
                            </option>
                        )
                    )}
                </SelectInput>
            </div>
            <label className={styles.textareaWrapper}>
                <span className={styles.labelText}>
                    Фото (по одному URL на строку)
                </span>
                <textarea
                    className={styles.textarea}
                    rows={4}
                    placeholder={'https://...\nhttps://...'}
                    value={formState.photosText}
                    onChange={(event) =>
                        setFormState((prevForm) => ({
                            ...prevForm,
                            photosText: event.target.value,
                        }))
                    }
                />
                <span className={styles.labelText}>Описание</span>
                <textarea
                    className={styles.textarea}
                    rows={4}
                    placeholder={'Опишите преимущества и особенности объекта'}
                    value={formState.description}
                    onChange={(event) =>
                        setFormState((prevForm) => ({
                            ...prevForm,
                            description: event.target.value,
                        }))
                    }
                />
                <PhotoPreviewGrid
                    value={formState.photosText}
                    onRemove={(url) => {
                        const remaining = formState.photosText
                            .split(/[\n,]/)
                            .map((segment) => segment.trim())
                            .filter((urlValue) => urlValue && urlValue !== url);
                        setFormState((prevForm) => ({
                            ...prevForm,
                            photosText: remaining.join('\n'),
                        }));
                    }}
                />
            </label>
            <div className={styles.buttonsContainer}>
                <Button variant="accent" type="submit">
                    {editingProperty ? 'Сохранить изменения' : 'Добавить'}
                </Button>
                {editingProperty && onCancel && (
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={onCancel}
                    >
                        Отмена
                    </Button>
                )}
            </div>
        </form>
    );
}

