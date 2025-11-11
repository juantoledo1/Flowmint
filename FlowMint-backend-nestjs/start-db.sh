#!/bin/bash

# Script para iniciar PostgreSQL local para FlowMint

echo "🚀 Iniciando PostgreSQL con Docker..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo. Por favor, inicia Docker Desktop."
    exit 1
fi

# Verificar si el contenedor ya existe
if docker ps -a --format '{{.Names}}' | grep -q "^flowmint-postgres$"; then
    echo "📦 Contenedor flowmint-postgres ya existe."

    # Verificar si está corriendo
    if docker ps --format '{{.Names}}' | grep -q "^flowmint-postgres$"; then
        echo "✅ PostgreSQL ya está corriendo en localhost:54322"
    else
        echo "▶️  Iniciando contenedor existente..."
        docker start flowmint-postgres
        echo "✅ PostgreSQL iniciado en localhost:54322"
    fi
else
    echo "📦 Creando nuevo contenedor PostgreSQL..."
    docker run -d \
        --name flowmint-postgres \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=postgres \
        -p 54322:5432 \
        -v flowmint-postgres-data:/var/lib/postgresql/data \
        postgres:15

    echo "⏳ Esperando a que PostgreSQL esté listo..."
    sleep 5

    echo "✅ PostgreSQL iniciado en localhost:54322"
fi

echo ""
echo "📊 Información de conexión:"
echo "   Host: localhost"
echo "   Puerto: 54322"
echo "   Usuario: postgres"
echo "   Password: postgres"
echo "   Base de datos: postgres"
echo ""
echo "🔗 Connection String:"
echo "   postgresql://postgres:postgres@localhost:54322/postgres"
echo ""
echo "💡 Para detener: docker stop flowmint-postgres"
echo "💡 Para eliminar: docker rm -f flowmint-postgres"
echo "💡 Para ver logs: docker logs -f flowmint-postgres"
