import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaUserFriends, FaCalendarAlt, FaCut, FaUserTie, FaDollarSign } from 'react-icons/fa';
import api from '../services/api';

function DashboardHome() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    turnosHoy: 0,
    totalServicios: 0,
    totalEmpleados: 0,
    ingresosMensuales: 0,
    proximosTurnos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Obtener clientes
        const clientesResponse = await api.get('/clientes');
        const totalClientes = clientesResponse.data.length;

        // Obtener turnos
        const turnosResponse = await api.get('/turnos');
        const turnosHoy = turnosResponse.data.filter(turno => {
          const fechaTurno = new Date(turno.fecha_hora);
          const hoy = new Date();
          return (
            fechaTurno.getDate() === hoy.getDate() &&
            fechaTurno.getMonth() === hoy.getMonth() &&
            fechaTurno.getFullYear() === hoy.getFullYear()
          );
        }).length;

        // Obtener servicios
        const serviciosResponse = await api.get('/servicios');
        const totalServicios = serviciosResponse.data.length;

        // Obtener empleados
        const empleadosResponse = await api.get('/empleados');
        const totalEmpleados = empleadosResponse.data.length;

        // Obtener próximos turnos (los próximos 3 ordenados por fecha)
        const proximosTurnos = turnosResponse.data
          .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
          .slice(0, 3)
          .map(turno => {
            const fecha = new Date(turno.fecha_hora);
            return {
              ...turno,
              fechaFormateada: fecha.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })
            };
          });

        // Calcular ingresos mensuales (corregido para usar precios reales)
        const servicios = serviciosResponse.data;
        const ingresosMensuales = turnosResponse.data
          .filter(turno => {
            const fechaTurno = new Date(turno.fecha_hora);
            const mesActual = new Date().getMonth();
            const anioActual = new Date().getFullYear();
            // No contar turnos cancelados para los ingresos
            return fechaTurno.getMonth() === mesActual && fechaTurno.getFullYear() === anioActual && turno.estado !== 'cancelado';
          })
          .reduce((total, turno) => {
            // Encontrar el servicio correspondiente al turno para obtener el precio real
            const servicio = servicios.find(s => s.servicio_id === turno.servicio_id);
            const precio = servicio ? servicio.precio : 0;
            return total + precio;
          }, 0);

        setStats({
          totalClientes,
          turnosHoy,
          totalServicios,
          totalEmpleados,
          ingresosMensuales,
          proximosTurnos
        });
      } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Container fluid className="px-4 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="cyan" />
      </Container>
    );
  }

  return (
    <Container fluid className="px-4">
      <h2 className="mb-4 text-neon-purple">Panel de Control</h2>

      <Row>
        {/* Total Clientes */}
        <Col md={3} className="mb-4">
          <Card className="bg-dark text-white border-cyan card-glow">
            <Card.Body>
              <Card.Title className="text-cyan">
                <FaUserFriends className="me-2" />
                Clientes
              </Card.Title>
              <Card.Text className="text-orange display-4">{stats.totalClientes}</Card.Text>
              <Card.Text className="text-green">+{Math.floor(stats.totalClientes * 0.1)} este mes</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Turnos Hoy */}
        <Col md={3} className="mb-4">
          <Card className="bg-dark text-white border-pink card-glow">
            <Card.Body>
              <Card.Title className="text-pink">
                <FaCalendarAlt className="me-2" />
                Turnos Hoy
              </Card.Title>
              <Card.Text className="text-orange display-4">{stats.turnosHoy}</Card.Text>
              <Card.Text className="text-green">+0 pendientes</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Servicios */}
        <Col md={3} className="mb-4">
          <Card className="bg-dark text-white border-purple card-glow">
            <Card.Body>
              <Card.Title className="text-purple">
                <FaCut className="me-2" />
                Servicios
              </Card.Title>
              <Card.Text className="text-orange display-4">{stats.totalServicios}</Card.Text>
              <Card.Text className="text-green">+0 activos</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Empleados */}
        <Col md={3} className="mb-4">
          <Card className="bg-dark text-white border-yellow card-glow">
            <Card.Body>
              <Card.Title className="text-yellow">
                <FaUserTie className="me-2" />
                Empleados
              </Card.Title>
              <Card.Text className="text-orange display-4">{stats.totalEmpleados}</Card.Text>
              <Card.Text className="text-green">+0 este mes</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Resumen de Ingresos */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-white border-green card-glow">
            <Card.Body>
              <Card.Title className="text-green">
                <FaDollarSign className="me-2" />
                Ingresos Mensuales
              </Card.Title>
              <Card.Text className="text-orange display-4">${stats.ingresosMensuales?.toLocaleString() || '0'}</Card.Text>
              <Card.Text className="text-green">+12.5% respecto al mes anterior</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Próximos turnos */}
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-white border-cyan card-glow">
            <Card.Body>
              <Card.Title className="text-cyan">Próximos Turnos</Card.Title>
              <Card.Text as="div">
                <div className="text-white">
                  {stats.proximosTurnos.length > 0 ? (
                    stats.proximosTurnos.map((turno, index) => (
                      <div key={turno.turno_id} className={index > 0 ? 'mt-2' : ''}>
                        {turno.fechaFormateada} - Cliente {turno.cliente_id} - Servicio {turno.servicio_id}
                      </div>
                    ))
                  ) : (
                    <div>No hay turnos próximos</div>
                  )}
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bienvenida */}
      <Row>
        <Col>
          <Card className="bg-dark text-white border-pink card-glow">
            <Card.Body>
              <Card.Title className="text-pink">Bienvenido a FlowMint</Card.Title>
              <Card.Text className="text-white">
                Sistema profesional de gestión de citas y negocios con interfaz retro-neon.
                Desde aquí puedes gestionar clientes, turnos, empleados y servicios de tu negocio.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardHome;