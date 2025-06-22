'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, Calendar, Package } from 'lucide-react';
import type { MateriaPrimaCompleta, ApiResponse } from '@/types/database';

export default function InventarioPage() {
  const [inventario, setInventario] = useState<MateriaPrimaCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MateriaPrimaCompleta | null>(null);
  const [userAuth, setUserAuth] = useState<string>('208340123'); // Demo auth

  // Form state
  const [formData, setFormData] = useState({
    IDMateriaPrima: '',
    tipo: '',
    marca: '',
    nombre: '', // lowercase as in DB
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
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;
    
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
      nombre: item.nombre,
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
      nombre: '',
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">Administra las materias primas y monitorea el stock</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Materia Prima</span>
        </button>
      </div>

      {/* Alerts */}
      {(alerts.lowStock > 0 || alerts.expiring > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.lowStock > 0 && (
            <div className="alert alert-warning flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>{alerts.lowStock} elementos con stock bajo</span>
            </div>
          )}
          {alerts.expiring > 0 && (
            <div className="alert alert-error flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{alerts.expiring} elementos próximos a vencer</span>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Materia Prima' : 'Nueva Materia Prima'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Materia Prima
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <input
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Compra
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Marca</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Fecha Compra</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((item) => (
                <tr
                  key={item.IDMateriaPrima}
                  className={`
                    ${item.isLowStock ? 'low-stock' : ''}
                    ${item.isExpiring ? 'expiring' : ''}
                  `}
                >
                  <td className="font-medium">{item.IDMateriaPrima}</td>
                  <td>{item.nombre}</td>
                  <td>{item.tipo}</td>
                  <td>{item.marca}</td>
                  <td>
                    <span className={`${item.isLowStock ? 'text-yellow-600 font-semibold' : ''}`}>
                      {item.cantidad}
                    </span>
                  </td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>{new Date(item.FechaDeCompra).toLocaleDateString()}</td>
                  <td>
                    <div className="flex flex-col space-y-1">
                      {item.isLowStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Stock Bajo
                        </span>
                      )}
                      {item.isExpiring && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          Por Vencer
                        </span>
                      )}
                      {!item.isLowStock && !item.isExpiring && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Package className="h-3 w-3 mr-1" />
                          Normal
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.IDMateriaPrima)}
                        className="p-1 text-red-600 hover:text-red-800"
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
          <div className="text-center py-8 text-gray-500">
            No hay elementos en el inventario
          </div>
        )}
      </div>
    </div>
  );
}