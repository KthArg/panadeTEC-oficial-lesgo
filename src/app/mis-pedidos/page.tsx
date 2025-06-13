'use client';

import { useState } from 'react';
import { Search, Cookie, Clock, CheckCircle, AlertCircle, User, Calendar, ChefHat } from 'lucide-react';
import type { PedidoCompleto, ApiResponse } from '@/types/database';

export default function MisPedidosPage() {
  const [cedula, setCedula] = useState('');
  const [pedidos, setPedidos] = useState<PedidoCompleto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cedula.trim()) {
      setError('Por favor ingresa tu número de cédula');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/pedidos?cedula=${cedula}`);
      const result: ApiResponse<PedidoCompleto[]> = await response.json();
      
      if (result.success && result.data) {
        setPedidos(result.data);
        setSearched(true);
      } else {
        setError(result.error || 'Error al buscar los pedidos');
        setPedidos([]);
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'encargado':
        return {
          icon: Clock,
          color: 'text-amber-600',
          bg: 'bg-amber-100',
          description: '👨‍🍳 Tu pedido ha sido recibido y está en cola para preparación.',
          step: 1,
          emoji: '📝',
        };
      case 'elaborando':
        return {
          icon: ChefHat,
          color: 'text-orange-600',
          bg: 'bg-orange-100',
          description: '🔥 ¡Tu pedido está en el horno! Nuestros panaderos están trabajando en él.',
          step: 2,
          emoji: '👨‍🍳',
        };
      case 'listo':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          description: '🎉 ¡Tu pedido está listo! Puedes venir a recogerlo cuando gustes.',
          step: 3,
          emoji: '✅',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          description: 'Estado desconocido.',
          step: 0,
          emoji: '❓',
        };
    }
  };

  // Render progress bar
  const renderProgressBar = (currentStep: number) => {
    const steps = [
      { number: 1, label: 'Recibido', status: 'encargado', emoji: '📝' },
      { number: 2, label: 'En el Horno', status: 'elaborando', emoji: '👨‍🍳' },
      { number: 3, label: 'Listo', status: 'listo', emoji: '✅' },
    ];

    return (
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`
              flex flex-col items-center
            `}>
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold mb-2
                ${currentStep >= step.number 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'bg-warm-200 text-warm-600'
                }
              `}>
                {step.emoji}
              </div>
              <div className="text-sm font-medium text-warm-700 text-center">
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                h-1 w-16 mx-4 rounded-full
                ${currentStep > step.number ? 'bg-primary-600' : 'bg-warm-200'}
              `}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center bg-white rounded-2xl p-8 shadow-lg border-2 border-primary-200">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-4 rounded-full">
            <Cookie className="h-12 w-12 text-primary-600" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-warm-800 mb-4 font-bakery">
          🍞 Seguimiento de Pedidos
        </h1>
        <p className="text-lg text-warm-600">
          Consulta el estado de tus pedidos de pan fresco y repostería artesanal
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-warm-200">
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-warm-700 mb-3 font-bakery">
              🆔 Número de Cédula
            </label>
            <div className="flex space-x-3">
              <input
                id="cedula"
                type="number"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ingresa tu número de cédula"
                className="input flex-1 text-lg py-3"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-2 px-8 py-3 text-lg rounded-xl"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span>{loading ? 'Buscando...' : 'Buscar Pedidos'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 alert alert-error">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-6">
          {pedidos.length > 0 ? (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
                <h2 className="text-xl font-semibold text-warm-800 mb-4 font-bakery flex items-center space-x-2">
                  <Cookie className="h-5 w-5 text-primary-600" />
                  <span>🥐 Tus Pedidos ({pedidos.length})</span>
                </h2>
                <p className="text-warm-600">
                  Aquí puedes ver el estado actual de todos tus pedidos de panadería.
                </p>
              </div>

              <div className="grid gap-6">
                {pedidos.map((pedido) => {
                  const statusInfo = getStatusInfo(pedido.EstadoPedido);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={pedido.NumPedido} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-warm-200">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-warm-50 to-primary-50 px-8 py-6 border-b border-warm-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-warm-800 font-bakery">
                              🧾 Pedido #{pedido.NumPedido}
                            </h3>
                            <p className="text-sm text-warm-600 flex items-center space-x-2 mt-1">
                              <Calendar className="h-4 w-4" />
                              <span>Entrega: {new Date(pedido.FechaEntrega).toLocaleDateString()}</span>
                            </p>
                          </div>
                          <div className="mt-3 md:mt-0">
                            <span className={`
                              inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold
                              ${statusInfo.bg} ${statusInfo.color} shadow-sm
                            `}>
                              <StatusIcon className="h-4 w-4 mr-2" />
                              {statusInfo.emoji} {pedido.EstadoPedido.charAt(0).toUpperCase() + pedido.EstadoPedido.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-8 py-6 space-y-6">
                        {/* Description */}
                        <div>
                          <h4 className="font-medium text-warm-800 mb-3 font-bakery flex items-center space-x-2">
                            <Cookie className="h-4 w-4 text-primary-600" />
                            <span>🥖 Tu Pedido:</span>
                          </h4>
                          <div className="bg-warm-50 rounded-lg p-4 border border-warm-200">
                            <p className="text-warm-700 text-lg">{pedido.descripcion}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <h4 className="font-medium text-warm-800 mb-4 font-bakery flex items-center space-x-2">
                            <ChefHat className="h-4 w-4 text-primary-600" />
                            <span>👨‍🍳 Estado de Preparación:</span>
                          </h4>
                          <div className="bg-warm-50 rounded-xl p-6 border border-warm-200">
                            {renderProgressBar(statusInfo.step)}
                          </div>
                        </div>

                        {/* Status Description */}
                        <div className={`rounded-xl p-6 ${statusInfo.bg} border border-warm-200`}>
                          <div className="flex items-start space-x-4">
                            <StatusIcon className={`h-6 w-6 mt-1 ${statusInfo.color}`} />
                            <div>
                              <h5 className={`font-semibold ${statusInfo.color} font-bakery text-lg`}>
                                {statusInfo.emoji} Estado: {pedido.EstadoPedido.charAt(0).toUpperCase() + pedido.EstadoPedido.slice(1)}
                              </h5>
                              <p className="text-warm-700 mt-2 leading-relaxed">
                                {statusInfo.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="flex items-center space-x-3 text-sm text-warm-600 bg-warm-50 p-3 rounded-lg">
                            <User className="h-4 w-4" />
                            <span>Cliente: {pedido.cedula}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-warm-600 bg-warm-50 p-3 rounded-lg">
                            <Calendar className="h-4 w-4" />
                            <span>Entrega: {new Date(pedido.FechaEntrega).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-warm-200">
              <div className="text-6xl mb-4">🥖</div>
              <h3 className="text-xl font-medium text-warm-800 mb-2 font-bakery">
                No se encontraron pedidos
              </h3>
              <p className="text-warm-600 mb-6">
                No hay pedidos registrados para la cédula {cedula}. 
                <br />¿Qué tal si haces tu primer pedido de pan fresco?
              </p>
              <button
                onClick={() => {
                  setCedula('');
                  setPedidos([]);
                  setSearched(false);
                  setError(null);
                }}
                className="btn bg-primary-600 text-white hover:bg-primary-700 px-6 py-3 rounded-xl"
              >
                Buscar Otra Cédula
              </button>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gradient-to-r from-primary-50 to-warm-50 border-2 border-primary-200 rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-primary-800 mb-4 font-bakery flex items-center space-x-2">
          <ChefHat className="h-5 w-5" />
          <span>🍞 ¿Cómo funciona el seguimiento?</span>
        </h3>
        <div className="space-y-3 text-primary-700">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <span><strong>📝 Recibido:</strong> Tu pedido ha sido confirmado y está en cola para preparación.</span>
          </div>
          <div className="flex items-center space-x-3">
            <ChefHat className="h-5 w-5 text-orange-600" />
            <span><strong>👨‍🍳 En el Horno:</strong> Nuestros panaderos están preparando tu pedido con amor.</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span><strong>✅ Listo:</strong> Tu pedido está terminado y listo para recoger.</span>
          </div>
        </div>
        <div className="mt-6 text-sm text-primary-600 bg-white/50 rounded-lg p-3">
          <strong>🏪 Horario de Atención:</strong> Lunes a Domingo de 6:00 AM a 8:00 PM
          <br />
          <strong>📍 Ubicación:</strong> Asegúrate de ingresar correctamente tu cédula para ver tus pedidos.
        </div>
      </div>
    </div>
  );
}