import { NextRequest, NextResponse } from 'next/server';
import { MateriasPrimasService, EmpleadosService, isLowStock, isExpiring } from '@/lib/database';
import type { MateriaPrimaCompleta, ApiResponse } from '@/types/database';

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

// GET - Retrieve all inventory items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const result = await MateriasPrimasService.selectMateriasPrimas(
      id ? parseInt(id) : undefined
    );
    
    // Add status flags for low stock and expiring items
    const enhancedData: MateriaPrimaCompleta[] = result.map((item: any) => ({
      ...item,
      isLowStock: isLowStock(item.cantidad),
      isExpiring: item.FechaDeExpiracion ? isExpiring(new Date(item.FechaDeExpiracion)) : false,
    }));
    
    const response: ApiResponse<MateriaPrimaCompleta[]> = {
      success: true,
      data: enhancedData,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al obtener el inventario',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new inventory item
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
      IDMateriaPrima,
      tipo,
      marca,
      Nombre,
      FechaDeCompra,
      precio,
      cantidad,
    } = body;

    // Validate required fields
    if (!IDMateriaPrima || !tipo || !marca || !Nombre || !FechaDeCompra || !precio || !cantidad) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await MateriasPrimasService.insertMateriaPrima({
      IDMateriaPrima: parseInt(IDMateriaPrima),
      tipo,
      marca,
      Nombre,
      FechaDeCompra: new Date(FechaDeCompra),
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al crear el elemento de inventario',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update inventory item
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
      IDMateriaPrima,
      tipo,
      marca,
      Nombre,
      FechaDeCompra,
      precio,
      cantidad,
    } = body;

    // Validate required fields
    if (!IDMateriaPrima || !tipo || !marca || !Nombre || !FechaDeCompra || !precio || !cantidad) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await MateriasPrimasService.updateMateriaPrima({
      IDMateriaPrima: parseInt(IDMateriaPrima),
      tipo,
      marca,
      Nombre,
      FechaDeCompra: new Date(FechaDeCompra),
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al actualizar el elemento de inventario',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE - Delete inventory item
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

    const result = await MateriasPrimasService.deleteMateriaPrima(parseInt(id));

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al eliminar el elemento de inventario',
    };
    return NextResponse.json(response, { status: 500 });
  }
}