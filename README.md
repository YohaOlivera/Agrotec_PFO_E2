<p align="center">
  <img src="./assets/YodaLabs.png" alt="YodaLabs Logo" width="220">
</p>


<p align="center">
  <strong>Sistema de Monitoreo de Lotes Agrícolas</strong><br>
  Backend REST desarrollado con Node.js + Express + persistencia en MongoDB
</p>

## Enlaces del proyecto

| Recurso | Enlace |
|---|---|
| Carpeta de Drive | [Ver carpeta](https://drive.google.com/drive/folders/1T1AhoS5pFML2QUu2URkSjbAvRI-ApKK1?hl=es) |
| Repositorio GitHub | [Ver repositorio](https://github.com/YohaOlivera/Agrotec_PFO_E2) |
| Video de presentación | [Ver video](modificar) |

---

## Índice

1. [Descripción general](#-descripción-general)
2. [Problemática que resuelve](#-problemática-que-resuelve)
3. [Tecnologías utilizadas](#-tecnologías-utilizadas)
4. [Arquitectura y organización del proyecto](#-arquitectura-y-organización-del-proyecto)
5. [Estructura de carpetas](#-estructura-de-carpetas)
6. [Instalación y ejecución](#-instalación-y-ejecución)
7. [Modelo de datos](#-modelo-de-datos)
8. [Endpoints de la API](#-endpoints-de-la-api)
9. [Vistas con Pug (Server-Side Rendering)](#-vistas-con-pug-server-side-rendering)
10. [Consultas destacadas](#-consultas-destacadas)
11. [Reglas de negocio y validaciones](#-reglas-de-negocio-y-validaciones)
12. [Manejo de errores y códigos HTTP](#-manejo-de-errores-y-códigos-http)
13. [Pruebas de endpoints](#-pruebas-de-endpoints)
14. [Integrantes y responsabilidades](#-integrantes-y-responsabilidades)
15. [Próximas mejoras](#-próximas-mejoras)

---

## Descripción general

**AgroTec** es una empresa que brinda servicios de monitoreo a productores agrícolas. Este proyecto implementa el **backend funcional** de un sistema que reemplaza el registro manual en papel y planillas aisladas, centralizando la información de:

- **Productores** y sus establecimientos
- **Lotes** asociados a cada productor
- **Técnicos** de campo
- **Tipos de cultivo** (catálogo base)
- **Observaciones** realizadas por los técnicos, con historial trazable por lote

El sistema expone una **API REST** para consumo de servicios y vistas básicas renderizadas con **Pug**. También cuenta con un módulo de **autenticación** (registro e inicio de sesión de usuarios).

---

## Problemática que resuelve

Los técnicos de AgroTec registraban información en **papel** y luego la volcaban en **planillas dispersas**, lo que dificultaba:

- Consultar el historial de cada lote
- Detectar lotes con alertas agronómicas
- Mantener trazabilidad de las observaciones

Esta solución **centraliza los datos**, garantiza la **integridad referencial** y conserva el **historial histórico** mediante borrado lógico (*soft delete*).

---

## Tecnologías utilizadas

| Tecnología | Rol en el proyecto |
|---|---|
| **Node.js** | Entorno de ejecución del servidor |
| **Express.js** | Framework para la API REST, ruteo modular y middlewares |
| **Pug** | Motor de plantillas server-side para vistas básicas |
| **MongoDB** | Base de datos documental |
| **Mongoose** | Modelos, validación y acceso a MongoDB |
| **dotenv** | Gestión de variables de entorno |
| **swagger-jsdoc + swagger-ui-express** | Documentación interactiva de la API (OpenAPI 3.0) |
| **migrate-mongo** | Gestión de migraciones de esquema en MongoDB |
| **path** (nativo de Node) | Manejo de rutas de sistema de archivos |
| **JavaScript ES6+ (CommonJS)** | Módulos, desestructuración, async/await |
| **npm** | Gestión de dependencias y scripts |
| **Postman / Thunder Client** | Testing manual de endpoints |
| **Git / GitHub** | Control de versiones y colaboración |

---

## Arquitectura y organización del proyecto

El proyecto sigue un patrón **MVC (Modelo – Vista – Controlador)**:

- **Modelos Mongoose** (`Productor`, `Tecnico`, `Lote`, `Observacion`, `TipoCultivo`, `User`) → definen los documentos, esquemas y validaciones a nivel de base de datos.
- **Controladores** → procesan cada petición HTTP, aplican validaciones de negocio y devuelven la respuesta.
- **Rutas** → mapean los endpoints HTTP a sus controladores correspondientes.
- **Vistas Pug** → renderizado server-side para consulta visual en el navegador.

| Elemento | Función |
|---|---|
| `app.js` | Configura Express, Pug, middlewares, rutas, Swagger, manejo de errores e inicio del servidor |
| `config/` | Conexión a MongoDB (`db.js`) y configuración DNS (`mongo-dns.js`) |
| `routes/` | Define endpoints y métodos HTTP por recurso |
| `controllers/` | Procesa peticiones, valida datos y devuelve respuestas HTTP |
| `models/` | Esquemas Mongoose con validaciones integradas |
| `migrations/` | Migraciones de esquema administradas con `migrate-mongo` |
| `scripts/` | Script de seed para poblar la base con datos iniciales |
| `data/` | Archivos JSON con datos de origen para el seed |
| `views/` | Plantillas Pug para las vistas del navegador |
| `assets/` | Imágenes y documentos del proyecto |
| `package.json` | Metadatos, scripts y dependencias |

---

## Estructura de carpetas

```
Agrotec_PFO_E2/
├── assets/
│   ├── DSWB_2A_YodaLabs-Informe_2C26.docx
│   ├── DSWB_2A_YodaLabs-SegundaEntrega.docx
│   ├── Img1.JPG
│   ├── Img2.JPG
│   └── YodaLabs.png
├── config/
│   ├── db.js
│   └── mongo-dns.js
├── controllers/
│   ├── authController.js
│   ├── lotesController.js
│   ├── observacionesController.js
│   ├── productoresController.js
│   ├── tecnicosController.js
│   └── tiposCultivoController.js
├── data/
│   ├── lotes.json
│   ├── observaciones.json
│   ├── productores.json
│   ├── tecnicos.json
│   └── tipos_cultivo.json
├── migrations/
│   ├── 20261012170000-create-initial-collections.js
│   └── 20261012190000-seed-initial-data.js
├── models/
│   ├── Lote.js
│   ├── Observacion.js
│   ├── Productor.js
│   ├── Tecnico.js
│   ├── TipoCultivo.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── lotesRoutes.js
│   ├── observacionesRoutes.js
│   ├── productoresRoutes.js
│   ├── tecnicosRoutes.js
│   └── tiposCultivoRoutes.js
├── scripts/
│   └── seed.js
├── views/
│   ├── index.pug
│   ├── lote_detalle.pug
│   └── lotes.pug
├── .env.example
├── .gitignore
├── app.js
├── migrate-mongo-config.js
├── package-lock.json
├── package.json
└── README.md
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/LeonelDiaz225/Repo-Backend_2A.git
cd Repo-Backend_2A
```

> El proyecto está disponible en la rama **`V.2.0`**.

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear el archivo de entorno

Para desarrollo, copia la plantilla y ajusta `MONGO_URI` según tu instalación de MongoDB:

```powershell
Copy-Item .env.example .env
```

`.env` es local y no debe subirse a Git. La plantilla usa MongoDB local (`127.0.0.1`).

Contenido del `.env.example`:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/agrotec
```

### 4. Ejecutar el servidor en desarrollo

```bash
npm start
```

El servidor quedará disponible en:

```
http://localhost:3000
```

La documentación interactiva Swagger estará en:

```
http://localhost:3000/api-docs
```

### 5. Iniciar en producción

Crea `prod.env` con los datos de conexión de MongoDB Atlas y ejecuta:

```bash
npm run start:prod
```

### Migraciones de MongoDB

Las migraciones se administran con `migrate-mongo`. Los comandos en desarrollo usan `.env`; los comandos con sufijo `:prod` usan `prod.env`.

```bash
# Crear una migración nueva
npm run migrate:create -- agregar-campo

# Aplicar, revertir o consultar el estado en desarrollo
npm run migrate:up
npm run migrate:down
npm run migrate:status

# Aplicar o consultar migraciones en producción
npm run migrate:up:prod
npm run migrate:status:prod
```

### Seed de datos iniciales

El script `seed.js` carga los archivos JSON de `data/` en MongoDB. Primero podés validar las referencias y luego ejecutar el seed:

```bash
# Validar los datos del seed sin conectarse a la base
node scripts/seed.js --check

# Ejecutar seed en desarrollo
npm run seed

# Ejecutar seed en producción
npm run seed:prod
```

El seed es **idempotente**: puede ejecutarse múltiples veces sin duplicar datos.

---

## Modelo de datos

La aplicación persiste los datos en MongoDB mediante modelos Mongoose. Los archivos JSON de `data/` se usan exclusivamente como fuente para el seed inicial.

### `productores` — Modelo `Productor`

```json
{
  "_id": "ObjectId",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "1122334455",
  "email": "juan.perez@agrotec.com",
  "establecimiento": "Estancia El Ombú",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### `lotes` — Modelo `Lote`

```json
{
  "_id": "ObjectId",
  "nombre_numero": "Lote 45 Sur",
  "id_productor": "ObjectId (ref: Productor)",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### `tecnicos` — Modelo `Tecnico`

```json
{
  "_id": "ObjectId",
  "nombre": "María",
  "apellido": "Gómez",
  "telefono": "1188990011",
  "email": "maria.gomez@agrotec.com",
  "especialidad": "Control de plagas",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### `tiposcultivos` — Modelo `TipoCultivo`

```json
{
  "_id": "ObjectId",
  "nombre": "Soja",
  "createdAt": "...",
  "updatedAt": "..."
}
```

> El campo `nombre` es único (índice único en MongoDB).

### `observaciones` — Modelo `Observacion`

```json
{
  "_id": "ObjectId",
  "id_lote": "ObjectId (ref: Lote)",
  "id_tecnico": "ObjectId (ref: Tecnico)",
  "fecha": "2026-09-10T00:00:00.000Z",
  "tipo_cultivo": "Soja",
  "estado_cultivo": "En crecimiento",
  "observaciones": "Se detectó leve sequía en el sector norte.",
  "nivel_alerta": "Atención",
  "activa": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

> **Soft delete**: el campo `activa: false` indica que la observación fue dada de baja lógicamente. Las consultas (`getAll`, `getById`, filtros por alerta) retornan solo registros con `activa: true`.

### `users` — Modelo `User`

```json
{
  "_id": "ObjectId",
  "username": "admin",
  "password": "123456",
  "nombre": "Administrador",
  "apellido": "Sistema",
  "email": "admin@agrotec.com",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## Endpoints de la API

### Autenticación — `/api/auth`

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | `{ username, password, nombre, apellido, email }` | Registra un nuevo usuario |
| POST | `/api/auth/login` | `{ username, password }` | Inicia sesión y devuelve los datos del usuario |

### Productores — `/api/productores`

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| GET | `/api/productores` | — | Lista todos los productores |
| GET | `/api/productores/:id` | — | Obtiene un productor por ID |
| POST | `/api/productores` | `{ nombre, apellido, telefono, email, establecimiento }` | Registra un nuevo productor |
| PUT | `/api/productores/:id` | `{ nombre, apellido, telefono, email, establecimiento }` | Actualiza un productor |
| DELETE | `/api/productores/:id` | — | Elimina un productor |

### Lotes — `/api/lotes`

| Método | Endpoint | Body / Query | Descripción |
|---|---|---|---|
| GET | `/api/lotes` | `?alerta=Normal\|Atención\|Crítico` | Lista lotes (admite filtro por nivel de alerta activa) |
| GET | `/api/lotes/:id` | — | Obtiene un lote por ID |
| GET | `/api/lotes/:id/observaciones` | — | Historial de observaciones activas del lote |
| POST | `/api/lotes` | `{ nombre_numero, id_productor }` | Crea un lote (valida que el productor exista) |
| PUT | `/api/lotes/:id` | `{ nombre_numero, id_productor }` | Actualiza un lote |
| DELETE | `/api/lotes/:id` | — | Elimina un lote |

### Observaciones — `/api/observaciones`

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| GET | `/api/observaciones` | — | Lista observaciones activas |
| GET | `/api/observaciones/:id` | — | Obtiene una observación activa por ID |
| POST | `/api/observaciones` | `{ id_lote, id_tecnico, fecha, tipo_cultivo, estado_cultivo, observaciones, nivel_alerta }` | Registra una observación |
| PUT | `/api/observaciones/:id` | `{ id_lote, id_tecnico, fecha, tipo_cultivo, estado_cultivo, observaciones, nivel_alerta }` | Actualiza una observación activa |
| DELETE | `/api/observaciones/:id` | — | Borrado lógico (*soft delete*): marca `activa: false` |

### Técnicos — `/api/tecnicos`

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| GET | `/api/tecnicos` | — | Lista todos los técnicos |
| GET | `/api/tecnicos/:id` | — | Obtiene un técnico por ID |
| POST | `/api/tecnicos` | `{ nombre, apellido, telefono, email, especialidad }` | Registra un técnico |
| PUT | `/api/tecnicos/:id` | `{ nombre, apellido, telefono, email, especialidad }` | Actualiza un técnico |
| DELETE | `/api/tecnicos/:id` | — | Elimina un técnico |

### Tipos de cultivo — `/api/tipos-cultivo`

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| GET | `/api/tipos-cultivo` | — | Obtiene el catálogo completo |
| GET | `/api/tipos-cultivo/:id` | — | Obtiene un tipo por ID |
| POST | `/api/tipos-cultivo` | `{ nombre }` | Agrega un tipo de cultivo |
| PUT | `/api/tipos-cultivo/:id` | `{ nombre }` | Modifica un tipo de cultivo |
| DELETE | `/api/tipos-cultivo/:id` | — | Elimina un tipo de cultivo |

---

## Vistas con Pug (Server-Side Rendering)

| Ruta | Vista | Descripción |
|---|---|---|
| `GET /` | `index.pug` | Página de bienvenida a AgroTec |
| `GET /vista/lotes` | `lotes.pug` | Tabla con listado general de lotes y su productor asociado |
| `GET /vista/lotes/:id` | `lote_detalle.pug` | Ficha del lote + historial de observaciones activas |

La vista `lote_detalle.pug` aplica estilos CSS según el nivel de alerta:
- 🟢 `Normal`
- 🟠 `Atención`
- 🔴 `Crítico`

> ![Captura de la vista de Lotes y Observaciones](assets/Img1.JPG)
> ![Captura de la vista de Lotes y Observaciones](assets/Img2.JPG)

---

## Consultas destacadas

El sistema implementa las siguientes consultas específicas solicitadas por el negocio:

### 1. Historial de observaciones por lote

```
GET /api/lotes/:id/observaciones
```

Devuelve todas las observaciones **activas** asociadas al lote indicado, con el técnico responsable populado.

### 2. Búsqueda de lotes por nivel de alerta

```
GET /api/lotes?alerta=Crítico
```

Filtra los lotes que tengan al menos una observación activa con el nivel de alerta indicado. Los valores posibles son `Normal`, `Atención` y `Crítico`.

### 3. Consulta de observaciones activas

```
GET /api/observaciones
```

Devuelve únicamente las observaciones cuyo campo `activa` sea `true`, respetando el borrado lógico.

---

## Reglas de negocio y validaciones

### Validaciones a nivel de esquema Mongoose

- **`Productor` / `Tecnico`**: `nombre` y `apellido` son campos requeridos.
- **`Lote`**: `nombre_numero` y `id_productor` son requeridos.
- **`Observacion`**: `id_lote`, `id_tecnico`, `fecha`, `tipo_cultivo` y `nivel_alerta` son requeridos. El `nivel_alerta` solo acepta `"Normal"`, `"Atención"` o `"Crítico"` (enum).
- **`TipoCultivo`**: `nombre` es requerido y único (índice único).
- **`User`**: `username` y `email` son únicos; `username` tiene mínimo 3 caracteres; `password` tiene mínimo 6 caracteres; `email` se valida con regex.

### Integridad referencial (controllers)

- **Lote → Productor**: se valida que el `id_productor` exista antes de crear o modificar un lote.
- **Observación → Lote / Técnico / TipoCultivo**: se validan secuencialmente:
  - El `id_lote` debe existir.
  - El `id_tecnico` debe existir.
  - El `tipo_cultivo` debe estar en el catálogo de `TipoCultivo`.
- **Fecha**: se valida con `Date.parse(fecha)`.
- **Nivel de alerta**: solo se admiten `"Normal"`, `"Atención"` o `"Crítico"`.
- **Formato de ID**: todos los parámetros `:id` se validan con `mongoose.Types.ObjectId.isValid()` antes de consultar la base.
- **Inmutabilidad de auditoría**: las observaciones **no se eliminan físicamente**; se aplica *soft delete* asignando `activa: false`.

---

## Manejo de errores y códigos HTTP

| Código | Situación |
|---|---|
| **200 OK** | Consultas y actualizaciones exitosas |
| **201 Created** | Creación exitosa de un recurso |
| **400 Bad Request** | Falta de campos obligatorios, tipos incorrectos, alertas inválidas o violación de integridad referencial |
| **401 Unauthorized** | Credenciales incorrectas en el login |
| **404 Not Found** | Recurso inexistente por `:id` o ruta no encontrada (middleware global) |
| **500 Internal Server Error** | Excepciones no controladas o fallos de lectura/escritura (middleware global) |

Todas las respuestas de error se devuelven en formato JSON:

```json
{ "error": "Descripción del error" }
```

---

## Pruebas de endpoints

Las pruebas se realizaron con **Postman** y **Thunder Client**.

> **Nota:** los IDs usados en los ejemplos son ObjectIds de MongoDB. Al ejecutar el seed con `npm run seed`, los IDs generados serán distintos. Usá `GET /api/productores`, `GET /api/tecnicos`, etc. para obtener los IDs reales de tu base.

---

### Autenticación

#### Registrar usuario (éxito)

- **Endpoint:** `POST /api/auth/register`
- **Body:**
```json
{
  "username": "admin",
  "password": "123456",
  "nombre": "Administrador",
  "apellido": "Sistema",
  "email": "admin@agrotec.com"
}
```
- **Respuesta:** `201 Created`
```json
{
  "mensaje": "Usuario registrado con éxito",
  "usuario": {
    "id": "68123abc4567def890123456",
    "username": "admin",
    "nombre": "Administrador",
    "apellido": "Sistema",
    "email": "admin@agrotec.com"
  }
}
```

#### Iniciar sesión (éxito)

- **Endpoint:** `POST /api/auth/login`
- **Body:**
```json
{ "username": "admin", "password": "123456" }
```
- **Respuesta:** `200 OK`
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "usuario": {
    "id": "68123abc4567def890123456",
    "username": "admin",
    "nombre": "Administrador",
    "apellido": "Sistema",
    "email": "admin@agrotec.com"
  }
}
```

#### Iniciar sesión con credenciales incorrectas

- **Respuesta:** `401 Unauthorized`
```json
{ "error": "Usuario o contraseña incorrectos" }
```

---

### Productores

#### Crear productor (éxito)

- **Endpoint:** `POST /api/productores`
- **Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "1122334455",
  "email": "juan.perez@agrotec.com",
  "establecimiento": "Estancia El Ombú"
}
```
- **Respuesta:** `201 Created`

#### Crear productor sin campos obligatorios

- **Body:** `{ "telefono": "1122334455" }`
- **Respuesta:** `400 Bad Request`
```json
{ "error": "El nombre y el apellido son obligatorios" }
```

---

### Lotes

#### Crear lote (éxito)

- **Endpoint:** `POST /api/lotes`
- **Body:**
```json
{
  "nombre_numero": "Lote 45 Sur",
  "id_productor": "68123abc4567def890123401"
}
```
- **Respuesta:** `201 Created`

#### Crear lote con productor inexistente

- **Body:**
```json
{
  "nombre_numero": "Lote 99 Este",
  "id_productor": "68123abc4567def890000000"
}
```
- **Respuesta:** `400 Bad Request`
```json
{ "error": "El Id productor no existe" }
```

#### Crear lote con ID de productor con formato inválido

- **Respuesta:** `400 Bad Request`
```json
{ "error": "ID de productor no válido" }
```

#### Filtrar lotes por nivel de alerta

- **Endpoint:** `GET /api/lotes?alerta=Crítico`
- **Respuesta:** `200 OK` — array con los lotes que tienen observaciones activas en nivel `Crítico`

#### Filtrar lotes con alerta inválida

- **Endpoint:** `GET /api/lotes?alerta=Grave`
- **Respuesta:** `400 Bad Request`
```json
{ "error": "Nivel de alerta inválido. Debe ser \"Normal\", \"Atención\" o \"Crítico\"" }
```

---

### Observaciones

#### Registrar observación (éxito)

- **Endpoint:** `POST /api/observaciones`
- **Body:**
```json
{
  "id_lote": "68123abc4567def890123402",
  "id_tecnico": "68123abc4567def890123403",
  "fecha": "2026-09-15",
  "tipo_cultivo": "Soja",
  "estado_cultivo": "Brote",
  "observaciones": "Nivel de humedad adecuado.",
  "nivel_alerta": "Normal"
}
```
- **Respuesta:** `201 Created`

#### Registrar observación con nivel de alerta inválido

- **Respuesta:** `400 Bad Request`
```json
{ "error": "El nivel de alerta debe ser \"Normal\", \"Atención\" o \"Crítico\"" }
```

#### Registrar observación sin fecha

- **Respuesta:** `400 Bad Request`
```json
{ "error": "Id lote, Id técnico, fecha, tipo de cultivo y nivel de alerta son obligatorios" }
```

#### Registrar observación con tipo de cultivo inexistente en el catálogo

- **Respuesta:** `400 Bad Request`
```json
{ "error": "El tipo de cultivo 'Algodón' no existe en el catálogo de cultivos" }
```

#### Dar de baja una observación (soft delete)

- **Endpoint:** `DELETE /api/observaciones/68123abc4567def890123404`
- **Respuesta:** `200 OK`
```json
{ "mensaje": "Observación dada de baja correctamente" }
```

> El registro permanece en la base de datos con `activa: false` y queda excluido de todas las consultas activas.

---

## Integrantes y responsabilidades

| Integrante | Responsabilidades |
|---|---|
| **Yohana Olivera** | Modelado de dominio: esquemas Mongoose de `Productor` y `Tecnico`. Validaciones a nivel de modelo. |
| **Itziar Urriola** | Configuración del servidor y entorno: Express, middlewares, ruteo central en `app.js`, gestión de dependencias en `package.json`. |
| **Melisa Salano** | Módulo de Tipos de Cultivo (`TipoCultivo.js` + `tiposCultivoController.js`). Módulo de Autenticación (`User.js` + `authController.js`). |
| **Maximiliano Millar** | Controlador de Observaciones y lógica de negocio. Implementación del *soft delete* para preservar el historial. |
| **Leonel Diaz** | Controlador de Lotes (CRUD + filtro por alerta + historial). Vistas Pug (`index.pug`, `lotes.pug`, `lote_detalle.pug`). |

---

## Próximas mejoras

- **Hashing de contraseñas** con `bcrypt` para almacenamiento seguro de credenciales
- **Autenticación con JWT** y protección de rutas mediante middleware
- **Roles y autorización** (administrador, productor, técnico)
- **Módulo de estadísticas y reportes** (métricas por lote, exportación a PDF/Excel)
- **Geolocalización de lotes** con mapas interactivos

---

<p align="center">
  <strong>YodaLabs</strong> · IFTS 29 · Desarrollo de Sistemas Web Backend · 2026
</p>
