import React from 'react';

export default function Button({ 
  children, 
  className = '', 
  type = 'button', 
  disabled = false, 
  onClick 
}) {
  const baseClasses = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors";
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}