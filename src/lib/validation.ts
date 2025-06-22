// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Validation utility class
export class FormValidator {
  private rules: { [key: string]: ValidationRule } = {};
  private errors: ValidationErrors = {};

  setRules(rules: { [key: string]: ValidationRule }) {
    this.rules = rules;
    return this;
  }

  validate(data: { [key: string]: any }): ValidationErrors {
    this.errors = {};

    for (const [field, rule] of Object.entries(this.rules)) {
      const value = data[field];
      const error = this.validateField(field, value, rule);
      
      if (error) {
        this.errors[field] = error;
      }
    }

    return this.errors;
  }

  isValid(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  getErrors(): ValidationErrors {
    return this.errors;
  }

  private validateField(field: string, value: any, rule: ValidationRule): string | null {
    // Required validation
    if (rule.required && (value === null || value === undefined || value === '')) {
      return `${this.getFieldName(field)} es requerido`;
    }

    // Skip other validations if value is empty and not required
    if (!value && !rule.required) {
      return null;
    }

    // String length validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `${this.getFieldName(field)} debe tener al menos ${rule.minLength} caracteres`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return `${this.getFieldName(field)} no puede tener más de ${rule.maxLength} caracteres`;
      }
    }

    // Numeric validations
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      const numValue = Number(value);
      
      if (rule.min !== undefined && numValue < rule.min) {
        return `${this.getFieldName(field)} debe ser mayor o igual a ${rule.min}`;
      }

      if (rule.max !== undefined && numValue > rule.max) {
        return `${this.getFieldName(field)} debe ser menor o igual a ${rule.max}`;
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return `${this.getFieldName(field)} tiene un formato inválido`;
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  private getFieldName(field: string): string {
    // Convert camelCase to readable names
    const fieldNames: { [key: string]: string } = {
      cedula: 'Cédula',
      nombre: 'Nombre',
      apellido1: 'Primer apellido',
      apellido2: 'Segundo apellido',
      ciudad: 'Ciudad',
      indicaciones: 'Indicaciones', // Updated to plural
      FechaNacimiento: 'Fecha de nacimiento',
      Especialidad: 'Especialidad',
      Grado_academico: 'Grado académico',
      IDProveedor: 'ID Proveedor',
      NombreProveedor: 'Nombre del proveedor',
      IDMateriaPrima: 'ID Materia Prima',
      tipo: 'Tipo',
      marca: 'Marca',
      FechaDeCompra: 'Fecha de compra',
      precio: 'Precio',
      cantidad: 'Cantidad',
      IDProducto: 'ID Producto', // Updated field name
      ClienteFrecuente: 'Cliente frecuente',
      NumPedido: 'Número de pedido',
      descripcion: 'Descripción',
      FechaEntrega: 'Fecha de entrega',
      EstadoPedido: 'Estado del pedido',
    };

    return fieldNames[field] || field;
  }
}

// Common validation rules
export const commonRules = {
  cedula: {
    required: true,
    min: 1,
    custom: (value: any) => {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue <= 0) {
        return 'La cédula debe ser un número válido mayor a 0';
      }
      return null;
    }
  },
  
  nombre: {
    required: true,
    minLength: 2,
    maxLength: 15,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },

  apellido: {
    required: true,
    minLength: 2,
    maxLength: 15,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },

  fecha: {
    required: true,
    custom: (value: any) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      return null;
    }
  },

  precio: {
    required: true,
    min: 0,
    custom: (value: any) => {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        return 'El precio debe ser un número mayor o igual a 0';
      }
      return null;
    }
  },

  cantidad: {
    required: true,
    min: 0,
    custom: (value: any) => {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0 || !Number.isInteger(numValue)) {
        return 'La cantidad debe ser un número entero mayor o igual a 0';
      }
      return null;
    }
  },

  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  telefono: {
    pattern: /^\d{8,15}$/,
  }
};

// Pre-configured validators for each entity
export const validators = {
  empleado: new FormValidator().setRules({
    cedula: commonRules.cedula,
    nombre: commonRules.nombre,
    apellido1: commonRules.apellido,
    apellido2: commonRules.apellido,
    ciudad: { required: true, min: 1 },
    indicaciones: { required: true, maxLength: 200 }, // Updated to plural
    FechaNacimiento: commonRules.fecha,
    Especialidad: { required: true, maxLength: 50 },
    Grado_academico: { required: true, maxLength: 100 },
  }),

  cliente: new FormValidator().setRules({
    cedula: commonRules.cedula,
    nombre: commonRules.nombre,
    apellido1: commonRules.apellido,
    apellido2: commonRules.apellido,
    ciudad: { required: true, min: 1 },
    indicacion: { required: true, maxLength: 200 },
    FechaNacimiento: commonRules.fecha,
    ClienteFrecuente: {
      required: true,
      custom: (value: any) => {
        const numValue = Number(value);
        if (![0, 1].includes(numValue)) {
          return 'Cliente frecuente debe ser 0 (No) o 1 (Sí)';
        }
        return null;
      }
    },
  }),

  proveedor: new FormValidator().setRules({
    IDProveedor: { required: true, min: 1 },
    NombreProveedor: { required: true, maxLength: 30 },
    ciudad: { required: true, min: 1 },
    indicacion: { required: true, maxLength: 200 },
  }),

  materiaPrima: new FormValidator().setRules({
    IDMateriaPrima: { required: true, min: 1 },
    tipo: { required: true, maxLength: 100 },
    marca: { required: true, maxLength: 20 },
    nombre: { required: true, maxLength: 30 }, // Updated to lowercase
    FechaDeCompra: commonRules.fecha,
    precio: commonRules.precio,
    cantidad: commonRules.cantidad,
  }),

  producto: new FormValidator().setRules({
    IDProducto: { required: true, min: 1 }, // Updated field name
    tipo: { required: true, maxLength: 100 },
  }),
};