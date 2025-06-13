import Link from 'next/link';
import { 
  Package, 
  Users, 
  Building2, 
  ShoppingCart, 
  UserCheck, 
  TrendingUp,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const managementModules = [
    {
      title: 'Gestión de Inventario',
      description: 'Administrar materias primas, stock y fechas de vencimiento',
      icon: Package,
      href: '/admin/inventario',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: 'Gestión de Proveedores',
      description: 'Administrar información de proveedores y contactos',
      icon: Building2,
      href: '/admin/proveedores',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      title: 'Gestión de Productos',
      description: 'Administrar catálogo de productos terminados',
      icon: ShoppingCart,
      href: '/admin/productos',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      title: 'Gestión de Empleados',
      description: 'Administrar personal y especialidades',
      icon: Users,
      href: '/admin/empleados',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
    },
    {
      title: 'Gestión de Clientes',
      description: 'Administrar base de datos de clientes',
      icon: UserCheck,
      href: '/admin/clientes',
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
    },
    {
      title: 'Gestión de Pedidos',
      description: 'Administrar pedidos y estados de entrega',
      icon: TrendingUp,
      href: '/admin/pedidos',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
    },
  ];

  const quickStats = [
    {
      title: 'Stock Bajo',
      value: '--',
      description: 'Items con inventario bajo',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Por Vencer',
      value: '--',
      description: 'Items próximos a vencer',
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Pedidos Activos',
      value: '--',
      description: 'Pedidos en proceso',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard de Administración
        </h1>
        <p className="text-gray-600">
          Gestiona todas las operaciones de tu negocio desde aquí.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Management Modules */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Módulos de Gestión
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link
                key={index}
                href={module.href}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 group"
              >
                <div className={`w-12 h-12 ${module.color} ${module.hoverColor} rounded-lg flex items-center justify-center mb-4 transition-colors duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {module.title}
                </h3>
                <p className="text-gray-600 text-sm">{module.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/inventario?action=create"
            className="btn btn-primary text-center"
          >
            <Package className="h-4 w-4 mx-auto mb-1" />
            Nuevo Inventario
          </Link>
          <Link
            href="/admin/proveedores?action=create"
            className="btn btn-secondary text-center"
          >
            <Building2 className="h-4 w-4 mx-auto mb-1" />
            Nuevo Proveedor
          </Link>
          <Link
            href="/admin/productos?action=create"
            className="btn btn-secondary text-center"
          >
            <ShoppingCart className="h-4 w-4 mx-auto mb-1" />
            Nuevo Producto
          </Link>
          <Link
            href="/admin/clientes?action=create"
            className="btn btn-secondary text-center"
          >
            <UserCheck className="h-4 w-4 mx-auto mb-1" />
            Nuevo Cliente
          </Link>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Instrucciones de Uso
        </h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Selecciona un módulo de gestión para administrar los datos correspondientes</li>
          <li>Utiliza las acciones rápidas para crear nuevos registros</li>
          <li>Revisa regularmente el inventario para items con stock bajo o próximos a vencer</li>
          <li>Mantén actualizado el estado de los pedidos de clientes</li>
        </ul>
      </div>
    </div>
  );
}