import { ReactNode } from 'react';
import { ChefHat, Cookie } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-bakery-cream">
      {/* Bakery Header Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-warm-700 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-3 text-sm">
            <ChefHat className="h-5 w-5" />
            <span className="font-semibold">🥖 Panel del Maestro Panadero - Área de Gestión Profesional</span>
            <Cookie className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Bakery Info Banner */}
      <div className="bg-warm-50 border-l-4 border-primary-400 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ChefHat className="h-5 w-5 text-primary-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-warm-700">
              <strong>🍞 Modo Panadero Activado:</strong> Esta es tu área de trabajo para gestionar todos los aspectos de tu panadería artesanal. 
              Desde ingredientes frescos hasta pedidos especiales, todo bajo control.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}