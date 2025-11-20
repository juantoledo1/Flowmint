# 🌟 FlowMint - Appointment Management System

![FlowMint Banner](https://img.shields.io/badge/FlowMint-v1.0.0-00f3ff?style=for-the-badge&logo=lightning&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

> **A modern, retro-neon themed appointment management system with AI assistance**

FlowMint is a full-stack web application designed for managing appointments, clients, employees, services, and revenue tracking. Built with cutting-edge technologies and featuring a stunning retro gaming aesthetic with neon colors.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎨 Design](#-design)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [📚 API Documentation](#-api-documentation)
- [🎯 Usage Guide](#-usage-guide)
- [🤖 AI Assistant](#-ai-assistant)
- [🔐 Authentication](#-authentication)
- [🗄️ Database](#️-database)
- [🌐 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### Core Functionality
- 📅 **Appointment Management** - Full CRUD operations for scheduling and managing appointments
- 👥 **Client Database** - Comprehensive client management with contact information
- 👨‍💼 **Employee Management** - Track and manage your team members
- ✂️ **Service Catalog** - Manage services with pricing and duration
- 💰 **Revenue Tracking** - Financial reports and analytics
- 👤 **User Management** - Multi-user system with role-based access

### Advanced Features
- 🤖 **AI Chat Assistant** - Integrated AI helper for guidance and support
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🎨 **Retro Neon UI/UX** - Stunning gaming-inspired design
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🔍 **Smart Search** - Quick filtering and search across all modules
- ⚡ **Real-time Updates** - Instant data synchronization
- 🌐 **RESTful API** - Well-documented backend API
- 📖 **Swagger Documentation** - Interactive API documentation

---

## 🎨 Design

FlowMint features a unique **retro gaming aesthetic** with neon colors inspired by classic arcade games:

### Color Palette
- **Neon Cyan** (#00f3ff) - Primary accent
- **Neon Pink** (#ff006e) - Secondary accent
- **Neon Green** (#16f2b3) - Success states
- **Neon Purple** (#8b5cf6) - Highlights
- **Neon Yellow** (#ffd60a) - Warnings
- **Dark Background** (#0a0a0f) - Main background

### Design Features
- Animated grid background
- Glowing neon borders and shadows
- Smooth transitions and hover effects
- Pixel-perfect responsive layout
- Custom scrollbars
- Loading animations
- Scanline effects (optional)

---

## 🛠️ Tech Stack

### Backend
- **NestJS** 11.x - Progressive Node.js framework
- **Prisma** 6.x - Next-generation ORM
- **PostgreSQL** 15+ - Robust relational database
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Swagger** - API documentation
- **Class Validator** - DTO validation
- **Passport** - Authentication middleware

### Frontend
- **React** 18.x - UI library
- **Vite** 5.x - Build tool
- **React Router** 6.x - Client-side routing
- **Bootstrap** 5.x - UI framework
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **React Icons** - Additional icons

### Infrastructure
- **Docker** - Containerization
- **Supabase** - PostgreSQL hosting (local/cloud)
- **Node.js** 18+ - Runtime environment

---

## 📁 Project Structure

```
FlowMint/
├── FlowMint-backend-nestjs/          # Backend NestJS application
│   ├── prisma/
│   │   ├── schema.prisma              # Database schema
│   │   ├── seed.ts                    # Seed data
│   │   └── migrations/                # Database migrations
│   ├── src/
│   │   ├── auth/                      # Authentication module
│   │   ├── clientes/                  # Clients module
│   │   ├── empleados/                 # Employees module
│   │   ├── prisma/                    # Prisma service
│   │   ├── roles/                     # Roles module
│   │   ├── servicios/                 # Services module
│   │   ├── turnos/                    # Appointments module
│   │   ├── usuarios/                  # Users module
│   │   ├── app.module.ts              # Root module
│   │   └── main.ts                    # Entry point
│   ├── .env                           # Environment variables
│   ├── package.json                   # Dependencies
│   └── start-db.sh                    # Database startup script
│
├── FlowMint-frontend/                 # Frontend React application
│   ├── src/
│   │   ├── component/                 # React components
│   │   │   ├── AIChat.jsx            # AI chat assistant
│   │   │   ├── Clientes.jsx          # Clients management
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── Empleados.jsx         # Employees management
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Servicios.jsx         # Services management
│   │   │   ├── Turnos.jsx            # Appointments management
│   │   │   └── Usuarios.jsx          # Users management
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   ├── index.css                 # Global retro theme styles
│   │   ├── App.jsx                   # Root component
│   │   └── main.jsx                  # Entry point
│   ├── package.json                   # Dependencies
│   └── vite.config.js                # Vite configuration
│
├── supabase/                          # Supabase configuration
│   └── config.toml                   # Supabase settings
│
├── docker-compose.yml                 # Docker setup
├── INICIO-RAPIDO.md                  # Quick start guide (Spanish)
├── CAMBIOS-REALIZADOS.md             # Changes log (Spanish)
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- npm or yarn

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd FlowMint
```

#### 2. Quick Start with Docker (Recommended)

The easiest way to run the application is using Docker Compose:

```bash
# Start all services (backend, frontend, postgres, adminer)
docker-compose up -d

# Seed the database after services are running
docker-compose exec backend sh -c "cd /usr/src/app && npx tsx prisma/seed.ts"

# The application will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000/api
# - Swagger Docs: http://localhost:3000/api/docs
# - Adminer (DB admin): http://localhost:8080
```

#### 3. Alternative: Manual Setup

If you prefer to run services manually:

**Backend Setup:**

```bash
# Navigate to backend
cd FlowMint-backend-nestjs

# Install dependencies
npm install

# Start PostgreSQL (Docker)
./start-db.sh

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start backend server
npm run start:dev
```

The backend will be available at:
- 🚀 API: http://localhost:3000/api
- 📖 Swagger Docs: http://localhost:3000/api/docs

**Frontend Setup**

Open a new terminal:

```bash
# Navigate to frontend
cd FlowMint-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at:
- 🎨 App: http://localhost:5173

#### 4. Login

Use the default credentials:

**Administrator:**
- Username: `admin`
- Password: `admin123`

**Regular User:**
- Username: `usuario`
- Password: `user123`

## 🛠️ Troubleshooting

### Common Issues

**Login not working after fresh installation:**
- Make sure the database is properly seeded with user data
- If login fails with credentials that should work, ensure the seed command has been run successfully

**Docker-related issues:**
- Make sure Docker has enough allocated resources (memory, disk space)
- If services fail to start, try `docker-compose down` followed by `docker-compose up --force-recreate`

---

## ⚙️ Configuration

### Backend Environment Variables

Create or edit `FlowMint-backend-nestjs/.env`:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres?schema=public"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server Port
PORT=3000

# Supabase Configuration (for local development)
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Frontend Environment Variables

Create `FlowMint-frontend/.env`:

```env
# API URL
VITE_API_URL=http://localhost:3000/api
```

---

## 📚 API Documentation

### Swagger UI

Access interactive API documentation at:
**http://localhost:3000/api/docs**

### Main Endpoints

#### Authentication
```
POST   /api/auth/login       - User login
GET    /api/auth/profile     - Get user profile (authenticated)
```

#### Clients
```
GET    /api/clientes         - List all clients
GET    /api/clientes/:id     - Get client by ID
POST   /api/clientes         - Create new client
PATCH  /api/clientes/:id     - Update client
DELETE /api/clientes/:id     - Delete client
```

#### Employees
```
GET    /api/empleados        - List all employees
GET    /api/empleados/:id    - Get employee by ID
POST   /api/empleados        - Create new employee
PATCH  /api/empleados/:id    - Update employee
DELETE /api/empleados/:id    - Delete employee
```

#### Services
```
GET    /api/servicios        - List all services
GET    /api/servicios/:id    - Get service by ID
POST   /api/servicios        - Create new service
PATCH  /api/servicios/:id    - Update service
DELETE /api/servicios/:id    - Delete service
```

#### Appointments
```
GET    /api/turnos           - List all appointments
GET    /api/turnos/:id       - Get appointment by ID
POST   /api/turnos           - Create new appointment
PATCH  /api/turnos/:id       - Update appointment
DELETE /api/turnos/:id       - Delete appointment
```

#### Users
```
GET    /api/usuarios         - List all users
GET    /api/usuarios/:id     - Get user by ID
POST   /api/usuarios         - Create new user
PATCH  /api/usuarios/:id     - Update user
DELETE /api/usuarios/:id     - Delete user
```

#### Roles
```
GET    /api/roles            - List all roles
GET    /api/roles/:id        - Get role by ID
POST   /api/roles            - Create new role
PATCH  /api/roles/:id        - Update role
DELETE /api/roles/:id        - Delete role
```

---

## 🎯 Usage Guide

### Managing Clients

1. Navigate to **Clients** section from the dashboard
2. Click **Add Client** button
3. Fill in client information:
   - First Name (required)
   - Last Name (required)
   - Email (optional)
   - Phone (optional)
4. Click **Create Client**

**Search & Filter:**
- Use the search bar to filter clients by name, email, or phone
- Click **Edit** to modify client information
- Click **Delete** to remove a client (confirmation required)

### Creating Appointments

1. Go to **Appointments** section
2. Click **New Appointment**
3. Select:
   - Client (from dropdown)
   - Employee (who will provide the service)
   - Service (what will be performed)
   - Date and Time
4. Set appointment status:
   - Pending
   - Confirmed
   - Cancelled
5. Save appointment

### Managing Services

1. Access **Services** section
2. Click **Add Service**
3. Enter service details:
   - Service name
   - Description
   - Price
   - Duration (in minutes)
4. Save service

### Revenue Reports

1. Open **Revenue** section
2. Select date range
3. View statistics:
   - Total revenue
   - Revenue by service
   - Revenue by employee
   - Number of appointments
4. Export reports (if implemented)

---

## 🤖 AI Assistant

FlowMint includes an integrated AI chat assistant to help you navigate and use the system.

### Features
- 💬 Real-time chat interface
- 🎯 Context-aware responses
- 📚 Help with all system features
- 🔍 Quick actions and suggestions
- 📝 Chat history

### How to Use

1. Click the **AI Chat** button in the dashboard
2. Type your question or select a quick action
3. Get instant help and guidance

### Example Questions
- "How do I create an appointment?"
- "Show me client management"
- "Explain revenue reports"
- "Help with services"

---

## 🔐 Authentication

### Login Process

1. Navigate to http://localhost:5173
2. Enter credentials
3. Receive JWT token
4. Token stored in localStorage
5. Auto-redirect to dashboard

### Token Management

- **Access Token:** 1 hour expiration
- **Automatic Logout:** On token expiration
- **Session Persistence:** Tokens stored securely

### Password Security

- Passwords hashed with bcrypt
- Minimum 6 characters
- Strong password recommended in production

---

## 🗄️ Database

### Schema Overview

**Tables:**
- `Usuario` - System users
- `Rol` - User roles
- `Cliente` - Clients/Customers
- `Empleado` - Employees
- `Servicio` - Services offered
- `Turno` - Appointments/Bookings

### Sample Data

The seed includes:
- 3 Roles (Admin, User, Employee)
- 2 Users (admin, usuario)
- 4 Services
- 3 Employees
- 3 Clients
- 2 Sample appointments

### Database Commands

```bash
# View database in browser
npm run prisma:studio

# Create migration
npm run prisma:migrate

# Reset database
npm run prisma:migrate:reset

# Seed data
npm run prisma:seed

# Generate Prisma client
npm run prisma:generate
```

### Prisma Studio

Access at: **http://localhost:5555**

```bash
cd FlowMint-backend-nestjs
npm run prisma:studio
```

---

## 🌐 Deployment

### Migrating to Supabase Cloud

1. **Create Supabase Project**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Create new project
   - Note your project credentials

2. **Update Backend .env**
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

3. **Deploy Migrations**
   ```bash
   npm run prisma:migrate:deploy
   npm run prisma:seed
   ```

4. **Deploy Backend**
   - Recommended: Vercel, Railway, Render, or Heroku
   - Set environment variables
   - Deploy from GitHub

5. **Deploy Frontend**
   - Update `VITE_API_URL` to production backend URL
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or similar
   - Upload `dist/` folder

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🧪 Testing

### Backend Tests

```bash
cd FlowMint-backend-nestjs

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Coverage report
npm run test:cov
```

### Frontend Tests

```bash
cd FlowMint-frontend

# Run tests (if configured)
npm run test
```

### API Testing

Use the included test script:

```bash
cd FlowMint-backend-nestjs
./test-api.sh
```

Or use Swagger UI at http://localhost:3000/api/docs

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Cannot connect to database**
```bash
# Check PostgreSQL is running
docker ps | grep flowmint-postgres

# Restart database
./start-db.sh
```

**Error: Prisma Client not generated**
```bash
npm run prisma:generate
```

**Error: Port 3000 already in use**
```bash
# Change PORT in .env or kill process
lsof -ti:3000 | xargs kill -9
```

### Frontend Issues

**Error: Cannot connect to backend**
- Verify backend is running on port 3000
- Check `VITE_API_URL` in frontend `.env`

**Blank page after login**
- Clear localStorage
- Check browser console for errors
- Verify token is being set

### Database Issues

**Reset everything**
```bash
# Stop and remove database
docker rm -f flowmint-postgres
docker volume rm flowmint-postgres-data

# Start fresh
./start-db.sh
npm run prisma:migrate
npm run prisma:seed
```

---

## 📊 Performance

### Optimization Tips

**Backend:**
- Enable database connection pooling
- Add Redis for caching
- Implement pagination for large datasets
- Use database indexes

**Frontend:**
- Lazy load components
- Implement virtual scrolling for long lists
- Optimize images
- Use React.memo for expensive components

---

## 🔒 Security

### Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secrets
   - Rotate secrets regularly

2. **API Security**
   - All routes use JWT authentication
   - Input validation on all endpoints
   - SQL injection prevention (Prisma ORM)
   - XSS protection

3. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Minimum password requirements
   - No password storage in plain text

4. **CORS Configuration**
   - Whitelist trusted origins
   - Disable in production if using same domain

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- **Backend:** Follow NestJS conventions
- **Frontend:** ESLint + Prettier configured
- **Commits:** Use conventional commits

---

## 📝 Changelog

### v1.0.0 (Current)
- ✨ Initial release
- 🎨 Retro neon gaming theme
- 🤖 AI chat assistant
- 📅 Full CRUD for all entities
- 🔐 JWT authentication
- 📖 Swagger documentation
- 🗄️ PostgreSQL with Prisma
- 📱 Fully responsive design

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

**FlowMint Team**
- Backend Development: NestJS + Prisma + PostgreSQL
- Frontend Development: React + Bootstrap + Vite
- Design: Retro Gaming Neon Theme

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [React](https://react.dev/) - Frontend library
- [Prisma](https://www.prisma.io/) - Database ORM
- [Supabase](https://supabase.com/) - PostgreSQL hosting
- [Bootstrap](https://getbootstrap.com/) - UI framework
- [Lucide](https://lucide.dev/) - Icon library

---

## 📞 Support

If you need help:

1. Check the documentation
2. Search existing issues
3. Open a new issue
4. Contact the team

---

## 🚀 Future Roadmap

- [ ] Calendar view for appointments
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Client portal
- [ ] Employee scheduling
- [ ] Inventory management
- [ ] Advanced reporting
- [ ] Export to PDF/Excel
- [ ] Webhook integrations

---

## ⭐ Star History

If you find FlowMint useful, please consider giving it a star!

---

<div align="center">

**Made with ❤️ and ⚡ by the FlowMint Team**

[⬆ Back to Top](#-flowmint---appointment-management-system)

</div>