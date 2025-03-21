import React from 'react';

export default function Alert({ children, title, type = 'info' }) {
  const styles = {
    info: {
      wrapper: 'bg-blue-50 border-blue-400',
      title: 'text-blue-800',
      content: 'text-blue-700'
    },
    success: {
      wrapper: 'bg-green-50 border-green-400',
      title: 'text-green-800',
      content: 'text-green-700'
    },
    warning: {
      wrapper: 'bg-yellow-50 border-yellow-400',
      title: 'text-yellow-800',
      content: 'text-yellow-700'
    },
    error: {
      wrapper: 'bg-red-50 border-red-400',
      title: 'text-red-800',
      content: 'text-red-700'
    }
  };
  
  const style = styles[type] || styles.info;
  
  return (
    <div className={`rounded-md border p-4 mb-6 ${style.wrapper}`}>
      {title && <h3 className={`text-sm font-medium ${style.title} mb-1`}>{title}</h3>}
      <div className={`text-sm ${style.content}`}>
        {children}
      </div>
    </div>
  );
}