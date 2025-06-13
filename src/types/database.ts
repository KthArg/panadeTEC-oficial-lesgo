// Location types
export interface Ciudad {
  id_ciudad: number;
  ciudad: string;
  id_provincia: number;
}

export interface Provincia {
  id_provincias: number;
  Provincia: string;
  CodigoPostal: string;
}

export interface CodigoPostal {
  id_CodigoPostal: number;
  CodigoPostal: string;
}

// Personas and subtypes
export interface Persona {
  cedula: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  ciudad: number;
  indicacion: string;
  FechaNacimiento: Date;
}

export interface Empleado extends Persona {
  Especialidad: string;
  Grado_academico: string;
}

export interface Cliente extends Persona {
  ClienteFrecuente: number; // 1=yes, 0=no
}

export interface EmailPersona {
  cedula: number;
  correo: string;
}

export interface TelefonoPersona {
  cedula: number;
  telefono: number;
}

export interface Horario {
  cedula: number;
  HoraInicio: number;
  HoraFin: number;
}

// Proveedores
export interface Proveedor {
  IDProveedor: number;
  NombreProveedor: string;
  ciudad: number;
  indicacion: string;
}

export interface EmailProveedor {
  IDProveedor: number;
  correo: string;
}

export interface TelefonoProveedor {
  IDProveedor: number;
  telefono: number;
}

// Inventory
export interface MateriaPrima {
  IDMateriaPrima: number;
  tipo: string;
  marca: string;
  Nombre: string;
  FechaDeCompra: Date;
  precio: number;
  cantidad: number;
}

export interface Material extends MateriaPrima {
  Descripcion: string;
  Color: string;
}

export interface Ingrediente extends MateriaPrima {
  FechaDeExpiracion: Date;
}

export interface Producto {
  IDProductos: number;
  tipo: string;
}

// Operations
export interface Pedido {
  NumPedido: number;
  descripcion: string;
}

export interface Venta {
  IDVentas: number;
  FechaDeVenta: Date;
  CantidadVendida: number;
}

export interface Gasto {
  IDGasto: number;
  FechaDePago: Date;
  detalle: string;
  Categoria: string;
}

export interface Maquinaria {
  NumSerie: number;
  tipo: string;
  marca: string;
  Estado: string;
  FechaDeCompra: Date;
}

// Relationships
export interface ClientePedido {
  cedula: number;
  NumPedido: number;
  FechaEntrega: Date;
  EstadoPedido: 'encargado' | 'elaborando' | 'listo';
}

export interface ProveedorMateriaPrima {
  IDProveedor: number;
  IDMateriaPrima: number;
}

export interface PedidoProducto {
  NumPedido: number;
  IDProducto: number;
  cantidad: number;
  FechaElaboracion: Date;
}

// Combined types for UI
export interface MateriaPrimaCompleta extends MateriaPrima {
  Descripcion?: string;
  Color?: string;
  FechaDeExpiracion?: Date;
  isLowStock?: boolean;
  isExpiring?: boolean;
}

export interface PedidoCompleto extends Pedido {
  cedula: number;
  FechaEntrega: Date;
  EstadoPedido: string;
  nombreCliente?: string;
  apellidoCliente?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form data types
export interface PersonaFormData {
  cedula: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  ciudad: number;
  indicacion: string;
  FechaNacimiento: string;
}

export interface EmpleadoFormData extends PersonaFormData {
  Especialidad: string;
  Grado_academico: string;
}

export interface ClienteFormData extends PersonaFormData {
  ClienteFrecuente: number;
}

export interface ProveedorFormData {
  IDProveedor?: number;
  NombreProveedor: string;
  ciudad: number;
  indicacion: string;
}

export interface MateriaPrimaFormData {
  IDMateriaPrima?: number;
  tipo: string;
  marca: string;
  Nombre: string;
  FechaDeCompra: string;
  precio: number;
  cantidad: number;
  Descripcion?: string;
  Color?: string;
  FechaDeExpiracion?: string;
}

export interface ProductoFormData {
  IDProductos?: number;
  tipo: string;
}