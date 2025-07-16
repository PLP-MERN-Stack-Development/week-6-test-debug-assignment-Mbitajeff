import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  let variantClass = '';
  switch (variant) {
    case 'secondary':
      variantClass = 'btn-secondary';
      break;
    case 'danger':
      variantClass = 'btn-danger';
      break;
    default:
      variantClass = 'btn-primary';
  }

  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'btn-sm';
      break;
    case 'lg':
      sizeClass = 'btn-lg';
      break;
    default:
      sizeClass = 'btn-md';
  }

  const disabledClass = disabled ? 'btn-disabled' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim()}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 