import { NextRequest, NextResponse } from 'next/server';
import { EmpleadosService } from '@/lib/database';
import type { Empleado, ApiResponse } from '@/types/database';

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

// GET - Retrieve all employees
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cedula = searchParams.get('cedula');
    
    const result = await EmpleadosService.selectEmpleados(
      cedula ? parseInt(cedula) : undefined
    );
    
    const response: ApiResponse<Empleado[]> = {
      success: true,
      data: result,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching employees:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al obtener los empleados',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new employee
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
      Especialidad,
      Grado_academico,
    } = body;

    // Validate required fields
    if (!cedula || !nombre || !apellido1 || !apellido2 || !ciudad || !indicaciones || !FechaNacimiento || !Especialidad || !Grado_academico) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await EmpleadosService.insertEmpleado({
      cedula: parseInt(cedula),
      nombre,
      apellido1,
      apellido2,
      ciudad: parseInt(ciudad),
      indicaciones, // Updated to plural
      FechaNacimiento: new Date(FechaNacimiento),
      Especialidad,
      Grado_academico,
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al crear el empleado',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update employee
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
      Especialidad,
      Grado_academico,
    } = body;

    // Validate required fields
    if (!cedula || !nombre || !apellido1 || !apellido2 || !ciudad || !indicaciones || !FechaNacimiento || !Especialidad || !Grado_academico) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todos los campos son requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await EmpleadosService.updateEmpleado({
      cedula: parseInt(cedula),
      nombre,
      apellido1,
      apellido2,
      ciudad: parseInt(ciudad),
      indicaciones, // Updated to plural
      FechaNacimiento: new Date(FechaNacimiento),
      Especialidad,
      Grado_academico,
    });

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating employee:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al actualizar el empleado',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE - Delete employee
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

    const result = await EmpleadosService.deleteEmpleado(parseInt(cedula));

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting employee:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al eliminar el empleado',
    };
    return NextResponse.json(response, { status: 500 });
  }
}