'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, User, GraduationCap, Briefcase } from 'lucide-react';
import type { Empleado, ApiResponse } from '@/types/database';

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Empleado | null>(null);
  const [userAuth, setUserAuth] = useState<string>('12345'); // Demo auth

  // Form state
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    ciudad: '',
    indicacion: '',
    FechaNacimiento: '',
    Especialidad: '',
    Grado_academico: '',
  });

  // Fetch employees data
  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/empleados');
      const result: ApiResponse<Empleado[]> = await response.json();
      
      if (result.success && result.data) {
        setEmpleados(result.data);
      } else {
        setError(result.error || 'Error al cargar los empleados');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/empleados';
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
        await fetchEmpleados();
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
    if (!confirm('¿Estás seguro de que quieres eliminar este empleado?')) return;
    
    try {
      const response = await fetch(`/api/empleados?cedula=${cedula}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userAuth,
        },
      });

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        await fetchEmpleados();
      } else {
        setError(result.error || 'Error al eliminar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Handle edit
  const handleEdit = (item: Empleado) => {
    setEditingItem(item);
    setFormData({
      cedula: item.cedula.toString(),
      nombre: item.nombre,
      apellido1: item.apellido1,
      apellido2: item.apellido2,
      ciudad: item.ciudad.toString(),
      indicacion: item.indicacion,
      FechaNacimiento: new Date(item.FechaNacimiento).toISOString().split('T')[0],
      Especialidad: item.Especialidad,
      Grado_academico: item.Grado_academico,
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
      indicacion: '',
      FechaNacimiento: '',
      Especialidad: '',
      Grado_academico: '',
    });
  };

  // Get specialties
  const getSpecialties = () => {
    const specialties = new Map<string, number>();
    empleados.forEach(empleado => {
      specialties.set(empleado.Especialidad, (specialties.get(empleado.Especialidad) || 0) + 1);
    });
    return Array.from(specialties.entries()).map(([name, count]) => ({ name, count }));
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Empleados</h1>
          <p className="text-gray-600">Administra el personal y sus especialidades</p>
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
          <span>Nuevo Empleado</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Specialties Overview */}
      {empleados.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Especialidades del Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getSpecialties().map((specialty, index) => (
              <div key={index} className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{specialty.count}</div>
                <div className="text-sm text-gray-600 truncate">{specialty.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Empleado' : 'Nuevo Empleado'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad
                  </label>
                  <input
                    type="text"
                    value={formData.Especialidad}
                    onChange={(e) => setFormData({ ...formData, Especialidad: e.target.value })}
                    className="input"
                    required
                    maxLength={50}
                    placeholder="Ej: Administración, Operaciones, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grado Académico
                  </label>
                  <input
                    type="text"
                    value={formData.Grado_academico}
                    onChange={(e) => setFormData({ ...formData, Grado_academico: e.target.value })}
                    className="input"
                    required
                    maxLength={100}
                    placeholder="Ej: Licenciatura, Maestría, etc."
                  />
                </div>
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

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empleados.map((empleado) => (
          <div key={empleado.cedula} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {empleado.nombre} {empleado.apellido1}
                  </h3>
                  <p className="text-sm text-gray-500">Cédula: {empleado.cedula}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(empleado)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(empleado.cedula)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Especialidad:</span>
                <span className="font-medium text-orange-600">{empleado.Especialidad}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Grado:</span>
                <span className="font-medium">{empleado.Grado_academico}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Nombre completo:</strong>
                <p>{empleado.nombre} {empleado.apellido1} {empleado.apellido2}</p>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Fecha de nacimiento:</strong>
                <p>{new Date(empleado.FechaNacimiento).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {empleados.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay empleados registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza agregando tu primer empleado al sistema.
          </p>
          <button
            onClick={() => {
              setEditingItem(null);
              resetForm();
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            Agregar Primer Empleado
          </button>
        </div>
      )}

      {/* Employees Table */}
      {empleados.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista Completa de Empleados
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre Completo</th>
                  <th>Especialidad</th>
                  <th>Grado Académico</th>
                  <th>Ciudad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((empleado) => (
                  <tr key={empleado.cedula}>
                    <td className="font-medium">{empleado.cedula}</td>
                    <td>{empleado.nombre} {empleado.apellido1} {empleado.apellido2}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {empleado.Especialidad}
                      </span>
                    </td>
                    <td className="text-sm">{empleado.Grado_academico}</td>
                    <td>{empleado.ciudad}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(empleado)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(empleado.cedula)}
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
      {empleados.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas del Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{empleados.length}</div>
              <div className="text-sm text-gray-600">Total Empleados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getSpecialties().length}
              </div>
              <div className="text-sm text-gray-600">Especialidades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(empleados.reduce((acc, emp) => {
                  const age = new Date().getFullYear() - new Date(emp.FechaNacimiento).getFullYear();
                  return acc + age;
                }, 0) / empleados.length)}
              </div>
              <div className="text-sm text-gray-600">Edad Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(empleados.map(emp => emp.ciudad)).size}
              </div>
              <div className="text-sm text-gray-600">Ciudades</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}