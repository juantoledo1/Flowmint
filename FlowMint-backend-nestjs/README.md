# FlowMint Backend - NestJS

Backend para el sistema de gestión de turnos FlowMint, desarrollado con NestJS, Prisma y PostgreSQL (Supabase).

## 🚀 Características

- 🔐 Autenticación JWT
- 👥 Gestión de usuarios y roles
- 📅 Sistema de turnos
- 💈 Gestión de servicios
- 👨‍💼 Gestión de empleados
- 📊 Gestión de clientes
- 🗄️ Base de datos PostgreSQL con Supabase
- 🔄 Migraciones con Prisma

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm o yarn
- Supabase CLI instalado (`npm install -g supabase`)
- PostgreSQL (via Supabase local o cloud)

## 🛠️ Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

El archivo `.env` ya está configurado para usar Supabase local. Si quieres usar Supabase Cloud, actualiza las variables:

```env
# Para Supabase Local (desarrollo)
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres?schema=public"

# Para Supabase Cloud (producción)
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Iniciar Supabase Local

En el directorio raíz del proyecto (FlowMint):

```bash
cd ..
supabase start
```

Esto iniciará:
- PostgreSQL en `localhost:54322`
- API en `localhost:54321`
- Studio en `http://localhost:54323`
- Inbucket (email testing) en `http://localhost:54324`

### 4. Generar el cliente de Prisma

```bash
npm run prisma:generate
```

### 5. Ejecutar migraciones

```bash
npm run prisma:migrate
```

### 6. Poblar la base de datos (opcional)

```bash
npm run prisma:seed
```

Esto creará:
- **Roles**: Administrador, Usuario, Empleado
- **Usuarios de prueba**:
  - Admin: `admin` / `admin123`
  - Usuario: `usuario` / `user123`
- **Servicios**: Corte de cabello, Coloración, Arreglo de barba, Masaje capilar
- **Empleados**: 3 empleados de ejemplo
- **Clientes**: 3 clientes de ejemplo
- **Turnos**: 2 turnos de ejemplo

## 🏃 Ejecutar el Servidor

### Modo desarrollo (con hot-reload)

```bash
npm run start:dev
```

### Modo producción

```bash
npm run build
npm run start:prod
```

El servidor estará disponible en:
- API: `http://localhost:3000/api`
- Health check: `http://localhost:3000/api` (GET)

## 📚 Endpoints Disponibles

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/profile` - Obtener perfil (requiere autenticación)

### Usuarios

- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear usuario
- `PATCH /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Roles

- `GET /api/roles` - Listar roles
- `GET /api/roles/:id` - Obtener rol por ID
- `POST /api/roles` - Crear rol
- `PATCH /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol

### Clientes

- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/:id` - Obtener cliente por ID
- `POST /api/clientes` - Crear cliente
- `PATCH /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Empleados

- `GET /api/empleados` - Listar empleados
- `GET /api/empleados/:id` - Obtener empleado por ID
- `POST /api/empleados` - Crear empleado
- `PATCH /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado

### Servicios

- `GET /api/servicios` - Listar servicios
- `GET /api/servicios/:id` - Obtener servicio por ID
- `POST /api/servicios` - Crear servicio
- `PATCH /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

### Turnos

- `GET /api/turnos` - Listar turnos
- `GET /api/turnos/:id` - Obtener turno por ID
- `POST /api/turnos` - Crear turno
- `PATCH /api/turnos/:id` - Actualizar turno
- `DELETE /api/turnos/:id` - Eliminar turno

## 🗄️ Comandos de Base de Datos

### Ver la base de datos en el navegador

```bash
npm run prisma:studio
```

Abre Prisma Studio en `http://localhost:5555`

### Crear nueva migración

```bash
npm run prisma:migrate
```

### Resetear la base de datos

```bash
npm run prisma:migrate:reset
```

### Aplicar migraciones en producción

```bash
npm run prisma:migrate:deploy
```

## 🔄 Migración a Supabase Cloud

Cuando estés listo para pasar a Supabase Cloud:

1. Crea un proyecto en [app.supabase.com](https://app.supabase.com)

2. Obtén tu connection string desde el dashboard de Supabase:
   - Settings → Database → Connection string

3. Actualiza el `.env`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

4. Ejecuta las migraciones:

```bash
npm run prisma:migrate:deploy
npm run prisma:seed
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐛 Debugging

Para depurar en modo debug:

```bash
npm run start:debug
```

Luego conecta tu debugger al puerto 9229.

## 📦 Build

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

## 🔧 Tecnologías

- **NestJS** - Framework de Node.js
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos (via Supabase)
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Class Validator** - Validación de DTOs
- **Passport** - Estrategias de autenticación

## 📝 Estructura del Proyecto

```
src/
├── auth/              # Módulo de autenticación
├── clientes/          # Módulo de clientes
├── empleados/         # Módulo de empleados
├── prisma/            # Servicio de Prisma
├── roles/             # Módulo de roles
├── servicios/         # Módulo de servicios
├── turnos/            # Módulo de turnos
├── usuarios/          # Módulo de usuarios
├── app.module.ts      # Módulo raíz
└── main.ts            # Punto de entrada

prisma/
├── schema.prisma      # Esquema de la base de datos
└── seed.ts            # Datos iniciales
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

## 👨‍💻 Autor

FlowMint Team

## 🆘 Soporte

Si tienes problemas, revisa:
- Logs del servidor
- Logs de Supabase: `supabase status`
- Prisma Studio para verificar datos