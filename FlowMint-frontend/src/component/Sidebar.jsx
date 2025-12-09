import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Person, People, Calendar, Gear, FileEarmark } from 'react-bootstrap-icons';

const Sidebar = () => {
    const location = useLocation();

    // Function to check if the current link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <style>
                {`
                    .nav-link.active {
                        background: var(--bg-hover) !important;
                        border-left: 3px solid;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    }
                    .nav-link.active[href="/dashboard/clientes"] {
                        border-left-color: var(--neon-green) !important;
                    }
                    .nav-link.active[href="/dashboard/empleados"] {
                        border-left-color: var(--neon-purple) !important;
                    }
                    .nav-link.active[href="/dashboard/turnos"] {
                        border-left-color: var(--neon-cyan) !important;
                    }
                    .nav-link.active[href="/dashboard/servicios"] {
                        border-left-color: var(--neon-pink) !important;
                    }
                    .nav-link.active[href="/dashboard/usuarios"] {
                        border-left-color: var(--neon-green) !important;
                    }
                    .nav-link.active[href="/dashboard/ganancias"] {
                        border-left-color: var(--neon-cyan) !important;
                    }
                    .nav-link:hover {
                        background: var(--bg-hover) !important;
                        color: var(--neon-cyan) !important;
                    }
                `}
            </style>
            <div className='container-fluid row'>
                <div className="vh-100 bg-dark text-light p-3 position-fixed col-2" style={{ marginTop: '60px' }}>
                    <h4 className="d-none d-md-block m-2"></h4>
                    <Nav className="flex-column">
                    <Nav.Link
                        as={Link}
                        to="/dashboard/clientes"
                        className={`d-flex align-items-center ${isActive('/dashboard/clientes') ? 'active text-neon-green' : 'text-light'}`}
                    >
                        <Person className="me-2" /><span className="d-none d-md-block">Clientes</span>
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/dashboard/empleados"
                        className={`d-flex align-items-center ${isActive('/dashboard/empleados') ? 'active text-neon-purple' : 'text-light'}`}
                    >
                        <People className="me-2" /><span className="d-none d-md-block">Empleados</span>
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/dashboard/turnos"
                        className={`d-flex align-items-center ${isActive('/dashboard/turnos') ? 'active text-neon-cyan' : 'text-light'}`}
                    >
                        <Calendar className="me-2" /><span className="d-none d-md-block">Turnos</span>
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/dashboard/servicios"
                        className={`d-flex align-items-center ${isActive('/dashboard/servicios') ? 'active text-neon-pink' : 'text-light'}`}
                    >
                        <Gear className="me-2" /><span className="d-none d-md-block">Servicios</span>
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/dashboard/usuarios"
                        className={`d-flex align-items-center ${isActive('/dashboard/usuarios') ? 'active text-neon-green' : 'text-light'}`}
                    >
                        <Person className="me-2" /><span className="d-none d-md-block">Usuarios</span>
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/dashboard/ganancias"
                        className={`d-flex align-items-center ${isActive('/dashboard/ganancias') ? 'active text-neon-cyan' : 'text-light'}`}
                    >
                        <FileEarmark className="me-2" /><span className="d-none d-md-block">Ganancias</span>
                    </Nav.Link>
                    </Nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
