'use client';

import { useState, useEffect } from 'react';
import { Cookie, Clock, CheckCircle, AlertCircle, Filter, Search, ChefHat, Thermometer } from 'lucide-react';
import type { PedidoCompleto, ApiResponse } from '@/types/database';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [userAuth, setUserAuth] = useState<string>('208340123'); // Demo auth

  // Fetch orders data
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pedidos', {
        headers: {
          'x-user-id': userAuth,
        },
      });
      const result: ApiResponse<PedidoCompleto[]> = await response.json();
      
      if (result.success && result.data) {
        setPedidos(result.data);
      } else {
        setError(result.error || 'Error al cargar los pedidos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (NumPedido: number, newStatus: string) => {
    try {
      const response = await fetch('/api/pedidos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userAuth,
        },
        body: JSON.stringify({
          NumPedido,
          EstadoPedido: newStatus,
        }),
      });

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        await fetchPedidos();
      } else {
        setError(result.error || 'Error al actualizar el estado');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Filter orders
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesStatus = selectedStatus === 'todos' || pedido.EstadoPedido === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      pedido.NumPedido.toString().includes(searchTerm) ||
      pedido.cedula.toString().includes(searchTerm) ||
      pedido.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pedido.nombreCliente && pedido.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'encargado':
        return { 
          icon: Clock, 
          color: 'text-amber-600', 
          bg: 'bg-amber-100',
          emoji: '📝',
          description: 'Pedido recibido'
        };
      case 'elaborando':
        return { 
          icon: ChefHat, 
          color: 'text-orange-600', 
          bg: 'bg-orange-100',
          emoji: '👨‍🍳',
          description: 'En el horno'
        };
      case 'listo':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600', 
          bg: 'bg-green-100',
          emoji: '✅',
          description: 'Listo para entrega'
        };
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-gray-600', 
          bg: 'bg-gray-100',
          emoji: '❓',
          description: 'Estado desconocido'
        };
    }
  };

  // Get order stats
  const getOrderStats = () => {
    const stats = {
      total: pedidos.length,
      encargado: pedidos.filter(p => p.EstadoPedido === 'encargado').length,
      elaborando: pedidos.filter(p => p.EstadoPedido === 'elaborando').length,
      listo: pedidos.filter(p => p.EstadoPedido === 'listo').length,
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-warm-800 font-bakery flex items-center space-x-2">
            <Cookie className="h-8 w-8 text-primary-600" />
            <span>🧾 Gestión de Pedidos</span>
          </h1>
          <p className="text-warm-600 text-lg">Administra los pedidos especiales de tus clientes</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Order Stats */}
      {pedidos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
          <h3 className="text-lg font-semibold text-warm-800 mb-4 font-bakery flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-primary-600" />
            <span>🔥 Estado del Horno</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-warm-50 rounded-xl p-4 text-center border border-warm-200">
              <div className="text-2xl font-bold text-warm-700">{stats.total}</div>
              <div className="text-sm text-warm-600">📋 Total Pedidos</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
              <div className="text-2xl font-bold text-amber-600">{stats.encargado}</div>
              <div className="text-sm text-warm-600">📝 Recibidos</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{stats.elaborando}</div>
              <div className="text-sm text-warm-600">👨‍🍳 En el Horno</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stats.listo}</div>
              <div className="text-sm text-warm-600">✅ Listos</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-warm-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input max-w-xs"
            >
              <option value="todos">🍞 Todos los estados</option>
              <option value="encargado">📝 Recibidos</option>
              <option value="elaborando">👨‍🍳 En el Horno</option>
              <option value="listo">✅ Listos</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-warm-400" />
            <input
              type="text"
              placeholder="🔍 Buscar por número, cliente o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input max-w-md"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-warm-200">
        <div className="bg-warm-50 px-6 py-4 border-b border-warm-200">
          <h3 className="text-lg font-semibold text-warm-800 font-bakery flex items-center space-x-2">
            <Cookie className="h-5 w-5 text-primary-600" />
            <span>🧾 Lista de Pedidos</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>📋 Nº Pedido</th>
                <th>👤 Cliente</th>
                <th>🥖 Producto/Descripción</th>
                <th>📅 Fecha Entrega</th>
                <th>🔥 Estado Actual</th>
                <th>⚙️ Cambiar Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredPedidos.map((pedido) => {
                const statusInfo = getStatusIcon(pedido.EstadoPedido);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={pedido.NumPedido} className="hover:bg-warm-25">
                    <td className="font-bold text-primary-600">{pedido.NumPedido}</td>
                    <td>
                      <div>
                        <div className="font-medium text-warm-800">
                          {pedido.nombreCliente ? 
                            `${pedido.nombreCliente} ${pedido.apellidoCliente}` : 
                            `Cliente #${pedido.cedula}`
                          }
                        </div>
                        <div className="text-sm text-warm-500">
                          🆔 {pedido.cedula}
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs">
                      <div className="truncate text-warm-700" title={pedido.descripcion}>
                        🥖 {pedido.descripcion}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-warm-700">
                        📅 {new Date(pedido.FechaEntrega).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-warm-500">
                        🕐 {new Date(pedido.FechaEntrega).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color} shadow-sm`}>
                        <StatusIcon className="h-4 w-4 mr-2" />
                        {statusInfo.emoji} {pedido.EstadoPedido.charAt(0).toUpperCase() + pedido.EstadoPedido.slice(1)}
                      </span>
                    </td>
                    <td>
                      <select
                        value={pedido.EstadoPedido}
                        onChange={(e) => handleStatusUpdate(pedido.NumPedido, e.target.value)}
                        className="input text-sm py-2 px-3 rounded-lg"
                      >
                        <option value="encargado">📝 Recibido</option>
                        <option value="elaborando">👨‍🍳 En el Horno</option>
                        <option value="listo">✅ Listo</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredPedidos.length === 0 && pedidos.length > 0 && (
          <div className="text-center py-8 text-warm-500">
            🔍 No se encontraron pedidos con los filtros seleccionados
          </div>
        )}
        
        {pedidos.length === 0 && (
          <div className="text-center py-12">
            <Cookie className="h-16 w-16 text-warm-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-warm-700 mb-2 font-bakery">
              🥖 No hay pedidos registrados
            </h3>
            <p className="text-warm-600">
              Los pedidos especiales de tus clientes aparecerán aquí cuando los realicen.
            </p>
          </div>
        )}
      </div>

      {/* Status Workflow Guide */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
        <h3 className="text-lg font-semibold text-warm-800 mb-4 font-bakery flex items-center space-x-2">
          <ChefHat className="h-5 w-5 text-primary-600" />
          <span>👨‍🍳 Flujo de Trabajo en la Panadería</span>
        </h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3 bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-amber-700">📝 Recibido</div>
              <div className="text-sm text-warm-600">Pedido confirmado</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="h-0.5 w-8 bg-warm-300"></div>
            <div className="mx-2 text-warm-400">→</div>
            <div className="h-0.5 w-8 bg-warm-300"></div>
          </div>
          
          <div className="flex items-center space-x-3 bg-orange-50 p-4 rounded-xl border border-orange-200">
            <div className="bg-orange-100 p-3 rounded-full">
              <ChefHat className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="font-semibold text-orange-700">👨‍🍳 En el Horno</div>
              <div className="text-sm text-warm-600">Preparándose</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="h-0.5 w-8 bg-warm-300"></div>
            <div className="mx-2 text-warm-400">→</div>
            <div className="h-0.5 w-8 bg-warm-300"></div>
          </div>
          
          <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-green-700">✅ Listo</div>
              <div className="text-sm text-warm-600">Para entregar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {pedidos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-warm-200">
          <h3 className="text-lg font-semibold text-warm-800 mb-4 font-bakery flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-primary-600" />
            <span>🔥 Acciones Rápidas del Horno</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                pedidos
                  .filter(p => p.EstadoPedido === 'encargado')
                  .forEach(p => handleStatusUpdate(p.NumPedido, 'elaborando'));
              }}
              className="btn bg-orange-600 text-white hover:bg-orange-700 text-sm py-3 rounded-xl"
              disabled={stats.encargado === 0}
            >
              👨‍🍳 Meter todos al horno
            </button>
            <button
              onClick={() => {
                pedidos
                  .filter(p => p.EstadoPedido === 'elaborando')
                  .forEach(p => handleStatusUpdate(p.NumPedido, 'listo'));
              }}
              className="btn bg-green-600 text-white hover:bg-green-700 text-sm py-3 rounded-xl"
              disabled={stats.elaborando === 0}
            >
              ✅ Sacar todos del horno
            </button>
            <button
              onClick={() => fetchPedidos()}
              className="btn bg-primary-600 text-white hover:bg-primary-700 text-sm py-3 rounded-xl"
            >
              🔄 Actualizar Lista
            </button>
          </div>
        </div>
      )}

      {/* Bakery Tips */}
      <div className="bg-gradient-to-r from-primary-50 to-warm-50 border-l-4 border-primary-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-800 mb-3 font-bakery flex items-center space-x-2">
          <ChefHat className="h-5 w-5" />
          <span>💡 Tips para Gestión de Pedidos</span>
        </h3>
        <ul className="list-disc list-inside text-primary-700 space-y-2 text-sm">
          <li>🕐 Programa los pedidos especiales con al menos 24 horas de anticipación</li>
          <li>🌡️ Verifica que el horno esté precalentado antes de marcar como "elaborando"</li>
          <li>📞 Llama a los clientes cuando sus pedidos estén listos</li>
          <li>📋 Revisa los ingredientes disponibles antes de confirmar pedidos grandes</li>
          <li>⏰ Establece horarios específicos para recoger pedidos especiales</li>
        </ul>
      </div>
    </div>
  );
}