USE BakeryDB;
GO

--1. Crear tabla Provincias
CREATE TABLE Provincias (
    id_provincia TINYINT PRIMARY KEY,
    provincia VARCHAR(50) NOT NULL
);
GO

--2. Crear tabla CodigoPostal
CREATE TABLE CodigoPostal (
    id_CodigoPostal TINYINT PRIMARY KEY,
    codigo_postal VARCHAR(50) NOT NULL
);
GO

--3. Crear tabla Ciudades
CREATE TABLE Ciudades (
    id_ciudad SMALLINT PRIMARY KEY,
    ciudad VARCHAR(50) NOT NULL,
    id_provincia TINYINT NOT NULL,
    FOREIGN KEY (id_provincia) REFERENCES Provincias(id_provincia)
);
GO

--4. Crear tabla personas
CREATE TABLE Personas (
	cedula INT PRIMARY KEY,
	nombre CHAR(15) NOT NULL,
	apellido1 CHAR(15) NOT NULL,
	apellido2 CHAR(15) NOT NULL,
	ciudad SMALLINT NOT NULL,
	indicaciones VARCHAR(200) NULL,
	FechaNacimiento DATE NOT NULL
);
GO

--5. Crear tabla Empleados 
CREATE TABLE Empleados (
	cedula INT PRIMARY KEY,
	Especialidad VARCHAR(50) NOT NULL,
	Grado_acad�mico VARCHAR(100) NOT NULL,
	FOREIGN KEY (cedula) REFERENCES personas(cedula)
);
GO

-- Valores de tipo si y no 
CREATE TABLE ClienteFrecuenteTipo (
    valor TINYINT PRIMARY KEY,
    descripcion VARCHAR(10) NOT NULL
);
GO

-- Insertar los valores de referencia
INSERT INTO ClienteFrecuenteTipo (valor, descripcion)
VALUES 
    (0, 'No'),
    (1, 'S�');
GO

--6. Crear Tabla clientes 
CREATE TABLE Clientes (
    cedula INT PRIMARY KEY,
    ClienteFrecuente TINYINT NOT NULL,
    FOREIGN KEY (cedula) REFERENCES Personas(cedula),
    FOREIGN KEY (ClienteFrecuente) REFERENCES ClienteFrecuenteTipo(valor)
);
GO

--7. Crear Tabla Telefonos 
CREATE TABLE Telefonos_Personas (
    cedula INT,
    telefono INT,
    PRIMARY KEY (cedula, telefono),
    FOREIGN KEY (cedula) REFERENCES Personas(cedula)
);
GO

--8. Crear Tabla Email
CREATE TABLE Email_Personas (
    cedula INT,
    correo VARCHAR(50),
    PRIMARY KEY (cedula, correo),
    FOREIGN KEY (cedula) REFERENCES Personas(cedula)
);
GO

--9. Crear Tabla Horarios (multivalorado)
CREATE TABLE Horarios (
    cedula INT PRIMARY KEY,
    HoraInicio TIME NOT NULL,
    HoraFin TIME NOT NULL,
    FOREIGN KEY (cedula) REFERENCES Empleados(cedula)
);
GO

--10. Crear Tabla Proveedores
CREATE TABLE Proveedores (
    IDProveedor INT PRIMARY KEY,
    NombreProveedor CHAR(30) NOT NULL,
    ciudad SMALLINT NOT NULL,
    indicacion VARCHAR(200) NOT NULL,
    FOREIGN KEY (ciudad) REFERENCES Ciudades(id_ciudad)
);
GO

--11. Crear Tabla Telefonos_Proveedores
CREATE TABLE Telefonos_Proveedores (
    IDProveedor INT,
    telefono INT,
    PRIMARY KEY (IDProveedor, telefono),
    FOREIGN KEY (IDProveedor) REFERENCES Proveedores(IDProveedor)
);
GO

--12. Crear Tabla Email_Proveedores
CREATE TABLE Email_Proveedores (
    IDProveedor INT,
    correo VARCHAR(50),
    PRIMARY KEY (IDProveedor, correo),
    FOREIGN KEY (IDProveedor) REFERENCES Proveedores(IDProveedor)
);
GO

--13. Crear Tabla MateriasPrimas
CREATE TABLE MateriasPrimas (
    IDMateriaPrima INT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    marca VARCHAR(20) NOT NULL,
    nombre VARCHAR(30) NOT NULL,
    FechaDeCompra DATE NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL
);
GO

--14. Crear Tabla Materiales (subclase)
CREATE TABLE Materiales (
    IDMateriaPrima INT PRIMARY KEY,
    descripcion VARCHAR(200) NOT NULL,
    color VARCHAR(100) NOT NULL,
    FOREIGN KEY (IDMateriaPrima) REFERENCES MateriasPrimas(IDMateriaPrima)
);
GO

--15. Crear Tabla Ingredientes (subclase)
CREATE TABLE Ingredientes (
    IDMateriaPrima INT PRIMARY KEY,
    fecha_expiracion DATE NOT NULL,
    FOREIGN KEY (IDMateriaPrima) REFERENCES MateriasPrimas(IDMateriaPrima)
);
GO

--16. Crear Tabla Productos
CREATE TABLE Productos (
    IDProducto INT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL
);
GO

--17. Crear Tabla Maquinaria
CREATE TABLE Maquinaria (
    NumSerie INT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    marca VARCHAR(20) NOT NULL,
    Estado CHAR(15) CHECK (estado IN ('funcionando', 'descompuesto')) NOT NULL,
    FechaDeCompra DATE NOT NULL
);
GO

--18. Crear Tabla Pedidos
CREATE TABLE Pedidos (
    NumPedido INT PRIMARY KEY,
    descripcion VARCHAR(200) NOT NULL
);
GO

--19. Crear Tabla Ventas
CREATE TABLE Ventas (
    IDVentas INT PRIMARY KEY,
    FechaDeVenta DATE NOT NULL,
    CantidadVendida INT NOT NULL
);
GO

--20. Crear Tabla Gastos
CREATE TABLE Gastos (
    IDGasto INT PRIMARY KEY,
    FechaDePago DATE NOT NULL,
    detalle VARCHAR(20) NOT NULL,
    categoria VARCHAR(30) NOT NULL
);
GO

-- =========================================================================
-- ===================================================  TABLAS DE RELACIONES 

--21. Crear Tabla Relaci�n Cliente-Pedido
CREATE TABLE CL_PE (
    cedula INT,
    NumPedido INT,
    FechaEntrega DATETIME,
    EstadoPedido CHAR(10) CHECK (EstadoPedido IN ('encargado', 'elaborando', 'listo')),
    PRIMARY KEY (cedula, NumPedido),
    FOREIGN KEY (cedula) REFERENCES Clientes(cedula),
    FOREIGN KEY (NumPedido) REFERENCES Pedidos(NumPedido)
);
GO

--22. Crear Tabla PED_GAS (Pedido-Gasto)
CREATE TABLE PED_GAS (
    NumPedido INT,
    IDGasto INT,
    PRIMARY KEY (NumPedido, IDGasto),
    FOREIGN KEY (NumPedido) REFERENCES Pedidos(NumPedido),
    FOREIGN KEY (IDGasto) REFERENCES Gastos(IDGasto)
);
GO

--23. Crear Tabla GA_VE (Gasto-Venta)
CREATE TABLE GA_VE (
    IDGasto INT,
    IDVentas INT,
    PRIMARY KEY (IDGasto, IDVentas),
    FOREIGN KEY (IDGasto) REFERENCES Gastos(IDGasto),
    FOREIGN KEY (IDVentas) REFERENCES Ventas(IDVentas)
);
GO

--24. Crear Tabla PEDPRO_VENTAS (Pedido - Producto - Venta)
CREATE TABLE PEDPRO_VENTAS (
    NumPedido INT,
    IDProducto INT,
    IDVentas INT,
    PRIMARY KEY (NumPedido, IDProducto, IDVentas),
    FOREIGN KEY (NumPedido) REFERENCES Pedidos(NumPedido),
    FOREIGN KEY (IDProducto) REFERENCES Productos(IDProducto),
    FOREIGN KEY (IDVentas) REFERENCES Ventas(IDVentas)
);
GO

--25. Crear Tabla PED_PRO (Pedido - Producto)
CREATE TABLE PED_PRO (
    NumPedido INT,
    IDProducto INT,
    cantidad INT NOT NULL,
    FechaElaboracion DATE NOT NULL,
    PRIMARY KEY (NumPedido, IDProducto),
    FOREIGN KEY (NumPedido) REFERENCES Pedidos(NumPedido),
    FOREIGN KEY (IDProducto) REFERENCES Productos(IDProducto)
);
GO

--26. Crear Tabla MAQUIN_PEDPRO (Maquinaria - Pedido - Producto)
CREATE TABLE MAQUIN_PEDPRO (
    NumPedido INT,
    IDProducto INT,
    NumSerie INT,
    PRIMARY KEY (NumPedido, IDProducto, NumSerie),
    FOREIGN KEY (NumPedido) REFERENCES Pedidos(NumPedido),
    FOREIGN KEY (IDProducto) REFERENCES Productos(IDProducto),
    FOREIGN KEY (NumSerie) REFERENCES Maquinaria(NumSerie)
);
GO

--27. Crear Tabla MATP_PROD (Materia Prima - Pedido)
CREATE TABLE MATP_PROD (
    NumPedido INT,
    IDMateriaPrima INT,
    PRIMARY KEY (NumPedido, IDMateriaPrima),
    FOREIGN KEY (NumPedido) REFERENCES Pedidos(NumPedido),
    FOREIGN KEY (IDMateriaPrima) REFERENCES MateriasPrimas(IDMateriaPrima)
);
GO

--28. Crear Tabla PROV_MATP (Proveedor - Materia Prima)
CREATE TABLE PROV_MATP (
    IDMateriaPrima INT,
    IDProveedor INT,
    PRIMARY KEY (IDMateriaPrima, IDProveedor),
    FOREIGN KEY (IDMateriaPrima) REFERENCES MateriasPrimas(IDMateriaPrima),
    FOREIGN KEY (IDProveedor) REFERENCES Proveedores(IDProveedor)
);
GO
-- ====================================================================
-- ========================================== Datos para llenar la base 

-- 1. Provincias
INSERT INTO Provincias (id_provincia, provincia) VALUES
(1, 'Alajuela');
GO

-- 2. CodigoPostal
INSERT INTO CodigoPostal (id_CodigoPostal, codigo_postal) VALUES
(1, '21001'),
(2, '20301'),
(3, '20601'),
(4, '20201'),
(5, '20801'),
(6, '20501');
GO

-- 3. Ciudades (Cantones de Alajuela)
INSERT INTO Ciudades (id_ciudad, ciudad, id_provincia) VALUES
(1, 'San Carlos', 1),
(2, 'Grecia', 1),
(3, 'Naranjo', 1),
(4, 'San Ram�n', 1),
(5, 'Zarcero', 1),
(6, 'Atenas', 1);
GO

-- 4. Personas
INSERT INTO personas (cedula, nombre, apellido1, apellido2, ciudad, indicaciones, FechaNacimiento) VALUES
(208340123, 'Laura', 'Rodr�guez', 'Castro', 1, 'Cerca del Rancho Palenque', '1978-10-12'),
(208340456, 'Mar�a Laura', 'Alp�zar', 'Rodr�guez', 1, NULL, '2006-08-10'),
(208340789, 'Juan Pablo', 'Alp�zar', 'Rodr�guez', 2, NULL, '2005-02-20'),
(208340999, 'Sof�a', 'Mora', 'Salazar', 3, 'Cliente frecuente de pasteles', '1992-02-11'),
(208340321, 'Carlos', 'P�rez', 'Cascante', 4, 'Encargado de entregas', '1982-11-28'),
(208340654, 'Daniela', 'Bustos', 'Cerdas', 5, 'Dise�adora de mesas dulces', '1997-03-22');
GO

-- 5. Empleados
INSERT INTO empleados (cedula, Especialidad, Grado_acad�mico) VALUES
(208340123, 'Administraci�n y Producci�n', 'Bachillerato en Administraci�n de Empresas'),
(208340456, 'Community Manager', 'Ingenieria en computaci�n'),
(208340789, 'Producci�n de Postres', 'Ingieneria en producci�n industrial'),
(208340654, 'Decoradora de productos', 'T�cnico en Dise�o de Reposter�a');
GO

-- 6. Clientes
INSERT INTO Clientes (cedula, ClienteFrecuente) VALUES
(208340321, 0),
(208340999, 1);
GO

-- 7. Tel�fonos
INSERT INTO Telefonos_Personas (cedula, telefono) VALUES
(208340123, 70250567),
(208340456, 88887777),
(208340789, 87776655),
(208340321, 83556644),
(208340999, 84561234),
(208340654, 88553366);
GO

-- 8. Correos
INSERT INTO Email_Personas (cedula, correo) VALUES
(208340123, 'laura@cakeslaura.com'),
(208340456, 'maria@cakeslaura.com'),
(208340789, 'juan@cakeslaura.com'),
(208340321, 'carlos.entregas@cakeslaura.com'),
(208340999, 'sofia.cordoba@gmail.com'),
(208340654, 'daniela@cakeslaura.com');
GO

-- 9. Horarios
INSERT INTO Horarios (cedula, HoraInicio, HoraFin) VALUES
(208340123, '08:00', '16:00'),
(208340456, '09:00', '13:00'),
(208340789, '12:00', '18:00'),
(208340654, '10:00', '17:00');
GO

-- 10. Proveedores
INSERT INTO Proveedores (IDProveedor, NombreProveedor, ciudad, indicacion) VALUES
(1, 'Insumos Dulces S.A.', 1, 'Zona industrial San Carlos'),
(2, 'Maquinaria Plus', 4, 'Barrio industrial San Ram�n');
GO

-- 11. Tel�fonos de Proveedores
INSERT INTO Telefonos_Proveedores (IDProveedor, telefono) VALUES
(1, 24601234),
(2, 22225555);
GO

-- 12. Correos de Proveedores
INSERT INTO Email_Proveedores (IDProveedor, correo) VALUES
(1, 'ventas@insumosdulces.com'),
(2, 'info@maquinariaplus.com');
GO

-- 13. Materias Primas
INSERT INTO MateriasPrimas (IDMateriaPrima, tipo, marca, nombre, FechaDeCompra, precio, cantidad) VALUES
(1, 'Ingrediente', 'Dos Pinos', 'Crema Chantilly', '2025-05-20', 3500.00, 10),
(2, 'Ingrediente', 'La Maquila', 'Harina', '2025-05-22', 1500.00, 25),
(3, 'Material', 'Resimex', 'Base decorativa', '2025-05-18', 1000.00, 50);
GO

-- 14. Materiales
INSERT INTO Materiales (IDMateriaPrima, descripcion, color) VALUES
(3, 'Base redonda decorada con flores', 'Blanco con rosa pastel');
GO

-- 15. Ingredientes
INSERT INTO Ingredientes (IDMateriaPrima, fecha_expiracion) VALUES
(1, '2025-07-01'),
(2, '2025-08-15');
GO

-- 16. Productos
INSERT INTO Productos (IDProducto, tipo) VALUES
(1, 'Queque tem�tico'),
(2, 'Postre de vasito'),
(3, 'Pan artesanal');
GO

-- 17. Maquinaria
INSERT INTO Maquinaria (NumSerie, tipo, marca, Estado, FechaDeCompra) VALUES
(1001, 'Batidora industrial', 'KitchenAid', 'funcionando', '2023-10-10'),
(1002, 'Horno pastelero', 'Unox', 'descompuesto', '2022-08-05');
GO

-- 18. Pedidos
INSERT INTO Pedidos (NumPedido, descripcion) VALUES
(5001, 'Queque unicornio para cumplea�os'),
(5002, 'Postres individuales para baby shower');
GO

-- 19. Ventas
INSERT INTO Ventas (IDVentas, FechaDeVenta, CantidadVendida) VALUES
(9001, '2025-06-10', 2),
(9002, '2025-06-11', 10);
GO

-- 20. Gastos
INSERT INTO Gastos (IDGasto, FechaDePago, detalle, categoria) VALUES
(8001, '2025-06-08', 'Mantenimiento horno', 'Mantenimiento'),
(8002, '2025-06-09', 'Compra ingredientes', 'Insumos');
GO

-- 21. Cliente-Pedido
INSERT INTO CL_PE (cedula, NumPedido, FechaEntrega, EstadoPedido) VALUES
(208340999, 5001, '2025-06-15 14:00', 'encargado'),
(208340999, 5002, '2025-06-18 12:00', 'elaborando');
GO

-- 22. Pedido-Gasto
INSERT INTO PED_GAS (NumPedido, IDGasto) VALUES
(5001, 8001),
(5002, 8002);
GO

-- 23. Gasto-Venta
INSERT INTO GA_VE (IDGasto, IDVentas) VALUES
(8001, 9001),
(8002, 9002);
GO

-- 24. Pedido-Producto-Venta
INSERT INTO PEDPRO_VENTAS (NumPedido, IDProducto, IDVentas) VALUES
(5001, 1, 9001),
(5002, 2, 9002);
GO

-- 25. Pedido-Producto
INSERT INTO PED_PRO (NumPedido, IDProducto, cantidad, FechaElaboracion) VALUES
(5001, 1, 1, '2025-06-14'),
(5002, 2, 10, '2025-06-16');
GO

-- 26. Maquinaria - Pedido - Producto
INSERT INTO MAQUIN_PEDPRO (NumPedido, IDProducto, NumSerie) VALUES
(5001, 1, 1001),
(5002, 2, 1002);
GO

-- 27. MateriaPrima - Pedido
INSERT INTO MATP_PROD (NumPedido, IDMateriaPrima) VALUES
(5001, 1),
(5001, 2),
(5002, 1);
GO

-- 28. Proveedor - MateriaPrima
INSERT INTO PROV_MATP (IDMateriaPrima, IDProveedor) VALUES
(1, 1),
(2, 1),
(3, 2);
GO


-- ==========================================================================================
-- Procedimientos de inserci�n, modificaci�n, borrado y consulta para cada tabla de relaci�n

USE BakeryDB;
GO

-- =============================================
-- 21. Tabla CL_PE (Cliente-Pedido)

CREATE PROCEDURE Insertar_CL_PE
    @cedula INT,
    @NumPedido INT,
    @FechaEntrega DATETIME,
    @EstadoPedido CHAR(10)
AS
BEGIN
    INSERT INTO CL_PE VALUES (@cedula, @NumPedido, @FechaEntrega, @EstadoPedido);
END;
GO

CREATE PROCEDURE Modificar_CL_PE
    @cedula INT,
    @NumPedido INT,
    @FechaEntrega DATETIME,
    @EstadoPedido CHAR(10)
AS
BEGIN
    UPDATE CL_PE
    SET FechaEntrega = @FechaEntrega, EstadoPedido = @EstadoPedido
    WHERE cedula = @cedula AND NumPedido = @NumPedido;
END;
GO

CREATE PROCEDURE Eliminar_CL_PE
    @cedula INT,
    @NumPedido INT
AS
BEGIN
    DELETE FROM CL_PE WHERE cedula = @cedula AND NumPedido = @NumPedido;
END;
GO

CREATE PROCEDURE Consultar_CL_PE
AS
BEGIN
    SELECT * FROM CL_PE;
END;
GO

-- =============================================
-- 22. Tabla PED_GAS (Pedido-Gasto)

CREATE PROCEDURE Insertar_PED_GAS
    @NumPedido INT,
    @IDGasto INT
AS
BEGIN
    INSERT INTO PED_GAS VALUES (@NumPedido, @IDGasto);
END;
GO

CREATE PROCEDURE Modificar_PED_GAS
    @NumPedido INT,
    @IDGasto INT,
    @NuevoIDGasto INT
AS
BEGIN
    UPDATE PED_GAS
    SET IDGasto = @NuevoIDGasto
    WHERE NumPedido = @NumPedido AND IDGasto = @IDGasto;
END;
GO

CREATE PROCEDURE Eliminar_PED_GAS
    @NumPedido INT,
    @IDGasto INT
AS
BEGIN
    DELETE FROM PED_GAS WHERE NumPedido = @NumPedido AND IDGasto = @IDGasto;
END;
GO

CREATE PROCEDURE Consultar_PED_GAS
AS
BEGIN
    SELECT * FROM PED_GAS;
END;
GO

-- =============================================
-- 23. Tabla GA_VE (Gasto-Venta)

CREATE PROCEDURE Insertar_GA_VE
    @IDGasto INT,
    @IDVentas INT
AS
BEGIN
    INSERT INTO GA_VE VALUES (@IDGasto, @IDVentas);
END;
GO

CREATE PROCEDURE Modificar_GA_VE
    @IDGasto INT,
    @IDVentas INT,
    @NuevoIDVentas INT
AS
BEGIN
    UPDATE GA_VE
    SET IDVentas = @NuevoIDVentas
    WHERE IDGasto = @IDGasto AND IDVentas = @IDVentas;
END;
GO

CREATE PROCEDURE Eliminar_GA_VE
    @IDGasto INT,
    @IDVentas INT
AS
BEGIN
    DELETE FROM GA_VE WHERE IDGasto = @IDGasto AND IDVentas = @IDVentas;
END;
GO

CREATE PROCEDURE Consultar_GA_VE
AS
BEGIN
    SELECT * FROM GA_VE;
END;
GO

-- =============================================
-- 24. Tabla PEDPRO_VENTAS

CREATE PROCEDURE Insertar_PEDPRO_VENTAS
    @NumPedido INT,
    @IDProducto INT,
    @IDVentas INT
AS
BEGIN
    INSERT INTO PEDPRO_VENTAS VALUES (@NumPedido, @IDProducto, @IDVentas);
END;
GO

CREATE PROCEDURE Modificar_PEDPRO_VENTAS
    @NumPedido INT,
    @IDProducto INT,
    @IDVentas INT,
    @NuevoIDVentas INT
AS
BEGIN
    UPDATE PEDPRO_VENTAS
    SET IDVentas = @NuevoIDVentas
    WHERE NumPedido = @NumPedido AND IDProducto = @IDProducto AND IDVentas = @IDVentas;
END;
GO

CREATE PROCEDURE Eliminar_PEDPRO_VENTAS
    @NumPedido INT,
    @IDProducto INT,
    @IDVentas INT
AS
BEGIN
    DELETE FROM PEDPRO_VENTAS WHERE NumPedido = @NumPedido AND IDProducto = @IDProducto AND IDVentas = @IDVentas;
END;
GO

CREATE PROCEDURE Consultar_PEDPRO_VENTAS
AS
BEGIN
    SELECT * FROM PEDPRO_VENTAS;
END;
GO

-- =============================================
-- 25. Tabla PED_PRO

CREATE PROCEDURE Insertar_PED_PRO
    @NumPedido INT,
    @IDProducto INT,
    @cantidad INT,
    @FechaElaboracion DATE
AS
BEGIN
    INSERT INTO PED_PRO VALUES (@NumPedido, @IDProducto, @cantidad, @FechaElaboracion);
END;
GO

CREATE PROCEDURE Modificar_PED_PRO
    @NumPedido INT,
    @IDProducto INT,
    @cantidad INT,
    @FechaElaboracion DATE
AS
BEGIN
    UPDATE PED_PRO
    SET cantidad = @cantidad, FechaElaboracion = @FechaElaboracion
    WHERE NumPedido = @NumPedido AND IDProducto = @IDProducto;
END;
GO

CREATE PROCEDURE Eliminar_PED_PRO
    @NumPedido INT,
    @IDProducto INT
AS
BEGIN
    DELETE FROM PED_PRO WHERE NumPedido = @NumPedido AND IDProducto = @IDProducto;
END;
GO

CREATE PROCEDURE Consultar_PED_PRO
AS
BEGIN
    SELECT * FROM PED_PRO;
END;
GO

-- =============================================
-- 26. Tabla MAQUIN_PEDPRO

CREATE PROCEDURE Insertar_MAQUIN_PEDPRO
    @NumPedido INT,
    @IDProducto INT,
    @NumSerie INT
AS
BEGIN
    INSERT INTO MAQUIN_PEDPRO VALUES (@NumPedido, @IDProducto, @NumSerie);
END;
GO

CREATE PROCEDURE Eliminar_MAQUIN_PEDPRO
    @NumPedido INT,
    @IDProducto INT,
    @NumSerie INT
AS
BEGIN
    DELETE FROM MAQUIN_PEDPRO WHERE NumPedido = @NumPedido AND IDProducto = @IDProducto AND NumSerie = @NumSerie;
END;
GO

CREATE PROCEDURE Consultar_MAQUIN_PEDPRO
AS
BEGIN
    SELECT * FROM MAQUIN_PEDPRO;
END;
GO

-- =============================================
-- 27. Tabla MATP_PROD

CREATE PROCEDURE Insertar_MATP_PROD
    @NumPedido INT,
    @IDMateriaPrima INT
AS
BEGIN
    INSERT INTO MATP_PROD VALUES (@NumPedido, @IDMateriaPrima);
END;
GO

CREATE PROCEDURE Eliminar_MATP_PROD
    @NumPedido INT,
    @IDMateriaPrima INT
AS
BEGIN
    DELETE FROM MATP_PROD WHERE NumPedido = @NumPedido AND IDMateriaPrima = @IDMateriaPrima;
END;
GO

CREATE PROCEDURE Consultar_MATP_PROD
AS
BEGIN
    SELECT * FROM MATP_PROD;
END;
GO

-- =============================================
-- 28. Tabla PROV_MATP

CREATE PROCEDURE Insertar_PROV_MATP
    @IDMateriaPrima INT,
    @IDProveedor INT
AS
BEGIN
    INSERT INTO PROV_MATP VALUES (@IDMateriaPrima, @IDProveedor);
END;
GO

CREATE PROCEDURE Eliminar_PROV_MATP
    @IDMateriaPrima INT,
    @IDProveedor INT
AS
BEGIN
    DELETE FROM PROV_MATP WHERE IDMateriaPrima = @IDMateriaPrima AND IDProveedor = @IDProveedor;
END;
GO

CREATE PROCEDURE Consultar_PROV_MATP
AS
BEGIN
    SELECT * FROM PROV_MATP;
END;
GO

-- ============================================================
-- 	5  procedimientos que involucran el manejo de transacciones.  

-- 1. Registrar un nuevo pedido completo (cliente, pedido, productos, maquinaria)
CREATE PROCEDURE RegistrarPedidoCompleto
    @cedula INT,
    @NumPedido INT,
    @descripcion VARCHAR(200),
    @FechaEntrega DATETIME,
    @EstadoPedido CHAR(10),
    @IDProducto INT,
    @cantidad INT,
    @FechaElaboracion DATE,
    @NumSerie INT
AS
BEGIN
    BEGIN TRAN;
    BEGIN TRY
        INSERT INTO Pedidos (NumPedido, descripcion) VALUES (@NumPedido, @descripcion);
        INSERT INTO CL_PE VALUES (@cedula, @NumPedido, @FechaEntrega, @EstadoPedido);
        INSERT INTO PED_PRO VALUES (@NumPedido, @IDProducto, @cantidad, @FechaElaboracion);
        INSERT INTO MAQUIN_PEDPRO VALUES (@NumPedido, @IDProducto, @NumSerie);
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT 'Error en la transacci�n: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- 2. Registrar una venta vinculada a pedido y gasto
CREATE PROCEDURE RegistrarVentaCompleta
    @IDVentas INT,
    @FechaDeVenta DATE,
    @CantidadVendida INT,
    @NumPedido INT,
    @IDProducto INT,
    @IDGasto INT
AS
BEGIN
    BEGIN TRAN;
    BEGIN TRY
        INSERT INTO Ventas VALUES (@IDVentas, @FechaDeVenta, @CantidadVendida);
        INSERT INTO PEDPRO_VENTAS VALUES (@NumPedido, @IDProducto, @IDVentas);
        INSERT INTO GA_VE VALUES (@IDGasto, @IDVentas);
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT 'Error en la transacci�n de venta: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- 3. Eliminar un pedido completo (y todo lo relacionado)
CREATE PROCEDURE EliminarPedidoCompleto
    @NumPedido INT
AS
BEGIN
    BEGIN TRAN;
    BEGIN TRY
        DELETE FROM MAQUIN_PEDPRO WHERE NumPedido = @NumPedido;
        DELETE FROM PED_PRO WHERE NumPedido = @NumPedido;
        DELETE FROM PEDPRO_VENTAS WHERE NumPedido = @NumPedido;
        DELETE FROM CL_PE WHERE NumPedido = @NumPedido;
        DELETE FROM PED_GAS WHERE NumPedido = @NumPedido;
        DELETE FROM MATP_PROD WHERE NumPedido = @NumPedido;
        DELETE FROM Pedidos WHERE NumPedido = @NumPedido;
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT 'Error eliminando pedido: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- 4. Registrar ingredientes usados en pedido
CREATE PROCEDURE AsignarIngredientesAPedido
    @NumPedido INT,
    @IDMateria1 INT,
    @IDMateria2 INT
AS
BEGIN
    BEGIN TRAN;
    BEGIN TRY
        INSERT INTO MATP_PROD VALUES (@NumPedido, @IDMateria1);
        INSERT INTO MATP_PROD VALUES (@NumPedido, @IDMateria2);
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT 'Error asignando materias primas: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- 5. Cambiar maquinaria asignada a un pedido-producto
CREATE PROCEDURE CambiarMaquinaria
    @NumPedido INT,
    @IDProducto INT,
    @NumSerieActual INT,
    @NumSerieNueva INT
AS
BEGIN
    BEGIN TRAN;
    BEGIN TRY
        DELETE FROM MAQUIN_PEDPRO
        WHERE NumPedido = @NumPedido AND IDProducto = @IDProducto AND NumSerie = @NumSerieActual;
        INSERT INTO MAQUIN_PEDPRO VALUES (@NumPedido, @IDProducto, @NumSerieNueva);
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT 'Error cambiando maquinaria: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- ==========================================================================================
-- 5  consultas con un grado avanzado de procesamiento

-- 1. Consulta: Total de ventas por cliente, incluyendo nombre y total de productos comprados
SELECT p.nombre + ' ' + p.apellido1 AS NombreCliente,
       SUM(v.CantidadVendida) AS TotalProductosComprados
FROM Clientes c
JOIN personas p ON c.cedula = p.cedula
JOIN CL_PE cp ON cp.cedula = c.cedula
JOIN PEDPRO_VENTAS pv ON pv.NumPedido = cp.NumPedido
JOIN Ventas v ON v.IDVentas = pv.IDVentas
GROUP BY p.nombre, p.apellido1;
GO

-- 2. Consulta: Pedidos con ingredientes pr�ximos a vencer (menos de 15 d�as desde hoy)
SELECT pr.NumPedido, mp.nombre AS Ingrediente, i.fecha_expiracion
FROM MATP_PROD pr
JOIN MateriasPrimas mp ON mp.IDMateriaPrima = pr.IDMateriaPrima
JOIN Ingredientes i ON i.IDMateriaPrima = mp.IDMateriaPrima
WHERE DATEDIFF(DAY, GETDATE(), i.fecha_expiracion) < 15;
GO

-- 3. Consulta: Maquinaria usada en pedidos con productos, incluyendo su estado y cliente asociado
SELECT p.NumPedido, prod.tipo AS Producto, m.tipo AS Maquinaria, m.Estado,
       per.nombre + ' ' + per.apellido1 AS Cliente
FROM MAQUIN_PEDPRO mp
JOIN Pedidos p ON p.NumPedido = mp.NumPedido
JOIN Productos prod ON prod.IDProducto = mp.IDProducto
JOIN Maquinaria m ON m.NumSerie = mp.NumSerie
JOIN CL_PE cp ON cp.NumPedido = p.NumPedido
JOIN Clientes c ON c.cedula = cp.cedula
JOIN personas per ON per.cedula = c.cedula;
GO

-- 4. Consulta: Promedio de productos por pedido
SELECT AVG(Detalle.CantidadProductos) AS PromedioProductosPorPedido
FROM (
    SELECT NumPedido, SUM(cantidad) AS CantidadProductos
    FROM PED_PRO
    GROUP BY NumPedido
) AS Detalle;
GO

-- 5. Consulta: Reporte de gastos por categor�a y mes, solo si se gast� m�s de 5000 colones
SELECT DATENAME(MONTH, FechaDePago) AS Mes,
       categoria,
       SUM(v.CantidadVendida * 1000) AS TotalVentaAprox,
       COUNT(g.IDGasto) AS CantidadGastos
FROM Gastos g
JOIN GA_VE gv ON g.IDGasto = gv.IDGasto
JOIN Ventas v ON v.IDVentas = gv.IDVentas
GROUP BY DATENAME(MONTH, FechaDePago), categoria
HAVING SUM(v.CantidadVendida * 1000) > 5000;
GO

-- ==========================================================================================
-- 5  tipos de datos, que cumplan con una regla espec�fica.

-- 1. Estado de un pedido (ej. encargado, listo)
CREATE TYPE TipoEstadoPedido FROM CHAR(10) NOT NULL;
GO

-- 2. Cantidad positiva de productos
CREATE TYPE TipoCantidadProducto FROM INT NOT NULL;
GO

-- 3. Tel�fono v�lido (de 8 d�gitos)
CREATE TYPE TipoTelefono FROM INT NOT NULL;
GO

-- 4. Precio positivo (con decimales)
CREATE TYPE TipoPrecio FROM DECIMAL(10,2) NOT NULL;
GO

-- 5. Nombre corto (m�x. 30 caracteres)
CREATE TYPE TipoNombreCorto FROM VARCHAR(30) NOT NULL;
GO

-- Cantidad positiva en tabla PED_PRO
ALTER TABLE PED_PRO
ADD CONSTRAINT CHK_Cantidad_Positive CHECK (cantidad > 0);
GO

-- Tel�fono v�lido en Telefonos_Personas
ALTER TABLE Telefonos_Personas
ADD CONSTRAINT CHK_Telefono_Persona CHECK (telefono BETWEEN 20000000 AND 89999999);
GO

-- Tel�fono v�lido en Telefonos_Proveedores
ALTER TABLE Telefonos_Proveedores
ADD CONSTRAINT CHK_Telefono_Proveedor CHECK (telefono BETWEEN 20000000 AND 89999999);
GO

-- Precio v�lido en MateriasPrimas
ALTER TABLE MateriasPrimas
ADD CONSTRAINT CHK_Precio_MateriaPrima CHECK (precio >= 0);
GO

-- ==========================================================================================
-- 5  valores por defecto, estos pueden ser agregados directamente a los  tipos de datos, o bien en la creaci�n de las tablas.

-- 1. Fecha de compra predeterminada (hoy)
ALTER TABLE MateriasPrimas ADD CONSTRAINT DF_FechaDeCompra DEFAULT GETDATE() FOR FechaDeCompra;
GO

-- 2. Estado de maquinaria por defecto
ALTER TABLE Maquinaria ADD CONSTRAINT DF_Estado DEFAULT 'funcionando' FOR Estado;
GO

-- 3. ClienteFrecuente por defecto en 0
ALTER TABLE Clientes ADD CONSTRAINT DF_ClienteFrecuente DEFAULT 0 FOR ClienteFrecuente;
GO

-- 4. Fecha de venta por defecto
ALTER TABLE Ventas ADD CONSTRAINT DF_FechaVenta DEFAULT GETDATE() FOR FechaDeVenta;
GO

-- 5. Fecha de pago por defecto
ALTER TABLE Gastos ADD CONSTRAINT DF_FechaPago DEFAULT GETDATE() FOR FechaDePago;
GO

-- ==========================================================================================
-- 3 Vistas
 
-- 1. Vista: Detalle de pedidos con productos y maquinaria usada
CREATE VIEW Vista_Pedidos_Detalle AS
SELECT p.NumPedido, p.descripcion, pr.tipo AS Producto,
       m.tipo AS Maquinaria, m.Estado AS EstadoMaquinaria
FROM Pedidos p
JOIN PED_PRO pp ON p.NumPedido = pp.NumPedido
JOIN Productos pr ON pr.IDProducto = pp.IDProducto
JOIN MAQUIN_PEDPRO mp ON mp.NumPedido = p.NumPedido AND mp.IDProducto = pr.IDProducto
JOIN Maquinaria m ON m.NumSerie = mp.NumSerie;
GO

-- 2. Vista: Ventas con detalle de cliente
CREATE VIEW Vista_Ventas_Cliente AS
SELECT v.IDVentas, v.FechaDeVenta, v.CantidadVendida,
       c.cedula, per.nombre + ' ' + per.apellido1 AS Cliente
FROM Ventas v
JOIN PEDPRO_VENTAS pv ON pv.IDVentas = v.IDVentas
JOIN CL_PE cp ON cp.NumPedido = pv.NumPedido
JOIN Clientes c ON c.cedula = cp.cedula
JOIN personas per ON per.cedula = c.cedula;
GO

-- 3. Vista: Materias primas pr�ximas a vencer
CREATE VIEW Vista_IngredientesPorVencer AS
SELECT mp.IDMateriaPrima, mp.nombre, i.fecha_expiracion
FROM MateriasPrimas mp
JOIN Ingredientes i ON i.IDMateriaPrima = mp.IDMateriaPrima
WHERE DATEDIFF(DAY, GETDATE(), i.fecha_expiracion) < 30;
GO

-- ==========================================================================================
-- 3 Triggers

-- 1. Trigger para registrar auditor�a de pedidos
CREATE TABLE AuditoriaPedidos (
    ID INT IDENTITY PRIMARY KEY,
    NumPedido INT,
    Fecha DATETIME DEFAULT GETDATE(),
    UsuarioSistema SYSNAME DEFAULT SYSTEM_USER
);
GO

CREATE TRIGGER trg_AuditoriaInsertPedido
ON Pedidos
AFTER INSERT
AS
BEGIN
    INSERT INTO AuditoriaPedidos (NumPedido)
    SELECT NumPedido FROM inserted;
END;
GO

-- 2. Trigger para impedir eliminar cliente con pedidos activos
CREATE TRIGGER trg_NoEliminarClienteConPedidos
ON Clientes
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM CL_PE WHERE cedula IN (SELECT cedula FROM deleted))
    BEGIN
        RAISERROR('No se puede eliminar un cliente con pedidos activos.', 16, 1);
        ROLLBACK;
    END
    ELSE
    BEGIN
        DELETE FROM Clientes WHERE cedula IN (SELECT cedula FROM deleted);
    END
END;
GO

-- 3. Trigger para actualizar estado del pedido a 'listo' si se completa la venta
CREATE TRIGGER trg_ActualizarEstadoPedido
ON PEDPRO_VENTAS
AFTER INSERT
AS
BEGIN
    UPDATE CL_PE
    SET EstadoPedido = 'listo'
    WHERE NumPedido IN (SELECT NumPedido FROM inserted);
END;
GO

-- ==========================================================================================
-- 2 Cursores

-- 1. Cursor para listar pedidos por cliente y mostrar en consola
DECLARE @Cedula INT, @NumPedido INT
DECLARE curPedidos CURSOR FOR
    SELECT cedula, NumPedido FROM CL_PE;

OPEN curPedidos;
FETCH NEXT FROM curPedidos INTO @Cedula, @NumPedido;

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT 'Cliente: ' + CAST(@Cedula AS VARCHAR) + ', Pedido: ' + CAST(@NumPedido AS VARCHAR);
    FETCH NEXT FROM curPedidos INTO @Cedula, @NumPedido;
END;

CLOSE curPedidos;
DEALLOCATE curPedidos;
GO

-- 2. Cursor para calcular total de ventas
DECLARE @VentaID INT, @Total INT = 0
DECLARE curVentas CURSOR FOR
    SELECT IDVentas FROM Ventas;

OPEN curVentas;
FETCH NEXT FROM curVentas INTO @VentaID;

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT 'Venta registrada: ID ' + CAST(@VentaID AS VARCHAR);
    SET @Total = @Total + 1;
    FETCH NEXT FROM curVentas INTO @VentaID;
END;

PRINT 'Total de ventas procesadas: ' + CAST(@Total AS VARCHAR);

CLOSE curVentas;
DEALLOCATE curVentas;
GO

-- ==========================================================================================
-- 3 �ndices

CREATE INDEX idx_Personas_Nombre ON personas(nombre);
GO

CREATE INDEX idx_Productos_Tipo ON Productos(tipo);
GO

CREATE INDEX idx_Pedidos_Descripcion ON Pedidos(descripcion);
GO

USE BakeryDB;
GO

-- =============================================
-- PERSONAS - Procedimientos básicos CRUD
-- =============================================

CREATE PROCEDURE sp_select_personas
    @cedula INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @cedula IS NULL
        SELECT p.*, c.ciudad as ciudad_nombre, pr.provincia as provincia_nombre
        FROM personas p
        LEFT JOIN Ciudades c ON p.ciudad = c.id_ciudad
        LEFT JOIN Provincias pr ON c.id_provincia = pr.id_provincia
    ELSE
        SELECT p.*, c.ciudad as ciudad_nombre, pr.provincia as provincia_nombre
        FROM personas p
        LEFT JOIN Ciudades c ON p.ciudad = c.id_ciudad
        LEFT JOIN Provincias pr ON c.id_provincia = pr.id_provincia
        WHERE p.cedula = @cedula
END;
GO

CREATE PROCEDURE sp_insert_persona
    @cedula INT,
    @nombre CHAR(15),
    @apellido1 CHAR(15),
    @apellido2 CHAR(15),
    @ciudad SMALLINT,
    @indicaciones VARCHAR(200),
    @FechaNacimiento DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO personas (cedula, nombre, apellido1, apellido2, ciudad, indicaciones, FechaNacimiento)
    VALUES (@cedula, @nombre, @apellido1, @apellido2, @ciudad, @indicaciones, @FechaNacimiento);
END;
GO

CREATE PROCEDURE sp_update_persona
    @cedula INT,
    @nombre CHAR(15),
    @apellido1 CHAR(15),
    @apellido2 CHAR(15),
    @ciudad SMALLINT,
    @indicaciones VARCHAR(200),
    @FechaNacimiento DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE personas 
    SET nombre = @nombre, 
        apellido1 = @apellido1, 
        apellido2 = @apellido2, 
        ciudad = @ciudad, 
        indicaciones = @indicaciones, 
        FechaNacimiento = @FechaNacimiento
    WHERE cedula = @cedula;
END;
GO

CREATE PROCEDURE sp_delete_persona
    @cedula INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM personas WHERE cedula = @cedula;
END;
GO

-- =============================================
-- EMPLEADOS - Procedimientos CRUD con JOIN
-- =============================================

CREATE PROCEDURE sp_select_empleados
    @cedula INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @cedula IS NULL
        SELECT e.*, p.*, c.ciudad as ciudad_nombre, pr.provincia as provincia_nombre,
               h.HoraInicio, h.HoraFin
        FROM Empleados e
        INNER JOIN personas p ON e.cedula = p.cedula
        LEFT JOIN Ciudades c ON p.ciudad = c.id_ciudad
        LEFT JOIN Provincias pr ON c.id_provincia = pr.id_provincia
        LEFT JOIN Horarios h ON e.cedula = h.cedula
    ELSE
        SELECT e.*, p.*, c.ciudad as ciudad_nombre, pr.provincia as provincia_nombre,
               h.HoraInicio, h.HoraFin
        FROM Empleados e
        INNER JOIN personas p ON e.cedula = p.cedula
        LEFT JOIN Ciudades c ON p.ciudad = c.id_ciudad
        LEFT JOIN Provincias pr ON c.id_provincia = pr.id_provincia
        LEFT JOIN Horarios h ON e.cedula = h.cedula
        WHERE e.cedula = @cedula
END;
GO

CREATE PROCEDURE sp_insert_empleado
    @cedula INT,
    @Especialidad VARCHAR(50),
    @Grado_academico VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Empleados (cedula, Especialidad, Grado_academico)
    VALUES (@cedula, @Especialidad, @Grado_academico);
END;
GO

CREATE PROCEDURE sp_update_empleado
    @cedula INT,
    @Especialidad VARCHAR(50),
    @Grado_academico VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Empleados 
    SET Especialidad = @Especialidad, 
        Grado_academico = @Grado_academico
    WHERE cedula = @cedula;
END;
GO

CREATE PROCEDURE sp_delete_empleado
    @cedula INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Empleados WHERE cedula = @cedula;
END;
GO

-- =============================================
-- CLIENTES - Procedimientos CRUD con JOIN
-- =============================================

CREATE PROCEDURE sp_select_clientes
    @cedula INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @cedula IS NULL
        SELECT c.*, p.*, ci.ciudad as ciudad_nombre, pr.provincia as provincia_nombre,
               cft.descripcion as ClienteFrecuente_descripcion
        FROM Clientes c
        INNER JOIN personas p ON c.cedula = p.cedula
        LEFT JOIN Ciudades ci ON p.ciudad = ci.id_ciudad
        LEFT JOIN Provincias pr ON ci.id_provincia = pr.id_provincia
        LEFT JOIN ClienteFrecuenteTipo cft ON c.ClienteFrecuente = cft.valor
    ELSE
        SELECT c.*, p.*, ci.ciudad as ciudad_nombre, pr.provincia as provincia_nombre,
               cft.descripcion as ClienteFrecuente_descripcion
        FROM Clientes c
        INNER JOIN personas p ON c.cedula = p.cedula
        LEFT JOIN Ciudades ci ON p.ciudad = ci.id_ciudad
        LEFT JOIN Provincias pr ON ci.id_provincia = pr.id_provincia
        LEFT JOIN ClienteFrecuenteTipo cft ON c.ClienteFrecuente = cft.valor
        WHERE c.cedula = @cedula
END;
GO

CREATE PROCEDURE sp_insert_cliente
    @cedula INT,
    @ClienteFrecuente TINYINT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Clientes (cedula, ClienteFrecuente)
    VALUES (@cedula, @ClienteFrecuente);
END;
GO

CREATE PROCEDURE sp_update_cliente
    @cedula INT,
    @ClienteFrecuente TINYINT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Clientes 
    SET ClienteFrecuente = @ClienteFrecuente
    WHERE cedula = @cedula;
END;
GO

CREATE PROCEDURE sp_delete_cliente
    @cedula INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Clientes WHERE cedula = @cedula;
END;
GO

-- =============================================
-- PROVEEDORES - Procedimientos CRUD
-- =============================================

CREATE PROCEDURE sp_select_proveedores
    @IDProveedor INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @IDProveedor IS NULL
        SELECT p.*, c.ciudad as ciudad_nombre, pr.provincia as provincia_nombre
        FROM Proveedores p
        LEFT JOIN Ciudades c ON p.ciudad = c.id_ciudad
        LEFT JOIN Provincias pr ON c.id_provincia = pr.id_provincia
    ELSE
        SELECT p.*, c.ciudad as ciudad_nombre, pr.provincia as provincia_nombre
        FROM Proveedores p
        LEFT JOIN Ciudades c ON p.ciudad = c.id_ciudad
        LEFT JOIN Provincias pr ON c.id_provincia = pr.id_provincia
        WHERE p.IDProveedor = @IDProveedor
END;
GO

CREATE PROCEDURE sp_insert_proveedor
    @IDProveedor INT,
    @NombreProveedor CHAR(30),
    @ciudad SMALLINT,
    @indicacion VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Proveedores (IDProveedor, NombreProveedor, ciudad, indicacion)
    VALUES (@IDProveedor, @NombreProveedor, @ciudad, @indicacion);
END;
GO

CREATE PROCEDURE sp_update_proveedor
    @IDProveedor INT,
    @NombreProveedor CHAR(30),
    @ciudad SMALLINT,
    @indicacion VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Proveedores 
    SET NombreProveedor = @NombreProveedor, 
        ciudad = @ciudad, 
        indicacion = @indicacion
    WHERE IDProveedor = @IDProveedor;
END;
GO

CREATE PROCEDURE sp_delete_proveedor
    @IDProveedor INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Proveedores WHERE IDProveedor = @IDProveedor;
END;
GO

-- =============================================
-- MATERIAS PRIMAS - Procedimientos CRUD con subclases
-- =============================================

CREATE PROCEDURE sp_select_materias_primas
    @IDMateriaPrima INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @IDMateriaPrima IS NULL
        SELECT mp.*, 
               mat.descripcion, mat.color,
               ing.fecha_expiracion
        FROM MateriasPrimas mp
        LEFT JOIN Materiales mat ON mp.IDMateriaPrima = mat.IDMateriaPrima
        LEFT JOIN Ingredientes ing ON mp.IDMateriaPrima = ing.IDMateriaPrima
    ELSE
        SELECT mp.*, 
               mat.descripcion, mat.color,
               ing.fecha_expiracion
        FROM MateriasPrimas mp
        LEFT JOIN Materiales mat ON mp.IDMateriaPrima = mat.IDMateriaPrima
        LEFT JOIN Ingredientes ing ON mp.IDMateriaPrima = ing.IDMateriaPrima
        WHERE mp.IDMateriaPrima = @IDMateriaPrima
END;
GO

CREATE PROCEDURE sp_insert_materia_prima
    @IDMateriaPrima INT,
    @tipo VARCHAR(100),
    @marca VARCHAR(20),
    @nombre VARCHAR(30),
    @FechaDeCompra DATE,
    @precio DECIMAL(10,2),
    @cantidad INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO MateriasPrimas (IDMateriaPrima, tipo, marca, nombre, FechaDeCompra, precio, cantidad)
    VALUES (@IDMateriaPrima, @tipo, @marca, @nombre, @FechaDeCompra, @precio, @cantidad);
END;
GO

CREATE PROCEDURE sp_update_materia_prima
    @IDMateriaPrima INT,
    @tipo VARCHAR(100),
    @marca VARCHAR(20),
    @nombre VARCHAR(30),
    @FechaDeCompra DATE,
    @precio DECIMAL(10,2),
    @cantidad INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE MateriasPrimas 
    SET tipo = @tipo, 
        marca = @marca, 
        nombre = @nombre, 
        FechaDeCompra = @FechaDeCompra, 
        precio = @precio, 
        cantidad = @cantidad
    WHERE IDMateriaPrima = @IDMateriaPrima;
END;
GO

CREATE PROCEDURE sp_delete_materia_prima
    @IDMateriaPrima INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Delete from subclass tables first
    DELETE FROM Materiales WHERE IDMateriaPrima = @IDMateriaPrima;
    DELETE FROM Ingredientes WHERE IDMateriaPrima = @IDMateriaPrima;
    
    -- Then delete from main table
    DELETE FROM MateriasPrimas WHERE IDMateriaPrima = @IDMateriaPrima;
END;
GO

-- =============================================
-- PRODUCTOS - Procedimientos CRUD
-- =============================================

CREATE PROCEDURE sp_select_productos
    @IDProducto INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @IDProducto IS NULL
        SELECT * FROM Productos
    ELSE
        SELECT * FROM Productos WHERE IDProducto = @IDProducto
END;
GO

CREATE PROCEDURE sp_insert_producto
    @IDProducto INT,
    @tipo VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Productos (IDProducto, tipo)
    VALUES (@IDProducto, @tipo);
END;
GO

CREATE PROCEDURE sp_update_producto
    @IDProducto INT,
    @tipo VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Productos 
    SET tipo = @tipo
    WHERE IDProducto = @IDProducto;
END;
GO

CREATE PROCEDURE sp_delete_producto
    @IDProducto INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Productos WHERE IDProducto = @IDProducto;
END;
GO

-- =============================================
-- PEDIDOS - Procedimientos especiales para el sistema
-- =============================================

CREATE PROCEDURE sp_select_all_pedidos
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT p.NumPedido, p.descripcion,
           clpe.cedula, clpe.FechaEntrega, clpe.EstadoPedido,
           pe.nombre as nombreCliente, 
           pe.apellido1 as apellidoCliente
    FROM Pedidos p
    INNER JOIN CL_PE clpe ON p.NumPedido = clpe.NumPedido
    LEFT JOIN personas pe ON clpe.cedula = pe.cedula
    ORDER BY p.NumPedido DESC;
END;
GO

CREATE PROCEDURE sp_select_pedidos_by_cliente
    @cedula INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT p.NumPedido, p.descripcion,
           clpe.cedula, clpe.FechaEntrega, clpe.EstadoPedido,
           pe.nombre as nombreCliente, 
           pe.apellido1 as apellidoCliente
    FROM Pedidos p
    INNER JOIN CL_PE clpe ON p.NumPedido = clpe.NumPedido
    LEFT JOIN personas pe ON clpe.cedula = pe.cedula
    WHERE clpe.cedula = @cedula
    ORDER BY clpe.FechaEntrega DESC;
END;
GO

CREATE PROCEDURE sp_create_customer_order
    @cedula INT,
    @descripcion VARCHAR(200),
    @FechaEntrega DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NumPedido INT;
    
    -- Get next pedido number
    SELECT @NumPedido = ISNULL(MAX(NumPedido), 0) + 1 FROM Pedidos;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Insert into Pedidos
        INSERT INTO Pedidos (NumPedido, descripcion)
        VALUES (@NumPedido, @descripcion);
        
        -- Insert into CL_PE relationship
        INSERT INTO CL_PE (cedula, NumPedido, FechaEntrega, EstadoPedido)
        VALUES (@cedula, @NumPedido, @FechaEntrega, 'encargado');
        
        COMMIT;
        
        -- Return the new pedido number
        SELECT @NumPedido as NumPedido;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE sp_update_order_status
    @NumPedido INT,
    @EstadoPedido CHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE CL_PE 
    SET EstadoPedido = @EstadoPedido
    WHERE NumPedido = @NumPedido;
END;
GO

-- =============================================
-- PROCEDIMIENTOS AUXILIARES PARA EL SISTEMA
-- =============================================

-- Obtener todas las ciudades
CREATE PROCEDURE sp_select_ciudades
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT c.*, p.provincia
    FROM Ciudades c
    LEFT JOIN Provincias p ON c.id_provincia = p.id_provincia
    ORDER BY c.ciudad;
END;
GO

-- Obtener todas las provincias
CREATE PROCEDURE sp_select_provincias
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT * FROM Provincias ORDER BY provincia;
END;
GO