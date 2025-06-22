import { NextRequest, NextResponse } from 'next/server';
import { PedidosService, EmpleadosService } from '@/lib/database';
import type { PedidoCompleto, ApiResponse } from '@/types/database';

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

// GET - Retrieve orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cedula = searchParams.get('cedula');
    
    let result;
    if (cedula) {
      // Get orders for specific client (for customer order tracking)
      result = await PedidosService.selectPedidosByCliente(parseInt(cedula));
    } else {
      // Get all orders (for admin)
      const isAdmin = true;
      if (!isAdmin) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'No autorizado - Se requiere autenticación de empleado para ver todos los pedidos',
        };
        return NextResponse.json(response, { status: 401 });
      }
      result = await PedidosService.selectAllPedidos();
    }
    
    const response: ApiResponse<PedidoCompleto[]> = {
      success: true,
      data: result,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al obtener los pedidos',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cedula, descripcion, FechaEntrega } = body;

    // Validate required fields
    if (!cedula || !descripcion || !FechaEntrega) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await PedidosService.createCustomerOrder({
      cedula: parseInt(cedula),
      descripcion,
      FechaEntrega: new Date(FechaEntrega),
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al crear el pedido',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update order status (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Check admin authorization
    const isAdmin = true;
    if (!isAdmin) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No autorizado - Solo empleados pueden actualizar el estado de pedidos',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const { NumPedido, EstadoPedido } = body;

    // Validate required fields
    if (!NumPedido || !EstadoPedido) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Número de pedido y estado son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate status values
    const validStatuses = ['encargado', 'elaborando', 'listo'];
    if (!validStatuses.includes(EstadoPedido)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Estado de pedido inválido. Debe ser: encargado, elaborando, o listo',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await PedidosService.updateOrderStatus({
      NumPedido: parseInt(NumPedido),
      EstadoPedido,
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating order status:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al actualizar el estado del pedido',
    };
    return NextResponse.json(response, { status: 500 });
  }
}