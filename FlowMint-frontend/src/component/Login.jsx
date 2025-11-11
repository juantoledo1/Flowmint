import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { login, googleLogin } from '../servicios/servicios';

const Login = () => {
    const [credentials, setCredentials] = useState({ user: '', pass: '' });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const toggleShowPassword = () => setShowPassword(!showPassword);

    useEffect(() => {
        // Verificar si ya está logueado
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            navigate('/dashboard');
        }

        // Limpiar campos de login al cargar el componente
        setCredentials({ user: '', pass: '' });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(credentials);
            if (response.status) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('isLoggedIn', 'true');
                // Limpiar campos después de login exitoso
                setCredentials({ user: '', pass: '' });
                navigate('/dashboard');
            } else {
                setError(response.mensaje);
                // Limpiar los campos si el login falla
                setCredentials({ user: '', pass: '' });
            }
        } catch (error) {
            setError('Ocurrió un error al intentar iniciar sesión.');
            // Limpiar los campos si hay un error
            setCredentials({ user: '', pass: '' });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // En una implementación real, usarías la biblioteca de Google Sign-In
            // Por ahora, solo mostraremos un mensaje para ilustrar la funcionalidad
            alert('Funcionalidad de Google Sign-In aún no implementada completamente. Se requiere la biblioteca de Google y configuración de credenciales.');
            
            // En una implementación completa sería algo como:
            /*
            const googleUser = await google.accounts.id.revoke('user_id', (response) => {
                console.log('User revoked access', response);
            });
            */
        } catch (error) {
            setError('Ocurrió un error al intentar iniciar sesión con Google.');
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center align-items-center">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <h2 className="text-center">Iniciar sesión en FlowMint</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de usuario</Form.Label>
                            <Form.Control
                                type="text"
                                id="user"
                                name="user"
                                value={credentials.user}
                                onChange={handleChange}
                                placeholder="Ingrese su usuario"
                                required
                                autoComplete="off"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    id="pass"
                                    name="pass"
                                    value={credentials.pass}
                                    onChange={handleChange}
                                    placeholder="Ingrese su contraseña"
                                    required
                                    autoComplete="off"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={toggleShowPassword}
                                >
                                    {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mb-3">
                            Iniciar sesión
                        </Button>
                        
                        <Button 
                            variant="outline-danger" 
                            className="w-100 mb-3" 
                            onClick={handleGoogleLogin}
                        >
                            <i className="bi bi-google"></i> Iniciar sesión con Google
                        </Button>
                    </Form>
                    <p className="mt-3 text-center">
                        ¿No tienes una cuenta? <Link to="/registros">Regístrate</Link>
                    </p>
                    <p className="text-center">
                        ¿Olvidaste tu contraseña? <Link to="/recuperar-contraseña">Recupérala aquí</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;