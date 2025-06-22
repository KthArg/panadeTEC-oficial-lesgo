'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ShoppingCart, Package } from 'lucide-react';
import type { Producto, ApiResponse } from '@/types/database';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Producto | null>(null);
  const [userAuth, setUserAuth] = useState<string>('208340123'); // Demo auth

  // Form state
  const [formData, setFormData] = useState({
    IDProducto: '', // Updated field name
    tipo: '',
  });

  // Fetch products data
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/productos');
      const result: ApiResponse<Producto[]> = await response.json();
      
      if (result.success && result.data) {
        setProductos(result.data);
      } else {
        setError(result.error || 'Error al cargar los productos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/productos';
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
        await fetchProductos();
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
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    try {
      const response = await fetch(`/api/productos?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userAuth,
        },
      });

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        await fetchProductos();
      } else {
        setError(result.error || 'Error al eliminar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Handle edit
  const handleEdit = (item: Producto) => {
    setEditingItem(item);
    setFormData({
      IDProducto: item.IDProducto.toString(), // Updated field name
      tipo: item.tipo,
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      IDProducto: '', // Updated field name
      tipo: '',
    });
  };

  // Get product categories
  const getCategories = () => {
    const categories = new Map<string, number>();
    productos.forEach(producto => {
      categories.set(producto.tipo, (categories.get(producto.tipo) || 0) + 1);
    });
    return Array.from(categories.entries()).map(([name, count]) => ({ name, count }));
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600">Administra tu catálogo de productos terminados</p>
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
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Categories Overview */}
      {productos.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categorías de Productos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getCategories().map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{category.count}</div>
                <div className="text-sm text-gray-600 truncate">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Producto
                </label>
                <input
                  type="number"
                  value={formData.IDProducto}
                  onChange={(e) => setFormData({ ...formData, IDProducto: e.target.value })}
                  className="input"
                  required
                  disabled={!!editingItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Producto
                </label>
                <input
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="input"
                  required
                  maxLength={100}
                  placeholder="Ej: Bebida, Comida, Snack, etc."
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div key={producto.IDProducto} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Producto #{producto.IDProducto}
                  </h3>
                  <p className="text-sm text-gray-500">{producto.tipo}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(producto)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(producto.IDProducto)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Categoría:</span>
                <span className="font-medium text-purple-600">{producto.tipo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {productos.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay productos registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza agregando tu primer producto al catálogo.
          </p>
          <button
            onClick={() => {
              setEditingItem(null);
              resetForm();
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            Agregar Primer Producto
          </button>
        </div>
      )}

      {/* Products Table (Alternative View) */}
      {productos.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista Completa de Productos
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Producto</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.IDProducto}>
                    <td className="font-medium">{producto.IDProducto}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {producto.tipo}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(producto.IDProducto)}
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
        </div>
      )}

      {/* Stats */}
      {productos.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas de Productos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{productos.length}</div>
              <div className="text-sm text-gray-600">Total Productos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getCategories().length}
              </div>
              <div className="text-sm text-gray-600">Categorías Únicas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getCategories().reduce((max, cat) => Math.max(max, cat.count), 0)}
              </div>
              <div className="text-sm text-gray-600">Max por Categoría</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}