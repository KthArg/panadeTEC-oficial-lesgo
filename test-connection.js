// test-connection.js
// Script para probar la conexión a SQL Server
// Ejecutar con: node test-connection.js

const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Función para leer .env.local manualmente (sin depender de dotenv)
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado');
    console.log('💡 Crea el archivo .env.local con tu configuración de BD');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      envVars[key.trim()] = value;
    }
  });
  
  return envVars;
}

// Cargar variables de entorno
const envVars = loadEnvFile();

const config = {
  server: envVars.DB_SERVER || 'localhost',
  database: envVars.DB_DATABASE || 'OperationsManagement',
  user: envVars.DB_USER || 'sa',
  password: envVars.DB_PASSWORD || '',
  options: {
    encrypt: false, // Para desarrollo local
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 15000,
  requestTimeout: 15000,
};

async function testConnection() {
  console.log('🥖 === PRUEBA DE CONEXIÓN PANADETEC ===');
  console.log('');
  
  try {
    console.log('🔌 Intentando conectar a SQL Server...');
    console.log('📍 Servidor:', config.server);
    console.log('🗄️  Base de datos:', config.database);
    console.log('👤 Usuario:', config.user);
    console.log('🔐 Contraseña:', config.password ? '***' + config.password.slice(-2) : 'NO CONFIGURADA');
    console.log('');
    
    // Intentar conexión
    console.log('⏳ Conectando...');
    const pool = await sql.connect(config);
    console.log('✅ ¡Conexión exitosa!');
    console.log('');
    
    // Información del servidor
    console.log('📊 === INFORMACIÓN DEL SERVIDOR ===');
    const versionResult = await pool.request().query('SELECT @@VERSION as version, @@SERVERNAME as server_name, DB_NAME() as current_db');
    const serverInfo = versionResult.recordset[0];
    
    console.log('🖥️  Servidor:', serverInfo.server_name);
    console.log('🗄️  Base de datos actual:', serverInfo.current_db);
    console.log('📋 Versión:', serverInfo.version.split('\n')[0]);
    console.log('');
    
    // Verificar tablas principales
    console.log('📋 === VERIFICANDO ESTRUCTURA DE BD ===');
    const tablesResult = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);
    
    const tables = tablesResult.recordset.map(t => t.TABLE_NAME);
    const expectedTables = ['Personas', 'Empleados', 'Clientes', 'Proveedores', 'MateriasPrimas', 'Productos', 'Pedidos'];
    
    console.log('📁 Tablas encontradas:');
    tables.forEach(table => {
      const isExpected = expectedTables.includes(table);
      console.log(`   ${isExpected ? '✅' : '📄'} ${table}`);
    });
    
    const missingTables = expectedTables.filter(table => !tables.includes(table));
    if (missingTables.length > 0) {
      console.log('');
      console.log('⚠️  Tablas esperadas que faltan:');
      missingTables.forEach(table => console.log(`   ❌ ${table}`));
    }
    console.log('');
    
    // Verificar stored procedures
    console.log('🔧 === VERIFICANDO STORED PROCEDURES ===');
    const spResult = await pool.request().query(`
      SELECT name 
      FROM sys.procedures 
      WHERE name LIKE 'sp_%'
      ORDER BY name
    `);
    
    const storedProcedures = spResult.recordset.map(sp => sp.name);
    const expectedSPs = [
      'sp_select_empleados', 'sp_insert_empleado', 'sp_update_empleado', 'sp_delete_empleado',
      'sp_select_clientes', 'sp_insert_cliente', 'sp_update_cliente', 'sp_delete_cliente',
      'sp_select_proveedores', 'sp_insert_proveedor', 'sp_update_proveedor', 'sp_delete_proveedor',
      'sp_select_materias_primas', 'sp_insert_materia_prima', 'sp_update_materia_prima', 'sp_delete_materia_prima',
      'sp_select_productos', 'sp_insert_producto', 'sp_update_producto', 'sp_delete_producto',
      'sp_select_all_pedidos', 'sp_create_customer_order', 'sp_update_order_status', 'sp_select_pedidos_by_cliente'
    ];
    
    console.log('⚙️  Stored Procedures encontrados:');
    storedProcedures.forEach(sp => {
      const isExpected = expectedSPs.includes(sp);
      console.log(`   ${isExpected ? '✅' : '📄'} ${sp}`);
    });
    
    const missingSPs = expectedSPs.filter(sp => !storedProcedures.includes(sp));
    if (missingSPs.length > 0) {
      console.log('');
      console.log('⚠️  Stored Procedures esperados que faltan:');
      missingSPs.forEach(sp => console.log(`   ❌ ${sp}`));
    }
    console.log('');
    
    // Probar un SP simple
    console.log('🧪 === PROBANDO STORED PROCEDURE ===');
    try {
      const testResult = await pool.request().execute('sp_select_empleados');
      console.log('✅ sp_select_empleados ejecutado correctamente');
      console.log(`📊 Registros retornados: ${testResult.recordset.length}`);
      
      if (testResult.recordset.length > 0) {
        console.log('👤 Ejemplo de empleado:');
        const empleado = testResult.recordset[0];
        Object.keys(empleado).slice(0, 3).forEach(key => {
          console.log(`   ${key}: ${empleado[key]}`);
        });
      }
    } catch (spError) {
      console.log('⚠️  Error ejecutando sp_select_empleados:', spError.message);
    }
    console.log('');
    
    // Cerrar conexión
    await pool.close();
    console.log('🔐 Conexión cerrada correctamente');
    console.log('');
    console.log('🎉 === CONEXIÓN COMPLETAMENTE FUNCIONAL ===');
    console.log('✅ Tu base de datos está lista para PanadeTEC!');
    console.log('');
    console.log('🚀 Siguiente paso: ejecutar "npm run dev"');
    
  } catch (err) {
    console.log('');
    console.log('❌ === ERROR DE CONEXIÓN ===');
    console.error('💥 Error principal:', err.message);
    console.log('');
    
    // Diagnóstico del error
    if (err.message.includes('Login failed')) {
      console.log('🔍 DIAGNÓSTICO: Problema de autenticación');
      console.log('💡 Soluciones:');
      console.log('   1. Verifica usuario y contraseña en .env.local');
      console.log('   2. Asegúrate que autenticación SQL esté habilitada');
      console.log('   3. Verifica que el usuario tenga permisos');
    } else if (err.message.includes('ECONNREFUSED') || err.message.includes('server is unreachable')) {
      console.log('🔍 DIAGNÓSTICO: No se puede conectar al servidor');
      console.log('💡 Soluciones:');
      console.log('   1. Verifica que SQL Server esté ejecutándose');
      console.log('   2. Revisa que TCP/IP esté habilitado');
      console.log('   3. Confirma el nombre del servidor en .env.local');
    } else if (err.message.includes('Cannot open database')) {
      console.log('🔍 DIAGNÓSTICO: Problema con la base de datos');
      console.log('💡 Soluciones:');
      console.log('   1. Verifica que la BD "OperationsManagement" exista');
      console.log('   2. Confirma permisos de acceso a la BD');
    }
    
    console.log('');
    console.log('📋 Configuración actual:');
    console.log('   DB_SERVER:', envVars.DB_SERVER || 'NO CONFIGURADO');
    console.log('   DB_DATABASE:', envVars.DB_DATABASE || 'NO CONFIGURADO');
    console.log('   DB_USER:', envVars.DB_USER || 'NO CONFIGURADO');
    console.log('   DB_PASSWORD:', envVars.DB_PASSWORD ? 'CONFIGURADO' : 'NO CONFIGURADO');
    
    process.exit(1);
  }
}

// Verificar variables de entorno primero
console.log('🔍 Verificando configuración...');
if (!envVars.DB_SERVER || !envVars.DB_DATABASE || !envVars.DB_USER || !envVars.DB_PASSWORD) {
  console.log('');
  console.log('❌ === CONFIGURACIÓN INCOMPLETA ===');
  console.log('');
  console.log('🚨 Faltan variables de entorno en .env.local:');
  if (!envVars.DB_SERVER) console.log('   ❌ DB_SERVER');
  if (!envVars.DB_DATABASE) console.log('   ❌ DB_DATABASE');
  if (!envVars.DB_USER) console.log('   ❌ DB_USER');
  if (!envVars.DB_PASSWORD) console.log('   ❌ DB_PASSWORD');
  console.log('');
  console.log('💡 Crea el archivo .env.local con:');
  console.log('');
  console.log('DB_SERVER=localhost');
  console.log('DB_DATABASE=OperationsManagement');
  console.log('DB_USER=sa');
  console.log('DB_PASSWORD=tu_contraseña');
  console.log('');
  process.exit(1);
}

// Ejecutar la prueba
testConnection();