import React from 'react';

export default function TextArea({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  rows = 4, 
  required = false,
  className = '',
  ...props 
}) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 box-border ${className}`}
      {...props}
    />
  );
}