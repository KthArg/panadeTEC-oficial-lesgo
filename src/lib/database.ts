import sql from 'mssql';

// Database configuration
const dbConfig: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'OperationsManagement',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Database connection pool
let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function getDbPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(dbConfig).connect();
    
    poolPromise.catch((err) => {
      console.error('Database connection failed:', err);
      poolPromise = null;
      throw err;
    });
  }
  return poolPromise;
}

// Generic stored procedure executor
export async function executeStoredProcedure(
  procedureName: string,
  parameters: Record<string, any> = {}
): Promise<any> {
  try {
    const pool = await getDbPool();
    const request = pool.request();
    
    // Add parameters to the request
    for (const [key, value] of Object.entries(parameters)) {
      if (value !== undefined && value !== null) {
        request.input(key, value);
      }
    }
    
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (error) {
    console.error(`Error executing stored procedure ${procedureName}:`, error);
    throw error;
  }
}

// Close database connections (for cleanup)
export async function closeDbConnections(): Promise<void> {
  try {
    if (poolPromise) {
      const pool = await poolPromise;
      await pool.close();
      poolPromise = null;
    }
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
}

// Personas operations
export class PersonasService {
  static async insertPersona(data: {
    cedula: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    ciudad: number;
    indicacion: string;
    FechaNacimiento: Date;
  }) {
    return executeStoredProcedure('sp_insert_persona', {
      cedula: data.cedula,
      nombre: data.nombre,
      apellido1: data.apellido1,
      apellido2: data.apellido2,
      ciudad: data.ciudad,
      indicacion: data.indicacion,
      FechaNacimiento: data.FechaNacimiento,
    });
  }

  static async selectPersonas(cedula?: number) {
    const params = cedula ? { cedula } : {};
    return executeStoredProcedure('sp_select_personas', params);
  }

  static async updatePersona(data: {
    cedula: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    ciudad: number;
    indicacion: string;
    FechaNacimiento: Date;
  }) {
    return executeStoredProcedure('sp_update_persona', {
      cedula: data.cedula,
      nombre: data.nombre,
      apellido1: data.apellido1,
      apellido2: data.apellido2,
      ciudad: data.ciudad,
      indicacion: data.indicacion,
      FechaNacimiento: data.FechaNacimiento,
    });
  }

  static async deletePersona(cedula: number) {
    return executeStoredProcedure('sp_delete_persona', { cedula });
  }
}

// Empleados operations
export class EmpleadosService {
  static async insertEmpleado(data: {
    cedula: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    ciudad: number;
    indicacion: string;
    FechaNacimiento: Date;
    Especialidad: string;
    Grado_academico: string;
  }) {
    try {
      // First insert persona, then empleado
      await PersonasService.insertPersona({
        cedula: data.cedula,
        nombre: data.nombre,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
        ciudad: data.ciudad,
        indicacion: data.indicacion,
        FechaNacimiento: data.FechaNacimiento,
      });
      
      return executeStoredProcedure('sp_insert_empleado', {
        cedula: data.cedula,
        Especialidad: data.Especialidad,
        Grado_academico: data.Grado_academico,
      });
    } catch (error) {
      console.error('Error inserting empleado:', error);
      throw error;
    }
  }

  static async selectEmpleados(cedula?: number) {
    const params = cedula ? { cedula } : {};
    return executeStoredProcedure('sp_select_empleados', params);
  }

  static async updateEmpleado(data: {
    cedula: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    ciudad: number;
    indicacion: string;
    FechaNacimiento: Date;
    Especialidad: string;
    Grado_academico: string;
  }) {
    try {
      await PersonasService.updatePersona({
        cedula: data.cedula,
        nombre: data.nombre,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
        ciudad: data.ciudad,
        indicacion: data.indicacion,
        FechaNacimiento: data.FechaNacimiento,
      });
      
      return executeStoredProcedure('sp_update_empleado', {
        cedula: data.cedula,
        Especialidad: data.Especialidad,
        Grado_academico: data.Grado_academico,
      });
    } catch (error) {
      console.error('Error updating empleado:', error);
      throw error;
    }
  }

  static async deleteEmpleado(cedula: number) {
    try {
      await executeStoredProcedure('sp_delete_empleado', { cedula });
      return PersonasService.deletePersona(cedula);
    } catch (error) {
      console.error('Error deleting empleado:', error);
      throw error;
    }
  }

  static async checkEmployeeExists(cedula: number): Promise<boolean> {
    try {
      const result = await this.selectEmpleados(cedula);
      return result && result.length > 0;
    } catch {
      return false;
    }
  }
}

// Clientes operations
export class ClientesService {
  static async insertCliente(data: {
    cedula: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    ciudad: number;
    indicacion: string;
    FechaNacimiento: Date;
    ClienteFrecuente: number;
  }) {
    try {
      await PersonasService.insertPersona({
        cedula: data.cedula,
        nombre: data.nombre,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
        ciudad: data.ciudad,
        indicacion: data.indicacion,
        FechaNacimiento: data.FechaNacimiento,
      });
      
      return executeStoredProcedure('sp_insert_cliente', {
        cedula: data.cedula,
        ClienteFrecuente: data.ClienteFrecuente,
      });
    } catch (error) {
      console.error('Error inserting cliente:', error);
      throw error;
    }
  }

  static async selectClientes(cedula?: number) {
    const params = cedula ? { cedula } : {};
    return executeStoredProcedure('sp_select_clientes', params);
  }

  static async updateCliente(data: {
    cedula: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    ciudad: number;
    indicacion: string;
    FechaNacimiento: Date;
    ClienteFrecuente: number;
  }) {
    try {
      await PersonasService.updatePersona({
        cedula: data.cedula,
        nombre: data.nombre,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
        ciudad: data.ciudad,
        indicacion: data.indicacion,
        FechaNacimiento: data.FechaNacimiento,
      });
      
      return executeStoredProcedure('sp_update_cliente', {
        cedula: data.cedula,
        ClienteFrecuente: data.ClienteFrecuente,
      });
    } catch (error) {
      console.error('Error updating cliente:', error);
      throw error;
    }
  }

  static async deleteCliente(cedula: number) {
    try {
      await executeStoredProcedure('sp_delete_cliente', { cedula });
      return PersonasService.deletePersona(cedula);
    } catch (error) {
      console.error('Error deleting cliente:', error);
      throw error;
    }
  }
}

// Proveedores operations
export class ProveedoresService {
  static async insertProveedor(data: {
    IDProveedor: number;
    NombreProveedor: string;
    ciudad: number;
    indicacion: string;
  }) {
    return executeStoredProcedure('sp_insert_proveedor', {
      IDProveedor: data.IDProveedor,
      NombreProveedor: data.NombreProveedor,
      ciudad: data.ciudad,
      indicacion: data.indicacion,
    });
  }

  static async selectProveedores(IDProveedor?: number) {
    const params = IDProveedor ? { IDProveedor } : {};
    return executeStoredProcedure('sp_select_proveedores', params);
  }

  static async updateProveedor(data: {
    IDProveedor: number;
    NombreProveedor: string;
    ciudad: number;
    indicacion: string;
  }) {
    return executeStoredProcedure('sp_update_proveedor', {
      IDProveedor: data.IDProveedor,
      NombreProveedor: data.NombreProveedor,
      ciudad: data.ciudad,
      indicacion: data.indicacion,
    });
  }

  static async deleteProveedor(IDProveedor: number) {
    return executeStoredProcedure('sp_delete_proveedor', { IDProveedor });
  }
}

// MateriasPrimas operations
export class MateriasPrimasService {
  static async insertMateriaPrima(data: {
    IDMateriaPrima: number;
    tipo: string;
    marca: string;
    Nombre: string;
    FechaDeCompra: Date;
    precio: number;
    cantidad: number;
  }) {
    return executeStoredProcedure('sp_insert_materia_prima', {
      IDMateriaPrima: data.IDMateriaPrima,
      tipo: data.tipo,
      marca: data.marca,
      Nombre: data.Nombre,
      FechaDeCompra: data.FechaDeCompra,
      precio: data.precio,
      cantidad: data.cantidad,
    });
  }

  static async selectMateriasPrimas(IDMateriaPrima?: number) {
    const params = IDMateriaPrima ? { IDMateriaPrima } : {};
    return executeStoredProcedure('sp_select_materias_primas', params);
  }

  static async updateMateriaPrima(data: {
    IDMateriaPrima: number;
    tipo: string;
    marca: string;
    Nombre: string;
    FechaDeCompra: Date;
    precio: number;
    cantidad: number;
  }) {
    return executeStoredProcedure('sp_update_materia_prima', {
      IDMateriaPrima: data.IDMateriaPrima,
      tipo: data.tipo,
      marca: data.marca,
      Nombre: data.Nombre,
      FechaDeCompra: data.FechaDeCompra,
      precio: data.precio,
      cantidad: data.cantidad,
    });
  }

  static async deleteMateriaPrima(IDMateriaPrima: number) {
    return executeStoredProcedure('sp_delete_materia_prima', { IDMateriaPrima });
  }
}

// Productos operations
export class ProductosService {
  static async insertProducto(data: {
    IDProductos: number;
    tipo: string;
  }) {
    return executeStoredProcedure('sp_insert_producto', {
      IDProductos: data.IDProductos,
      tipo: data.tipo,
    });
  }

  static async selectProductos(IDProductos?: number) {
    const params = IDProductos ? { IDProductos } : {};
    return executeStoredProcedure('sp_select_productos', params);
  }

  static async updateProducto(data: {
    IDProductos: number;
    tipo: string;
  }) {
    return executeStoredProcedure('sp_update_producto', {
      IDProductos: data.IDProductos,
      tipo: data.tipo,
    });
  }

  static async deleteProducto(IDProductos: number) {
    return executeStoredProcedure('sp_delete_producto', { IDProductos });
  }
}

// Orders operations
export class PedidosService {
  static async createCustomerOrder(data: {
    cedula: number;
    descripcion: string;
    FechaEntrega: Date;
  }) {
    return executeStoredProcedure('sp_create_customer_order', {
      cedula: data.cedula,
      descripcion: data.descripcion,
      FechaEntrega: data.FechaEntrega,
    });
  }

  static async updateOrderStatus(data: {
    NumPedido: number;
    EstadoPedido: string;
  }) {
    return executeStoredProcedure('sp_update_order_status', {
      NumPedido: data.NumPedido,
      EstadoPedido: data.EstadoPedido,
    });
  }

  static async selectPedidosByCliente(cedula: number) {
    return executeStoredProcedure('sp_select_pedidos_by_cliente', { cedula });
  }

  static async selectAllPedidos() {
    return executeStoredProcedure('sp_select_all_pedidos', {});
  }

  static async addProductToOrder(data: {
    NumPedido: number;
    IDProducto: number;
    cantidad: number;
    FechaElaboracion: Date;
  }) {
    return executeStoredProcedure('sp_add_product_to_order', {
      NumPedido: data.NumPedido,
      IDProducto: data.IDProducto,
      cantidad: data.cantidad,
      FechaElaboracion: data.FechaElaboracion,
    });
  }
}

// Utility functions
export function isLowStock(cantidad: number, threshold: number = 20): boolean {
  return cantidad < threshold;
}

export function isExpiring(fechaExpiracion: Date, daysThreshold: number = 15): boolean {
  const today = new Date();
  const diffTime = fechaExpiracion.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= daysThreshold && diffDays >= 0;
}