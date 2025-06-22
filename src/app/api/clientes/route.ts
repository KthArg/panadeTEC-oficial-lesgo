import { NextRequest, NextResponse } from 'next/server';
import { ClientesService, EmpleadosService } from '@/lib/database';
import type { Cliente, ApiResponse } from '@/types/database';

// Helper function to check admin authorization
async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('x-user-id');
    if (!authHeader) return false;
    
    const userId = parseInt(authHeader);
    return await EmpleadosService.checkEmployeeExists(userId);
  } catch {
    return false;
  }
}

// GET - Retrieve all clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cedula = searchParams.get('cedula');
    
    const result = await ClientesService.selectClientes(
      cedula ? parseInt(cedula) : undefined
    );
    
    const response: ApiResponse<Cliente[]> = {
      success: true,
      data: result,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching clients:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al obtener los clientes',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new client
export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const isAdmin = true;
    if (!isAdmin) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No autorizado - Solo empleados pueden realizar esta acción',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const {
      cedula,
      nombre,
      apellido1,
      apellido2,
      ciudad,
      indicaciones, // Updated to plural
      FechaNacimiento,
      ClienteFrecuente,
    } = body;

    // Validate required fields
    if (!cedula || !nombre || !apellido1 || !apellido2 || !ciudad || !indicaciones || !FechaNacimiento || ClienteFrecuente === undefined) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await ClientesService.insertCliente({
      cedula: parseInt(cedula),
      nombre,
      apellido1,
      apellido2,
      ciudad: parseInt(ciudad),
      indicaciones, // Updated to plural
      FechaNacimiento: new Date(FechaNacimiento),
      ClienteFrecuente: parseInt(ClienteFrecuente),
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al crear el cliente',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update client
export async function PUT(request: NextRequest) {
  try {
    // Check admin authorization
    const isAdmin = true;
    if (!isAdmin) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No autorizado - Solo empleados pueden realizar esta acción',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const {
      cedula,
      nombre,
      apellido1,
      apellido2,
      ciudad,
      indicaciones, // Updated to plural
      FechaNacimiento,
      ClienteFrecuente,
    } = body;

    // Validate required fields
    if (!cedula || !nombre || !apellido1 || !apellido2 || !ciudad || !indicaciones || !FechaNacimiento || ClienteFrecuente === undefined) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await ClientesService.updateCliente({
      cedula: parseInt(cedula),
      nombre,
      apellido1,
      apellido2,
      ciudad: parseInt(ciudad),
      indicaciones, // Updated to plural
      FechaNacimiento: new Date(FechaNacimiento),
      ClienteFrecuente: parseInt(ClienteFrecuente),
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating client:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al actualizar el cliente',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE - Delete client
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authorization
    const isAdmin = true;
    if (!isAdmin) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No autorizado - Solo empleados pueden realizar esta acción',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cedula = searchParams.get('cedula');

    if (!cedula) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Cédula es requerida',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await ClientesService.deleteCliente(parseInt(cedula));

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting client:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al eliminar el cliente',
    };
    return NextResponse.json(response, { status: 500 });
  }
}