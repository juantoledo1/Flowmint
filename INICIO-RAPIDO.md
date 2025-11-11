# 🚀 Guía de Inicio Rápido - FlowMint Backend

## ✅ Estado del Proyecto

El backend NestJS está **completamente configurado y funcionando** con:
- ✅ Base de datos PostgreSQL (puerto 54322)
- ✅ Prisma ORM configurado
- ✅ Migraciones aplicadas
- ✅ Datos de prueba cargados
- ✅ Todos los módulos funcionando
- ✅ Autenticación JWT configurada
- ✅ CORS habilitado

## 📦 Requisitos

- Node.js >= 18
- Docker (para PostgreSQL)
- npm

## 🎯 Inicio Rápido (3 pasos)

### 1. Iniciar la Base de Datos

```bash
cd FlowMint/FlowMint-backend-nestjs
./start-db.sh
```

Esto iniciará PostgreSQL en el puerto **54322**.

### 2. Iniciar el Servidor Backend

```bash
cd FlowMint/FlowMint-backend-nestjs
npm run start:dev
```

El servidor estará disponible en: **http://localhost:3000/api**

### 3. ¡Listo! 🎉

Ahora puedes usar la API con las siguientes credenciales:

**Usuario Admin:**
- Usuario: `admin`
- Password: `admin123`

**Usuario Normal:**
- Usuario: `usuario`
- Password: `user123`

---

## 📚 Endpoints Disponibles

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Ver perfil (requiere token)

### Usuarios
- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/:id` - Ver uno
- `POST /api/usuarios` - Crear
- `PATCH /api/usuarios/:id` - Actualizar
- `DELETE /api/usuarios/:id` - Eliminar

### Roles
- `GET /api/roles` - Listar todos
- `POST /api/roles` - Crear
- `GET /api/roles/:id` - Ver uno
- `PATCH /api/roles/:id` - Actualizar
- `DELETE /api/roles/:id` - Eliminar

### Clientes
- `GET /api/clientes` - Listar todos
- `POST /api/clientes` - Crear
- `GET /api/clientes/:id` - Ver uno
- `PATCH /api/clientes/:id` - Actualizar
- `DELETE /api/clientes/:id` - Eliminar

### Empleados
- `GET /api/empleados` - Listar todos
- `POST /api/empleados` - Crear
- `GET /api/empleados/:id` - Ver uno
- `PATCH /api/empleados/:id` - Actualizar
- `DELETE /api/empleados/:id` - Eliminar

### Servicios
- `GET /api/servicios` - Listar todos
- `POST /api/servicios` - Crear
- `GET /api/servicios/:id` - Ver uno
- `PATCH /api/servicios/:id` - Actualizar
- `DELETE /api/servicios/:id` - Eliminar

### Turnos
- `GET /api/turnos` - Listar todos
- `POST /api/turnos` - Crear
- `GET /api/turnos/:id` - Ver uno
- `PATCH /api/turnos/:id` - Actualizar
- `DELETE /api/turnos/:id` - Eliminar

---

## 🧪 Probar el Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user": "admin",
    "pass": "admin123"
  }'
```

Respuesta esperada:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "usuario_id": 1,
    "nombre": "Admin",
    "apellido": "Sistema",
    "user": "admin",
    "rol_id": 1
  }
}
```

---

## 🗄️ Ver la Base de Datos

Para explorar los datos en un navegador:

```bash
cd FlowMint/FlowMint-backend-nestjs
npm run prisma:studio
```

Abre: **http://localhost:5555**

---

## 🔧 Comandos Útiles

### Base de Datos

```bash
# Ver estado de la BD
docker ps | grep flowmint-postgres

# Ver logs
docker logs -f flowmint-postgres

# Detener
docker stop flowmint-postgres

# Iniciar de nuevo
docker start flowmint-postgres

# Eliminar (cuidado: borra todos los datos)
docker rm -f flowmint-postgres
docker volume rm flowmint-postgres-data
```

### Prisma

```bash
# Generar cliente
npm run prisma:generate

# Crear migración
npm run prisma:migrate

# Resetear BD y datos
npm run prisma:migrate:reset

# Ver BD en navegador
npm run prisma:studio

# Cargar datos de prueba
npm run prisma:seed
```

### Backend

```bash
# Desarrollo con hot-reload
npm run start:dev

# Build
npm run build

# Producción
npm run start:prod

# Tests
npm run test
```

---

## 📊 Datos de Prueba Incluidos

### Roles (3)
1. Administrador
2. Usuario
3. Empleado

### Usuarios (2)
- Admin (admin/admin123)
- Usuario (usuario/user123)

### Servicios (4)
- Corte de Cabello - $15 - 30 min
- Coloración - $45 - 90 min
- Arreglo de Barba - $10 - 20 min
- Masaje Capilar - $20 - 45 min

### Empleados (3)
- Juan Pérez - Estilista Senior
- María González - Colorista
- Carlos Rodríguez - Barbero

### Clientes (3)
- Ana Martínez
- Pedro López
- Laura Fernández

### Turnos (2)
- Turno confirmado (mañana 10:00)
- Turno pendiente (pasado mañana 14:30)

---

## 🌐 Migrar a Supabase Cloud

Cuando estés listo para producción:

1. **Crea un proyecto en Supabase**
   - Ve a: https://app.supabase.com
   - Crea un nuevo proyecto

2. **Obtén tu Connection String**
   - Settings → Database → Connection string
   - Copia el URI

3. **Actualiza el `.env`**
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   SUPABASE_ANON_KEY="tu-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"
   ```

4. **Aplica migraciones**
   ```bash
   npm run prisma:migrate:deploy
   npm run prisma:seed
   ```

5. **¡Listo!** Tu app ahora usa Supabase Cloud

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

```bash
# Verifica que PostgreSQL esté corriendo
docker ps | grep flowmint-postgres

# Si no está, inícialo
./start-db.sh
```

### Error: "Prisma Client not generated"

```bash
npm run prisma:generate
```

### Error: "Port 3000 already in use"

```bash
# Mata el proceso en el puerto 3000
lsof -ti:3000 | xargs kill -9

# O cambia el puerto en .env
PORT=3001
```

### Error: "JWT Secret is required"

Verifica que el archivo `.env` existe y tiene:
```env
JWT_SECRET="super-secret-key-that-should-be-in-a-vault-change-in-production"
```

---

## 📝 Estructura del Proyecto

```
FlowMint-backend-nestjs/
├── prisma/
│   ├── schema.prisma       # Esquema de la BD
│   ├── seed.ts            # Datos iniciales
│   └── migrations/        # Historial de cambios
├── src/
│   ├── auth/              # Autenticación JWT
│   ├── clientes/          # CRUD Clientes
│   ├── empleados/         # CRUD Empleados
│   ├── prisma/            # Servicio Prisma
│   ├── roles/             # CRUD Roles
│   ├── servicios/         # CRUD Servicios
│   ├── turnos/            # CRUD Turnos
│   ├── usuarios/          # CRUD Usuarios
│   ├── app.module.ts      # Módulo principal
│   └── main.ts            # Entry point
├── .env                   # Variables de entorno
├── package.json           # Dependencias
└── start-db.sh           # Script para iniciar BD

```

---

## ✨ Características Implementadas

- ✅ **Autenticación JWT** - Login seguro con tokens
- ✅ **Validación de datos** - DTOs con class-validator
- ✅ **CORS habilitado** - Para frontend React
- ✅ **Prefijo global** - Todas las rutas en `/api`
- ✅ **Manejo de errores** - Respuestas consistentes
- ✅ **Hot reload** - Desarrollo rápido
- ✅ **Prisma ORM** - Queries type-safe
- ✅ **Migraciones** - Control de versiones de BD
- ✅ **Seeds** - Datos de prueba automáticos
- ✅ **TypeScript** - Type safety completo
- ✅ **PostgreSQL** - Base de datos robusta
- ✅ **Docker** - Fácil de desplegar

---

## 🎓 Próximos Pasos

1. **Conectar el Frontend React** al backend
2. **Agregar validaciones** más específicas
3. **Implementar roles y permisos** más granulares
4. **Agregar paginación** a los listados
5. **Crear filtros** para búsquedas
6. **Implementar notificaciones** de turnos
7. **Agregar tests** unitarios y e2e
8. **Configurar CI/CD** para despliegue automático

---

## 📞 Soporte

Si algo no funciona:
1. Lee esta guía completa
2. Revisa los logs del servidor
3. Verifica que la BD esté corriendo
4. Consulta el README.md principal

---

## 🎉 ¡Todo está listo!

El backend está completamente funcional y listo para usar. Solo necesitas:

1. **Iniciar la BD**: `./start-db.sh`
2. **Iniciar el server**: `npm run start:dev`
3. **Empezar a desarrollar** 🚀

---

**Última actualización**: 11 de noviembre de 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Producción Ready