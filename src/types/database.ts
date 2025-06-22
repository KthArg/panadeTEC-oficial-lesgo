// Location types - Exactly matching the database structure
export interface Provincia {
  id_provincia: number;
  provincia: string;
}

export interface CodigoPostal {
  id_CodigoPostal: number;
  codigo_postal: string;
}

export interface Ciudad {
  id_ciudad: number;
  ciudad: string;
  id_provincia: number;
}

// Personas and subtypes - Exactly matching the database
export interface Persona {
  cedula: number;
  nombre: string; // CHAR(15)
  apellido1: string; // CHAR(15)
  apellido2: string; // CHAR(15)
  ciudad: number; // SMALLINT - references Ciudades
  indicaciones: string; // VARCHAR(200) - Note: plural in DB
  FechaNacimiento: Date;
}

export interface Empleado extends Persona {
  Especialidad: string; // VARCHAR(50)
  Grado_academico: string; // VARCHAR(100)
}

export interface ClienteFrecuenteTipo {
  valor: number; // TINYINT (0 or 1)
  descripcion: string; // VARCHAR(10) - 'No' or 'Sí'
}

export interface Cliente extends Persona {
  ClienteFrecuente: number; // TINYINT - references ClienteFrecuenteTipo
}

// Multi-valued attributes
export interface TelefonoPersona {
  cedula: number;
  telefono: number; // INT
}

export interface EmailPersona {
  cedula: number;
  correo: string; // VARCHAR(50)
}

export interface Horario {
  cedula: number;
  HoraInicio: string; // TIME
  HoraFin: string; // TIME
}

// Proveedores - Exactly matching the database
export interface Proveedor {
  IDProveedor: number;
  NombreProveedor: string; // CHAR(30)
  ciudad: number; // SMALLINT - references Ciudades
  indicacion: string; // VARCHAR(200) - Note: singular in DB
}

export interface TelefonoProveedor {
  IDProveedor: number;
  telefono: number;
}

export interface EmailProveedor {
  IDProveedor: number;
  correo: string;
}

// Inventory - Materias Primas with inheritance
export interface MateriaPrima {
  IDMateriaPrima: number;
  tipo: string; // VARCHAR(100)
  marca: string; // VARCHAR(20)
  nombre: string; // VARCHAR(30) - lowercase in DB
  FechaDeCompra: Date;
  precio: number; // DECIMAL(10,2)
  cantidad: number; // INT
}

// Subclasses of MateriaPrima
export interface Material extends MateriaPrima {
  descripcion: string; // VARCHAR(200)
  color: string; // VARCHAR(100)
}

export interface Ingrediente extends MateriaPrima {
  fecha_expiracion: Date; // lowercase in DB
}

// Products
export interface Producto {
  IDProducto: number; // Note: different from what I used before (IDProductos)
  tipo: string; // VARCHAR(100)
}

// Operations
export interface Pedido {
  NumPedido: number;
  descripcion: string; // VARCHAR(200)
}

export interface Venta {
  IDVentas: number;
  FechaDeVenta: Date;
  CantidadVendida: number;
}

export interface Gasto {
  IDGasto: number;
  FechaDePago: Date;
  detalle: string; // VARCHAR(20)
  categoria: string; // VARCHAR(30)
}

export interface Maquinaria {
  NumSerie: number;
  tipo: string; // VARCHAR(100)
  marca: string; // VARCHAR(20)
  Estado: string; // CHAR(15) - CHECK ('funcionando', 'descompuesto')
  FechaDeCompra: Date;
}

// Relationship tables - Exactly as in database
export interface CL_PE {
  cedula: number;
  NumPedido: number;
  FechaEntrega: Date; // DATETIME
  EstadoPedido: 'encargado' | 'elaborando' | 'listo'; // CHAR(10)
}

export interface PED_GAS {
  NumPedido: number;
  IDGasto: number;
}

export interface GA_VE {
  IDGasto: number;
  IDVentas: number;
}

export interface PEDPRO_VENTAS {
  NumPedido: number;
  IDProducto: number;
  IDVentas: number;
}

export interface PED_PRO {
  NumPedido: number;
  IDProducto: number;
  cantidad: number;
  FechaElaboracion: Date;
}

export interface MAQUIN_PEDPRO {
  NumPedido: number;
  IDProducto: number;
  NumSerie: number;
}

export interface MATP_PROD {
  NumPedido: number;
  IDMateriaPrima: number;
}

export interface PROV_MATP {
  IDMateriaPrima: number;
  IDProveedor: number;
}

// Combined types for UI (joining data)
export interface MateriaPrimaCompleta extends MateriaPrima {
  descripcion?: string; // From Material subclass
  color?: string; // From Material subclass
  fecha_expiracion?: Date; // From Ingrediente subclass
  isLowStock?: boolean;
  isExpiring?: boolean;
}

export interface EmpleadoCompleto extends Empleado {
  ciudad_nombre?: string; // Joined from Ciudades
  provincia_nombre?: string; // Joined from Provincias
  telefono?: number; // From Telefonos_Personas
  correo?: string; // From Email_Personas
  HoraInicio?: string; // From Horarios
  HoraFin?: string; // From Horarios
}

export interface ClienteCompleto extends Cliente {
  ciudad_nombre?: string;
  provincia_nombre?: string;
  telefono?: number;
  correo?: string;
  ClienteFrecuente_descripcion?: string; // 'No' or 'Sí'
}

export interface ProveedorCompleto extends Proveedor {
  ciudad_nombre?: string;
  provincia_nombre?: string;
  telefonos?: number[];
  correos?: string[];
}

export interface PedidoCompleto extends Pedido {
  cedula: number;
  FechaEntrega: Date;
  EstadoPedido: string;
  nombreCliente?: string;
  apellidoCliente?: string;
  productos?: {
    IDProducto: number;
    tipo: string;
    cantidad: number;
    FechaElaboracion: Date;
  }[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form data types - matching the exact database structure
export interface PersonaFormData {
  cedula: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  ciudad: number;
  indicaciones: string; // plural as in DB
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
  indicacion: string; // singular as in DB
}

export interface MateriaPrimaFormData {
  IDMateriaPrima?: number;
  tipo: string;
  marca: string;
  nombre: string; // lowercase as in DB
  FechaDeCompra: string;
  precio: number;
  cantidad: number;
  // Optional subclass fields
  descripcion?: string;
  color?: string;
  fecha_expiracion?: string;
}

export interface ProductoFormData {
  IDProducto?: number; // Correct field name
  tipo: string;
}

export interface PedidoFormData {
  NumPedido?: number;
  descripcion: string;
  cedula: number;
  FechaEntrega: string;
  EstadoPedido?: 'encargado' | 'elaborando' | 'listo';
}