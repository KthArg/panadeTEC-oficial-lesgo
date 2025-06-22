'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, MapPin } from 'lucide-react';
import type { Proveedor, ApiResponse } from '@/types/database';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Proveedor | null>(null);
  const [userAuth, setUserAuth] = useState<string>('208340123'); // Demo auth

  // Form state
  const [formData, setFormData] = useState({
    IDProveedor: '',
    NombreProveedor: '',
    ciudad: '',
    indicacion: '',
  });

  // Fetch suppliers data
  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/proveedores');
      const result: ApiResponse<Proveedor[]> = await response.json();
      
      if (result.success && result.data) {
        setProveedores(result.data);
      } else {
        setError(result.error || 'Error al cargar los proveedores');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/proveedores';
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
        await fetchProveedores();
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
    if (!confirm('¿Estás seguro de que quieres eliminar este proveedor?')) return;
    
    try {
      const response = await fetch(`/api/proveedores?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userAuth,
        },
      });

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        await fetchProveedores();
      } else {
        setError(result.error || 'Error al eliminar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Handle edit
  const handleEdit = (item: Proveedor) => {
    setEditingItem(item);
    setFormData({
      IDProveedor: item.IDProveedor.toString(),
      NombreProveedor: item.NombreProveedor,
      ciudad: item.ciudad.toString(),
      indicacion: item.indicacion,
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      IDProveedor: '',
      NombreProveedor: '',
      ciudad: '',
      indicacion: '',
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Proveedores</h1>
          <p className="text-gray-600">Administra la información de tus proveedores</p>
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
          <span>Nuevo Proveedor</span>
        </button>
      </div>

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
              {editingItem ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Proveedor
                </label>
                <input
                  type="number"
                  value={formData.IDProveedor}
                  onChange={(e) => setFormData({ ...formData, IDProveedor: e.target.value })}
                  className="input"
                  required
                  disabled={!!editingItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Proveedor
                </label>
                <input
                  type="text"
                  value={formData.NombreProveedor}
                  onChange={(e) => setFormData({ ...formData, NombreProveedor: e.target.value })}
                  className="input"
                  required
                  maxLength={30}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad (ID)
                </label>
                <input
                  type="number"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Indicación/Dirección
                </label>
                <textarea
                  value={formData.indicacion}
                  onChange={(e) => setFormData({ ...formData, indicacion: e.target.value })}
                  className="input"
                  required
                  maxLength={200}
                  rows={3}
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

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proveedores.map((proveedor) => (
          <div key={proveedor.IDProveedor} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {proveedor.NombreProveedor}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {proveedor.IDProveedor}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(proveedor)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(proveedor.IDProveedor)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Ciudad ID: {proveedor.ciudad}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Dirección:</strong>
                <p className="mt-1">{proveedor.indicacion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {proveedores.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay proveedores registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza agregando tu primer proveedor para gestionar el inventario.
          </p>
          <button
            onClick={() => {
              setEditingItem(null);
              resetForm();
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            Agregar Primer Proveedor
          </button>
        </div>
      )}

      {/* Stats */}
      {proveedores.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen de Proveedores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{proveedores.length}</div>
              <div className="text-sm text-gray-600">Total Proveedores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(proveedores.map(p => p.ciudad)).size}
              </div>
              <div className="text-sm text-gray-600">Ciudades Diferentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(proveedores.reduce((acc, p) => acc + p.NombreProveedor.length, 0) / proveedores.length)}
              </div>
              <div className="text-sm text-gray-600">Promedio Longitud Nombre</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}