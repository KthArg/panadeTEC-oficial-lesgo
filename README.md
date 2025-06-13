# 🥖 PanadeTEC - Sistema de Gestión para Panaderías

Una aplicación web completa construida con Next.js y TypeScript para la gestión integral de panaderías artesanales, incluyendo control de ingredientes, proveedores, productos de panadería, personal especializado, clientes y pedidos especiales.

## 🥐 Características Específicas para Panaderías

- **🌾 Control de Ingredientes**: Gestión de harinas, levaduras, azúcar y materias primas con alertas de vencimiento
- **🏪 Gestión de Proveedores**: Administración de proveedores de insumos de panadería y repostería  
- **🍞 Catálogo de Productos**: Gestión de panes, pasteles, galletas y productos de repostería
- **👨‍🍳 Personal Especializado**: Control de panaderos, reposteros y personal de atención
- **🎂 Clientes de Panadería**: Base de datos con programa de fidelidad para clientes frecuentes
- **📋 Pedidos Especiales**: Sistema completo de pedidos con seguimiento en tiempo real
- **🔍 Seguimiento Público**: Interfaz para que los clientes consulten el estado de sus pedidos

## 🛠 Tecnologías

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS con tema personalizado para panadería (colores cálidos, tipografía artesanal)
- **Base de Datos**: Microsoft SQL Server
- **Conexión DB**: mssql package
- **Icons**: Lucide React con iconos específicos de panadería

## 📋 Requisitos Previos

- Node.js 18.0 o superior
- Microsoft SQL Server (local o remoto) con TCP/IP habilitado
- npm o yarn
- SQL Server configurado para aceptar autenticación mixta (si usas autenticación SQL)

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [repository-url]
   cd operations-management-system
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**
   
   Copia el archivo `.env.local` y configura las variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edita `.env.local` con tus datos de base de datos:
   ```env
   DB_SERVER=localhost
   DB_DATABASE=OperationsManagement
   DB_USER=sa
   DB_PASSWORD=tu_contraseña_aqui
   ```

4. **Configurar la base de datos**
   
   Asegúrate de que tu base de datos SQL Server esté configurada con las tablas y stored procedures especificados en la documentación del proyecto. El sistema usa el paquete `mssql` para conectarse a SQL Server.

5. **Ejecutar la aplicación**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

6. **Abrir en el navegador**
   
   Visita `http://localhost:3000`

## 📊 Estructura de la Base de Datos

El sistema utiliza stored procedures exclusivamente para todas las operaciones de base de datos a través del paquete `mssql` de Node.js:

### Tablas Principales
- `Personas` (tabla base para empleados y clientes)
- `Empleados` 
- `Clientes`
- `Proveedores`
- `MateriasPrimas`
- `Productos`
- `Pedidos`
- `CL_PE` (relación cliente-pedido)

### Stored Procedures Requeridos
- `sp_insert_persona`, `sp_select_personas`, `sp_update_persona`, `sp_delete_persona`
- `sp_insert_empleado`, `sp_select_empleados`, `sp_update_empleado`, `sp_delete_empleado`
- `sp_insert_cliente`, `sp_select_clientes`, `sp_update_cliente`, `sp_delete_cliente`
- `sp_insert_proveedor`, `sp_select_proveedores`, `sp_update_proveedor`, `sp_delete_proveedor`
- `sp_insert_materia_prima`, `sp_select_materias_primas`, `sp_update_materia_prima`, `sp_delete_materia_prima`
- `sp_insert_producto`, `sp_select_productos`, `sp_update_producto`, `sp_delete_producto`
- `sp_create_customer_order`, `sp_update_order_status`, `sp_select_pedidos_by_cliente`, `sp_select_all_pedidos`

## 🎯 Uso del Sistema

### Panel de Administración
1. Visita `/admin/dashboard` para acceder al panel principal
2. Navega entre los diferentes módulos de gestión
3. **Nota**: En esta versión de demostración, la autenticación está simplificada

### Módulos Disponibles

#### Gestión de Inventario (`/admin/inventario`)
- Visualizar todas las materias primas
- Crear, editar y eliminar elementos del inventario
- **Alertas automáticas**: Items con stock bajo (< 20 unidades) se muestran en amarillo
- **Alertas de vencimiento**: Items que vencen en 15 días se muestran en rojo

#### Gestión de Proveedores (`/admin/proveedores`)
- CRUD completo de proveedores
- Información de contacto y ubicación

#### Gestión de Productos (`/admin/productos`)
- Catálogo de productos terminados
- Organización por categorías

#### Gestión de Empleados (`/admin/empleados`)
- Personal con especialidades y grados académicos
- Información personal completa

#### Gestión de Clientes (`/admin/clientes`)
- Base de datos de clientes
- Clasificación de clientes frecuentes

#### Gestión de Pedidos (`/admin/pedidos`)
- Visualizar todos los pedidos
- **Estados**: Encargado → Elaborando → Listo
- Actualización de estados en tiempo real
- Filtros por estado y búsqueda

### Seguimiento de Pedidos (`/mis-pedidos`)
- Interfaz pública para consulta de pedidos
- Los clientes pueden buscar por número de cédula
- Visualización del progreso del pedido

## 🔐 Autenticación y Autorización

**Importante**: Esta es una versión de demostración con autenticación simplificada.

- Las operaciones administrativas (POST, PUT, DELETE) requieren el header `x-user-id`
- El sistema verifica que el ID exista en la tabla `Empleados`
- Para producción se recomienda implementar:
  - JWT tokens
  - Sesiones seguras
  - Roles y permisos granulares
  - Middleware de autenticación

## 🚨 Alertas del Sistema

### Inventario
- **Stock Bajo**: Elementos con cantidad < 20 unidades
- **Próximo a Vencer**: Items que vencen en los próximos 15 días
- **Código de colores**: Amarillo para stock bajo, rojo para vencimiento

### Pedidos
- **Estados visuales**: Cada estado tiene su color e icono distintivo
- **Progreso visual**: Barra de progreso para seguimiento de pedidos

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── admin/             # Páginas de administración
│   ├── mis-pedidos/       # Seguimiento de pedidos
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y conexión DB
└── types/                 # Definiciones de TypeScript
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Ejecutar linter
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🐛 Solución de Problemas

### Error de configuración de Next.js
**Error: "appDir is not recognized"**
```bash
# Solución: Actualizar a la última versión
npm install next@latest
# El App Router ya no requiere experimental.appDir en Next.js 14+
```

**Error: "module is not defined in ES module scope"**
```bash
# Asegurar que postcss.config.js usa CommonJS syntax:
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Errores de compilación de TypeScript
```bash
# Instalar dependencias de desarrollo faltantes
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Verificar estructura de carpetas
src/
├── app/
├── components/
├── lib/
└── types/
```

### Error de conexión a la base de datos
- Verificar que SQL Server esté ejecutándose
- Confirmar credenciales en `.env.local`
- Asegurar que el puerto esté disponible (default 1433)
- Verificar que SQL Server esté configurado para aceptar conexiones TCP/IP
- Si usas SQL Server Express, asegurar que esté configurado para conexiones remotas

### Stored procedures no encontrados
- Verificar que todos los SPs estén creados en la base de datos
- Confirmar nombres exactos de los procedimientos

### Problemas de autenticación
- En desarrollo, usar cualquier ID de empleado válido en el header `x-user-id`

### Error: Cannot find module 'mssql'
```bash
npm install mssql
# O si usas yarn:
yarn add mssql
```

### Pasos de solución completa
Si tienes múltiples errores, ejecuta en orden:

1. **Limpiar e instalar dependencias:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Verificar archivos de configuración:**
```bash
# Asegurar que existan estos archivos:
# - next.config.js (NO .ts)
# - postcss.config.js 
# - tailwind.config.js
# - .env.local
```

3. **Verificar estructura del proyecto:**
```bash
# La estructura debe ser:
proyecto/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── package.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.js
└── .env.local
```

## 📄 Licencia

Este proyecto es para fines educativos y de demostración.

## 👥 Autores

Desarrollado como proyecto escolar para demostrar habilidades en desarrollo full-stack con Next.js y SQL Server.

---

**Nota**: Este es un proyecto de demostración. Para uso en producción, implementar medidas de seguridad adicionales, validaciones más robustas y manejo de errores completo.