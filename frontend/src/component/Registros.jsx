import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Asegúrate de estar utilizando React Router

const Registros = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:4000/crear_usuario', {
        nombre,
        apellido,
        dni,
        user,
        pass,
        correo,
      });
      setSuccess(response.data.mensaje);
    } catch (error) {
      console.error('Error registrando el usuario:', error);
      setError('Error registrando el usuario');
    }
  };

  const handleLoginRedirect = () => {
    // Limpiar cualquier dato de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    navigate('/login'); // Redirigir al login
  };

  return (
    <Container className="mt-5">
      <div className="bg-dark text-light p-4 rounded">
        <h2 className="text-center">Registro de Usuario</h2>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su nombre de usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <Button
                  variant="outline-secondary"
                  onClick={toggleShowPassword}
              >
                  {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Registrarse
            </Button>
            <Button variant="secondary" onClick={handleLoginRedirect}>
              Ir al login
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Registros;
