import styles from './TextInput.module.css';

export default function TextInput({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    id,
    className = '',
}) {
    return (
        <label className={`${styles.label} ${className}`}>
            {label && <span className={styles.labelText}>{label}</span>}
            <input
                id={id}
                className={styles.input}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
            />
        </label>
    );
}

