import Link from 'next/link';
import { 
  Package, 
  Users, 
  Building2, 
  ShoppingCart, 
  UserCheck, 
  Search,
  BarChart3,
  Truck
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: 'Gestión de Inventario',
      description: 'Controla tus materias primas, monitorea niveles de stock y fechas de vencimiento.',
      icon: Package,
      href: '/admin/inventario',
      color: 'bg-blue-500',
    },
    {
      title: 'Proveedores',
      description: 'Administra la información de tus proveedores y sus productos.',
      icon: Building2,
      href: '/admin/proveedores',
      color: 'bg-green-500',
    },
    {
      title: 'Productos',
      description: 'Gestiona tu catálogo de productos terminados.',
      icon: ShoppingCart,
      href: '/admin/productos',
      color: 'bg-purple-500',
    },
    {
      title: 'Empleados',
      description: 'Administra el personal y sus especialidades.',
      icon: Users,
      href: '/admin/empleados',
      color: 'bg-orange-500',
    },
    {
      title: 'Clientes',
      description: 'Gestiona la base de datos de clientes.',
      icon: UserCheck,
      href: '/admin/clientes',
      color: 'bg-pink-500',
    },
    {
      title: 'Seguimiento de Pedidos',
      description: 'Consulta el estado de tus pedidos en tiempo real.',
      icon: Search,
      href: '/mis-pedidos',
      color: 'bg-indigo-500',
    },
  ];

  const stats = [
    {
      title: 'Gestión Completa',
      description: 'Sistema integral para todas las operaciones',
      icon: BarChart3,
    },
    {
      title: 'Tiempo Real',
      description: 'Información actualizada al instante',
      icon: Truck,
    },
    {
      title: 'Fácil de Usar',
      description: 'Interface intuitiva y moderna',
      icon: UserCheck,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              PanadeTEC
              <span className="block text-primary-200">por y para moodle.leoviquez</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Administra tu inventario, proveedores, productos y pedidos desde una sola plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admin/dashboard"
                className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
              >
                Dashboard Administrador
              </Link>
              <Link
                href="/mis-pedidos"
                className="btn bg-primary-500 text-white hover:bg-primary-400 text-lg px-8 py-3"
              >
                Consultar Pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {stat.title}
                  </h3>
                  <p className="text-gray-600">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todas las herramientas que necesitas para gestionar tu operación de manera eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className="card hover:shadow-lg transition-shadow duration-200 group"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Accede al dashboard de administración para gestionar todas las operaciones de tu negocio.
          </p>
          <Link
            href="/admin/dashboard"
            className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 inline-flex items-center space-x-2"
          >
            <UserCheck className="h-5 w-5" />
            <span>Ir al Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}