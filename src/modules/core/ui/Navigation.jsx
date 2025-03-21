import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/import', label: 'Import Users' },
    { path: '/audiences', label: 'Manage Audiences' },
    { path: '/broadcasts', label: 'Create Broadcast' },
  ];
  
  return (
    <nav className="w-64 bg-white shadow-sm h-full">
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `block px-4 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}