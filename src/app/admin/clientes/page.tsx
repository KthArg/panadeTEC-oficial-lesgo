'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, User, Star, Calendar } from 'lucide-react';
import type { Cliente, ApiResponse } from '@/types/database';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Cliente | null>(null);
  const [userAuth, setUserAuth] = useState<string>('208340123'); // Demo auth

  // Form state
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    ciudad: '',
    indicaciones: '', // plural as in DB
    FechaNacimiento: '',
    ClienteFrecuente: '0',
  });

  // Fetch clients data
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clientes');
      const result: ApiResponse<Cliente[]> = await response.json();
      
      if (result.success && result.data) {
        setClientes(result.data);
      } else {
        setError(result.error || 'Error al cargar los clientes');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/clientes';
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
        await fetchClientes();
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
  const handleDelete = async (cedula: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) return;
    
    try {
      const response = await fetch(`/api/clientes?cedula=${cedula}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userAuth,
        },
      });

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        await fetchClientes();
      } else {
        setError(result.error || 'Error al eliminar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Handle edit
  const handleEdit = (item: Cliente) => {
    setEditingItem(item);
    setFormData({
      cedula: item.cedula.toString(),
      nombre: item.nombre,
      apellido1: item.apellido1,
      apellido2: item.apellido2,
      ciudad: item.ciudad.toString(),
      indicaciones: item.indicaciones,
      FechaNacimiento: new Date(item.FechaNacimiento).toISOString().split('T')[0],
      ClienteFrecuente: item.ClienteFrecuente.toString(),
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      cedula: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      ciudad: '',
      indicaciones: '',
      FechaNacimiento: '',
      ClienteFrecuente: '0',
    });
  };

  // Get client stats
  const getClientStats = () => {
    const frecuentes = clientes.filter(cliente => cliente.ClienteFrecuente === 1).length;
    const regulares = clientes.length - frecuentes;
    return { frecuentes, regulares };
  };

  const stats = getClientStats();

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600">Administra la base de datos de clientes</p>
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
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Client Stats Overview */}
      {clientes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen de Clientes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-pink-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{clientes.length}</div>
              <div className="text-sm text-gray-600">Total Clientes</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.frecuentes}</div>
              <div className="text-sm text-gray-600">Clientes Frecuentes</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.regulares}</div>
              <div className="text-sm text-gray-600">Clientes Regulares</div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula
                  </label>
                  <input
                    type="number"
                    value={formData.cedula}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    className="input"
                    required
                    disabled={!!editingItem}
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
                    maxLength={15}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primer Apellido
                  </label>
                  <input
                    type="text"
                    value={formData.apellido1}
                    onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
                    className="input"
                    required
                    maxLength={15}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    value={formData.apellido2}
                    onChange={(e) => setFormData({ ...formData, apellido2: e.target.value })}
                    className="input"
                    required
                    maxLength={15}
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
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={formData.FechaNacimiento}
                    onChange={(e) => setFormData({ ...formData, FechaNacimiento: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente Frecuente
                </label>
                <select
                  value={formData.ClienteFrecuente}
                  onChange={(e) => setFormData({ ...formData, ClienteFrecuente: e.target.value })}
                  className="input"
                  required
                >
                  <option value="0">No</option>
                  <option value="1">Sí</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Indicación/Dirección
                </label>
                <textarea
                  value={formData.indicaciones}
                  onChange={(e) => setFormData({ ...formData, indicaciones: e.target.value })}
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

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => (
          <div key={cliente.cedula} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${cliente.ClienteFrecuente ? 'bg-yellow-100' : 'bg-pink-100'}`}>
                  {cliente.ClienteFrecuente ? (
                    <Star className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <User className="h-6 w-6 text-pink-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {cliente.nombre} {cliente.apellido1}
                  </h3>
                  <p className="text-sm text-gray-500">Cédula: {cliente.cedula}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                {cliente.ClienteFrecuente === 1 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Frecuente
                  </span>
                )}
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.cedula)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <strong>Nombre completo:</strong>
                <p>{cliente.nombre} {cliente.apellido1} {cliente.apellido2}</p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Nacimiento:</span>
                <span>{new Date(cliente.FechaNacimiento).toLocaleDateString()}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Ciudad ID:</strong> {cliente.ciudad}
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Dirección:</strong>
                <p className="truncate">{cliente.indicaciones}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {clientes.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay clientes registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza agregando tu primer cliente al sistema.
          </p>
          <button
            onClick={() => {
              setEditingItem(null);
              resetForm();
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            Agregar Primer Cliente
          </button>
        </div>
      )}

      {/* Clients Table */}
      {clientes.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista Completa de Clientes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre Completo</th>
                  <th>Ciudad</th>
                  <th>Fecha Nacimiento</th>
                  <th>Cliente Frecuente</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.cedula}>
                    <td className="font-medium">{cliente.cedula}</td>
                    <td>{cliente.nombre} {cliente.apellido1} {cliente.apellido2}</td>
                    <td>{cliente.ciudad}</td>
                    <td>{new Date(cliente.FechaNacimiento).toLocaleDateString()}</td>
                    <td>
                      {cliente.ClienteFrecuente === 1 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Frecuente
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Regular
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.cedula)}
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

      {/* Additional Stats */}
      {clientes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas Detalladas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{clientes.length}</div>
              <div className="text-sm text-gray-600">Total Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round((stats.frecuentes / clientes.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">% Frecuentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(clientes.reduce((acc, cli) => {
                  const age = new Date().getFullYear() - new Date(cli.FechaNacimiento).getFullYear();
                  return acc + age;
                }, 0) / clientes.length)}
              </div>
              <div className="text-sm text-gray-600">Edad Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(clientes.map(cli => cli.ciudad)).size}
              </div>
              <div className="text-sm text-gray-600">Ciudades</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}