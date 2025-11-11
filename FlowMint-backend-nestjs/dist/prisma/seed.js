"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');
    console.log('🗑️  Limpiando datos existentes...');
    await prisma.turno.deleteMany();
    await prisma.servicio.deleteMany();
    await prisma.empleado.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.rol.deleteMany();
    console.log('📝 Creando roles...');
    const rolAdmin = await prisma.rol.create({
        data: {
            rol_id: 1,
            nombre: 'Administrador',
        },
    });
    const rolUsuario = await prisma.rol.create({
        data: {
            rol_id: 2,
            nombre: 'Usuario',
        },
    });
    const rolEmpleado = await prisma.rol.create({
        data: {
            rol_id: 3,
            nombre: 'Empleado',
        },
    });
    console.log('✅ Roles creados:', [rolAdmin, rolUsuario, rolEmpleado]);
    console.log('👤 Creando usuario administrador...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.usuario.create({
        data: {
            nombre: 'Admin',
            apellido: 'Sistema',
            dni: '12345678',
            user: 'admin',
            pass: hashedPassword,
            correo: 'admin@flowmint.com',
            rol_id: 1,
            estado: 'A',
        },
    });
    console.log('✅ Usuario admin creado:', {
        user: admin.user,
        password: 'admin123',
        correo: admin.correo,
    });
    const hashedPasswordUser = await bcrypt.hash('user123', 10);
    const usuario = await prisma.usuario.create({
        data: {
            nombre: 'Usuario',
            apellido: 'Prueba',
            dni: '87654321',
            user: 'usuario',
            pass: hashedPasswordUser,
            correo: 'usuario@flowmint.com',
            rol_id: 2,
            estado: 'A',
        },
    });
    console.log('✅ Usuario de prueba creado:', {
        user: usuario.user,
        password: 'user123',
        correo: usuario.correo,
    });
    console.log('💈 Creando servicios...');
    const servicioCorte = await prisma.servicio.create({
        data: {
            nombre: 'Corte de Cabello',
            descripcion: 'Corte de cabello clásico',
            precio: 15.0,
            duracion: 30,
        },
    });
    const servicioColoracion = await prisma.servicio.create({
        data: {
            nombre: 'Coloración',
            descripcion: 'Tintura completa',
            precio: 45.0,
            duracion: 90,
        },
    });
    const servicioBarba = await prisma.servicio.create({
        data: {
            nombre: 'Arreglo de Barba',
            descripcion: 'Perfilado y arreglo de barba',
            precio: 10.0,
            duracion: 20,
        },
    });
    const servicioMasaje = await prisma.servicio.create({
        data: {
            nombre: 'Masaje Capilar',
            descripcion: 'Masaje relajante del cuero cabelludo',
            precio: 20.0,
            duracion: 45,
        },
    });
    console.log('✅ Servicios creados:', [
        servicioCorte,
        servicioColoracion,
        servicioBarba,
        servicioMasaje,
    ]);
    console.log('👨‍💼 Creando empleados...');
    const empleado1 = await prisma.empleado.create({
        data: {
            nombre: 'Juan',
            apellido: 'Pérez',
            puesto: 'Estilista Senior',
        },
    });
    const empleado2 = await prisma.empleado.create({
        data: {
            nombre: 'María',
            apellido: 'González',
            puesto: 'Colorista',
        },
    });
    const empleado3 = await prisma.empleado.create({
        data: {
            nombre: 'Carlos',
            apellido: 'Rodríguez',
            puesto: 'Barbero',
        },
    });
    console.log('✅ Empleados creados:', [empleado1, empleado2, empleado3]);
    console.log('👥 Creando clientes...');
    const cliente1 = await prisma.cliente.create({
        data: {
            nombre: 'Ana',
            apellido: 'Martínez',
            telefono: '+54 11 1234-5678',
            email: 'ana.martinez@email.com',
        },
    });
    const cliente2 = await prisma.cliente.create({
        data: {
            nombre: 'Pedro',
            apellido: 'López',
            telefono: '+54 11 8765-4321',
            email: 'pedro.lopez@email.com',
        },
    });
    const cliente3 = await prisma.cliente.create({
        data: {
            nombre: 'Laura',
            apellido: 'Fernández',
            telefono: '+54 11 5555-6666',
            email: 'laura.fernandez@email.com',
        },
    });
    console.log('✅ Clientes creados:', [cliente1, cliente2, cliente3]);
    console.log('📅 Creando turnos...');
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    manana.setHours(10, 0, 0, 0);
    const pasadoManana = new Date(hoy);
    pasadoManana.setDate(pasadoManana.getDate() + 2);
    pasadoManana.setHours(14, 30, 0, 0);
    const turno1 = await prisma.turno.create({
        data: {
            fecha_hora: manana,
            estado: 'confirmado',
            cliente_id: cliente1.cliente_id,
            empleado_id: empleado1.empleado_id,
            servicio_id: servicioCorte.servicio_id,
        },
    });
    const turno2 = await prisma.turno.create({
        data: {
            fecha_hora: pasadoManana,
            estado: 'pendiente',
            cliente_id: cliente2.cliente_id,
            empleado_id: empleado2.empleado_id,
            servicio_id: servicioColoracion.servicio_id,
        },
    });
    console.log('✅ Turnos creados:', [turno1, turno2]);
    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('   Admin:');
    console.log('     Usuario: admin');
    console.log('     Password: admin123');
    console.log('   Usuario:');
    console.log('     Usuario: usuario');
    console.log('     Password: user123');
}
main()
    .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map