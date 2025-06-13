import { NextRequest, NextResponse } from 'next/server';
import { ProveedoresService, EmpleadosService } from '@/lib/database';
import type { Proveedor, ApiResponse } from '@/types/database';

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

// GET - Retrieve all suppliers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const result = await ProveedoresService.selectProveedores(
      id ? parseInt(id) : undefined
    );
    
    const response: ApiResponse<Proveedor[]> = {
      success: true,
      data: result,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al obtener los proveedores',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new supplier
export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No autorizado - Solo empleados pueden realizar esta acción',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const {
      IDProveedor,
      NombreProveedor,
      ciudad,
      indicacion,
    } = body;

    // Validate required fields
    if (!IDProveedor || !NombreProveedor || !ciudad || !indicacion) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await ProveedoresService.insertProveedor({
      IDProveedor: parseInt(IDProveedor),
      NombreProveedor,
      ciudad: parseInt(ciudad),
      indicacion,
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al crear el proveedor',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update supplier
export async function PUT(request: NextRequest) {
  try {
    // Check admin authorization
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No autorizado - Solo empleados pueden realizar esta acción',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const {
      IDProveedor,
      NombreProveedor,
      ciudad,
      indicacion,
    } = body;

    // Validate required fields
    if (!IDProveedor || !NombreProveedor || !ciudad || !indicacion) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await ProveedoresService.updateProveedor({
      IDProveedor: parseInt(IDProveedor),
      NombreProveedor,
      ciudad: parseInt(ciudad),
      indicacion,
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating supplier:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al actualizar el proveedor',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE - Delete supplier
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authorization
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No autorizado - Solo empleados pueden realizar esta acción',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID es requerido',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await ProveedoresService.deleteProveedor(parseInt(id));

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting supplier:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al eliminar el proveedor',
    };
    return NextResponse.json(response, { status: 500 });
  }
}