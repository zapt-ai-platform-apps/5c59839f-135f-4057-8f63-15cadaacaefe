import React from 'react';

export default function TextInput({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  required = false,
  className = '',
  ...props 
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 box-border ${className}`}
      {...props}
    />
  );
}