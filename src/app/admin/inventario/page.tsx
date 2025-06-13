'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, Calendar, Wheat, Thermometer } from 'lucide-react';
import type { MateriaPrimaCompleta, ApiResponse } from '@/types/database';

export default function InventarioPage() {
  const [inventario, setInventario] = useState<MateriaPrimaCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MateriaPrimaCompleta | null>(null);
  const [userAuth, setUserAuth] = useState<string>('12345'); // Demo auth

  // Form state
  const [formData, setFormData] = useState({
    IDMateriaPrima: '',
    tipo: '',
    marca: '',
    Nombre: '',
    FechaDeCompra: '',
    precio: '',
    cantidad: '',
  });

  // Fetch inventory data
  const fetchInventario = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventario');
      const result: ApiResponse<MateriaPrimaCompleta[]> = await response.json();
      
      if (result.success && result.data) {
        setInventario(result.data);
      } else {
        setError(result.error || 'Error al cargar el inventario');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? '/api/inventario' : '/api/inventario';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userAuth,
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        await fetchInventario();
        setShowForm(false);
        setEditingItem(null);
        resetForm();
      } else {
        setError(result.error || 'Error al guardar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) return;
    
    try {
      const response = await fetch(`/api/inventario?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userAuth,
        },
      });

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        await fetchInventario();
      } else {
        setError(result.error || 'Error al eliminar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Handle edit
  const handleEdit = (item: MateriaPrimaCompleta) => {
    setEditingItem(item);
    setFormData({
      IDMateriaPrima: item.IDMateriaPrima.toString(),
      tipo: item.tipo,
      marca: item.marca,
      Nombre: item.Nombre,
      FechaDeCompra: new Date(item.FechaDeCompra).toISOString().split('T')[0],
      precio: item.precio.toString(),
      cantidad: item.cantidad.toString(),
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      IDMateriaPrima: '',
      tipo: '',
      marca: '',
      Nombre: '',
      FechaDeCompra: '',
      precio: '',
      cantidad: '',
    });
  };

  // Get alerts summary
  const getAlerts = () => {
    const lowStock = inventario.filter(item => item.isLowStock).length;
    const expiring = inventario.filter(item => item.isExpiring).length;
    return { lowStock, expiring };
  };

  const alerts = getAlerts();

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
            <Wheat className="h-8 w-8 text-primary-600" />
            <span>🌾 Control de Ingredientes</span>
          </h1>
          <p className="text-warm-600 text-lg">Administra harinas, levaduras, azúcar y todas tus materias primas</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>🥖 Nuevo Ingrediente</span>
        </button>
      </div>

      {/* Alerts */}
      {(alerts.lowStock > 0 || alerts.expiring > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.lowStock > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">⚠️ Ingredientes por Agotar</h3>
                  <p className="text-yellow-700">{alerts.lowStock} ingredientes con stock bajo - ¡Tiempo de reabastecer!</p>
                </div>
              </div>
            </div>
          )}
          {alerts.expiring > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">🕐 Próximos a Vencer</h3>
                  <p className="text-red-700">{alerts.expiring} ingredientes vencen pronto - ¡Úsalos primero!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 border-2 border-primary-200">
            <h2 className="text-xl font-bold mb-6 font-bakery text-warm-800 flex items-center space-x-2">
              <Wheat className="h-5 w-5 text-primary-600" />
              <span>{editingItem ? '✏️ Editar Ingrediente' : '➕ Nuevo Ingrediente'}</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  🆔 ID Ingrediente
                </label>
                <input
                  type="number"
                  value={formData.IDMateriaPrima}
                  onChange={(e) => setFormData({ ...formData, IDMateriaPrima: e.target.value })}
                  className="input"
                  required
                  disabled={!!editingItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  🏷️ Tipo de Ingrediente
                </label>
                <input
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="input"
                  placeholder="Ej: Harina, Levadura, Azúcar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  🏭 Marca
                </label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  className="input"
                  placeholder="Ej: Dos Pinos, Maizena"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  📦 Nombre del Producto
                </label>
                <input
                  type="text"
                  value={formData.Nombre}
                  onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                  className="input"
                  placeholder="Ej: Harina Todo Uso"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  📅 Fecha de Compra
                </label>
                <input
                  type="date"
                  value={formData.FechaDeCompra}
                  onChange={(e) => setFormData({ ...formData, FechaDeCompra: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  💰 Precio (₡)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="input"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  📊 Cantidad (kg/unidades)
                </label>
                <input
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  className="input"
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn bg-primary-600 text-white hover:bg-primary-700 flex-1 py-3 rounded-xl">
                  {editingItem ? '💾 Actualizar' : '➕ Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="btn bg-warm-200 text-warm-800 hover:bg-warm-300 flex-1 py-3 rounded-xl"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-warm-200">
        <div className="bg-warm-50 px-6 py-4 border-b border-warm-200">
          <h3 className="text-lg font-semibold text-warm-800 font-bakery flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-primary-600" />
            <span>📋 Inventario de Ingredientes</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>🏷️ Ingrediente</th>
                <th>🏭 Marca</th>
                <th>📊 Cantidad</th>
                <th>💰 Precio</th>
                <th>📅 Fecha Compra</th>
                <th>🚨 Estado</th>
                <th>⚙️ Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((item) => (
                <tr
                  key={item.IDMateriaPrima}
                  className={`
                    hover:bg-warm-25 transition-colors duration-200
                    ${item.isLowStock ? 'bg-yellow-50 border-l-4 border-yellow-500' : ''}
                    ${item.isExpiring ? 'bg-red-50 border-l-4 border-red-500' : ''}
                  `}
                >
                  <td className="font-bold text-primary-600">{item.IDMateriaPrima}</td>
                  <td>
                    <div>
                      <div className="font-medium text-warm-800">{item.Nombre}</div>
                      <div className="text-sm text-warm-600">{item.tipo}</div>
                    </div>
                  </td>
                  <td className="text-warm-700">{item.marca}</td>
                  <td>
                    <span className={`font-semibold ${item.isLowStock ? 'text-yellow-600' : 'text-warm-800'}`}>
                      {item.cantidad}
                    </span>
                  </td>
                  <td className="text-warm-700">₡{item.precio.toFixed(2)}</td>
                  <td className="text-warm-600 text-sm">{new Date(item.FechaDeCompra).toLocaleDateString()}</td>
                  <td>
                    <div className="flex flex-col space-y-1">
                      {item.isLowStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          ⚠️ Stock Bajo
                        </span>
                      )}
                      {item.isExpiring && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          🕐 Por Vencer
                        </span>
                      )}
                      {!item.isLowStock && !item.isExpiring && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Wheat className="h-3 w-3 mr-1" />
                          ✅ OK
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Editar ingrediente"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.IDMateriaPrima)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Eliminar ingrediente"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {inventario.length === 0 && (
          <div className="text-center py-12 text-warm-500">
            <Wheat className="h-16 w-16 mx-auto mb-4 text-warm-300" />
            <h3 className="text-lg font-medium text-warm-700 mb-2">
              🌾 Sin ingredientes registrados
            </h3>
            <p className="text-warm-600">
              Comienza agregando tus primeros ingredientes para la panadería.
            </p>
          </div>
        )}
      </div>

      {/* Bakery Tips */}
      <div className="bg-gradient-to-r from-primary-50 to-warm-50 border-l-4 border-primary-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-800 mb-3 font-bakery flex items-center space-x-2">
          <Wheat className="h-5 w-5" />
          <span>💡 Consejos para el Control de Ingredientes</span>
        </h3>
        <ul className="list-disc list-inside text-primary-700 space-y-2 text-sm">
          <li>🌡️ Almacena las harinas en lugares secos y frescos para mantener su calidad</li>
          <li>🔄 Aplica el método FIFO (Primero en Entrar, Primero en Salir) para ingredientes perecederos</li>
          <li>⚖️ Mantén al menos 20 kg de harina todo uso como stock mínimo</li>
          <li>🧊 Conserva la levadura fresca en refrigeración y revisa regularmente su fecha de vencimiento</li>
          <li>📊 Actualiza el inventario diariamente después del horneado matutino</li>
        </ul>
      </div>
    </div>
  );
}