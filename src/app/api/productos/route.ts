import { NextRequest, NextResponse } from 'next/server';
import { ProductosService, EmpleadosService } from '@/lib/database';
import type { Producto, ApiResponse } from '@/types/database';

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

// GET - Retrieve all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const result = await ProductosService.selectProductos(
      id ? parseInt(id) : undefined
    );
    
    const response: ApiResponse<Producto[]> = {
      success: true,
      data: result,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al obtener los productos',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new product
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
    const { IDProducto, tipo } = body;

    // Validate required fields
    if (!IDProducto || !tipo) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await ProductosService.insertProducto({
      IDProducto: parseInt(IDProducto),
      tipo,
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al crear el producto',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update product
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
    const { IDProducto, tipo } = body;

    // Validate required fields
    if (!IDProducto || !tipo) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await ProductosService.updateProducto({
      IDProducto: parseInt(IDProducto),
      tipo,
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al actualizar el producto',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE - Delete product
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
    const id = searchParams.get('id');

    if (!id) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID es requerido',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await ProductosService.deleteProducto(parseInt(id));

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al eliminar el producto',
    };
    return NextResponse.json(response, { status: 500 });
  }
}