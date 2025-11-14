import { forwardRef } from 'react';

const Button = forwardRef(
    (
        {
            variant = 'secondary',
            children,
            className = '',
            disabled = false,
            fullWidth = false,
            ...props
        },
        ref
    ) => {
        const baseClass =
            variant === 'primary'
                ? 'btn-primary'
                : variant === 'accent'
                ? 'btn-accent'
                : 'btn-secondary';

        const classes = [
            baseClass,
            fullWidth && 'w-full',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
