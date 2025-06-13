'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Package, 
  Users, 
  Building2, 
  ShoppingCart, 
  UserCheck, 
  Menu, 
  X,
  Home,
  Search
} from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      title: 'Inicio',
      href: '/',
      icon: Home,
    },
    {
      title: 'Dashboard Admin',
      href: '/admin/dashboard',
      icon: UserCheck,
    },
    {
      title: 'Inventario',
      href: '/admin/inventario',
      icon: Package,
    },
    {
      title: 'Proveedores',
      href: '/admin/proveedores',
      icon: Building2,
    },
    {
      title: 'Productos',
      href: '/admin/productos',
      icon: ShoppingCart,
    },
    {
      title: 'Empleados',
      href: '/admin/empleados',
      icon: Users,
    },
    {
      title: 'Clientes',
      href: '/admin/clientes',
      icon: Users,
    },
    {
      title: 'Mis Pedidos',
      href: '/mis-pedidos',
      icon: Search,
    },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-primary-600">
              SGO
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary-600 focus:outline-none focus:text-primary-600 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;