import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Alert, Toast } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import api from '../services/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configurar localización en español
moment.locale('es-ES');
const localizer = momentLocalizer(moment);

// Estilos para el calendario
const customStyles = `
  .rbc-calendar {
    background-color: #1a1a1a;
    color: #fff;
  }

  .rbc-header {
    background-color: #2a2a2a;
    color: #00ffff;
    border: 1px solid #444;
    padding: 8px;
    font-weight: bold;
  }

  .rbc-day-bg {
    border: 1px solid #333;
  }

  .rbc-month-view {
    border: 1px solid #444;
  }

  .rbc-month-row {
    border-bottom: 1px solid #444;
  }

  .rbc-date-cell {
    padding: 5px;
  }

  .rbc-date-cell a {
    color: #fff;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .rbc-date-cell a:hover {
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
  }

  .rbc-off-range-bg {
    background-color: #222;
  }

  .rbc-today {
    background-color: rgba(0, 255, 255, 0.1) !important;
  }

  .rbc-event {
    background-color: #0d6efd;
    border: none;
    border-radius: 4px;
    padding: 4px;
    font-size: 12px;
    transition: all 0.3s ease;
  }

  .rbc-event:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  .rbc-time-content {
    border: 1px solid #444;
  }

  .rbc-time-header {
    border-bottom: 2px solid #00ffff;
  }

  .rbc-time-header-content {
    border-left: 1px solid #444;
  }

  .rbc-time-slot {
    border-top: 1px solid #333;
  }

  .rbc-timeslot-group {
    min-height: 60px;
  }

  .rbc-toolbar {
    color: #00ffff;
    margin-bottom: 20px;
  }

  .rbc-toolbar button {
    background-color: #0d6efd;
    border: 1px solid #00ffff;
    color: white;
    padding: 5px 15px;
    margin: 0 5px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .rbc-toolbar button:hover {
    background-color: #00ffff;
    color: #000;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
    background-color: #00ffff;
    color: #000;
    border-color: #00ffff;
  }

  .rbc-toolbar-label {
    font-size: 1.5rem;
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
  }

  .rbc-event-label {
    font-size: 0.8rem;
  }

  .rbc-time-view-resources .rbc-time-gutter,
  .rbc-time-view-resources .rbc-time-header-gutter {
    border-right: 1px solid #444;
  }
`;

const Turnos = ({ visible = true }) => {
  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [showCrearTurnoModal, setShowCrearTurnoModal] = useState(false);
  const [showEditarTurnoModal, setShowEditarTurnoModal] = useState(false);
  const [showConfirmarEliminarModal, setShowConfirmarEliminarModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [currentView, setCurrentView] = useState('month'); // Estado para controlar la vista actual

  // Estado para el nuevo turno
  const [nuevoTurno, setNuevoTurno] = useState({
    cliente_id: '',
    empleado_id: '',
    servicio_id: '',
    fecha_hora: '',
    estado: 'pendiente'
  });

  // Estado para el turno a editar
  const [turnoEditando, setTurnoEditando] = useState({
    turno_id: '',
    cliente_id: '',
    empleado_id: '',
    servicio_id: '',
    fecha_hora: '',
    estado: 'pendiente'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [turnosResponse, clientesResponse, empleadosResponse, serviciosResponse] = await Promise.all([
        api.get('/turnos'),
        api.get('/clientes'),
        api.get('/empleados'),
        api.get('/servicios')
      ]);

      setTurnos(turnosResponse.data);
      setClientes(clientesResponse.data);
      setEmpleados(empleadosResponse.data);
      setServicios(serviciosResponse.data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      setError('Error al cargar los datos');
    }
  };

  const [cargando, setCargando] = useState(false); // Estado para mostrar indicador de carga

  const handleCrearTurno = async () => {
    try {
      setCargando(true);
      setError(''); // Limpiar errores anteriores

      // Validar que todos los campos estén completos
      if (!nuevoTurno.cliente_id || !nuevoTurno.empleado_id || !nuevoTurno.servicio_id || !nuevoTurno.fecha_hora) {
        setError('Por favor complete todos los campos');
        return;
      }

      // Verificar solapamiento de turnos
      const servicio = servicios.find(s => s.servicio_id == nuevoTurno.servicio_id);
      const duracion = servicio?.duracion || 60; // minutos

      const fechaHoraInicio = new Date(nuevoTurno.fecha_hora);
      const fechaHoraFin = new Date(fechaHoraInicio.getTime() + duracion * 60000); // Convertir minutos a milisegundos

      // Verificar si hay solapamiento con algún turno existente para el mismo empleado
      const haySolapamiento = turnos.some(t => {
        const turnoInicio = new Date(t.fecha_hora);
        const turnoFin = new Date(new Date(t.fecha_hora).getTime() + (t.servicio?.duracion || 60) * 60000);

        return (
          t.empleado_id == nuevoTurno.empleado_id &&
          fechaHoraInicio < turnoFin &&
          fechaHoraFin > turnoInicio
        );
      });

      if (haySolapamiento) {
        setError('El empleado ya tiene un turno en este horario. Por favor, elija otro horario o empleado.');
        return;
      }

      await api.post('/turnos', nuevoTurno);
      setMensaje('Turno creado exitosamente');
      setShowToast(true);
      setShowCrearTurnoModal(false);
      setNuevoTurno({
        cliente_id: '',
        empleado_id: '',
        servicio_id: '',
        fecha_hora: '',
        estado: 'pendiente'
      });
      cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error al crear turno:', error);
      if (error.response?.status === 409) {
        setError('El empleado ya tiene un turno en este horario. Por favor, elija otro horario o empleado.');
      } else if (error.response?.status === 400) {
        setError('Datos inválidos. Por favor verifique la información ingresada.');
      } else {
        setError('Error al crear turno. Por favor intente nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarTurno = async () => {
    try {
      setCargando(true);
      setError(''); // Limpiar errores anteriores

      // Obtener el servicio para determinar la duración
      const servicio = servicios.find(s => s.servicio_id == turnoEditando.servicio_id);
      const duracion = servicio?.duracion || 60; // minutos

      const fechaHoraInicio = new Date(turnoEditando.fecha_hora);
      const fechaHoraFin = new Date(fechaHoraInicio.getTime() + duracion * 60000); // Convertir minutos a milisegundos

      // Verificar si hay solapamiento con otros turnos (excluyendo el turno actual que se está editando)
      const haySolapamiento = turnos.some(t => {
        if (t.turno_id == turnoEditando.turno_id) return false; // No comparar con el mismo turno que se está editando

        const turnoInicio = new Date(t.fecha_hora);
        const turnoFin = new Date(new Date(t.fecha_hora).getTime() + (t.servicio?.duracion || 60) * 60000);

        return (
          t.empleado_id == turnoEditando.empleado_id &&
          fechaHoraInicio < turnoFin &&
          fechaHoraFin > turnoInicio
        );
      });

      if (haySolapamiento) {
        setError('El empleado ya tiene un turno en este horario. Por favor, elija otro horario o empleado.');
        return;
      }

      await api.patch(`/turnos/${turnoEditando.turno_id}`, {
        cliente_id: turnoEditando.cliente_id,
        empleado_id: turnoEditando.empleado_id,
        servicio_id: turnoEditando.servicio_id,
        fecha_hora: turnoEditando.fecha_hora,
        estado: turnoEditando.estado
      });

      setMensaje('Turno actualizado exitosamente');
      setShowToast(true);
      setShowEditarTurnoModal(false);
      cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      if (error.response?.status === 409) {
        setError('El empleado ya tiene un turno en este horario. Por favor, elija otro horario o empleado.');
      } else if (error.response?.status === 400) {
        setError('Datos inválidos. Por favor verifique la información ingresada.');
      } else {
        setError('Error al actualizar turno. Por favor intente nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarTurno = async () => {
    try {
      setCargando(true);
      setError(''); // Limpiar errores anteriores

      await api.delete(`/turnos/${selectedTurno.turno_id}`);
      setMensaje('Turno eliminado exitosamente');
      setShowToast(true);
      setSelectedTurno(null);
      setShowConfirmarEliminarModal(false);
      cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      setError('Error al eliminar turno. Por favor intente nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const handleSeleccionarTurno = (turno) => {
    setSelectedTurno(turno);
    setTurnoEditando({
      turno_id: turno.turno_id,
      cliente_id: turno.cliente_id,
      empleado_id: turno.empleado_id,
      servicio_id: turno.servicio_id,
      fecha_hora: turno.fecha_hora,
      estado: turno.estado
    });
    setShowEditarTurnoModal(true);
  };

  const handleSlotClick = (slotInfo) => {
    const inicio = moment(slotInfo.start).format('YYYY-MM-DDTHH:mm');

    setNuevoTurno({
      ...nuevoTurno,
      fecha_hora: inicio
    });

    setShowCrearTurnoModal(true);
  };

  const handleDateSelect = (slotInfo) => {
    // Cambiar a la vista diaria cuando se selecciona un día
    setCurrentView('day');
    // Si se selecciona un rango, usar el inicio
    const startDate = moment(slotInfo.start).format('YYYY-MM-DDTHH:mm');

    // Establecer la fecha en el nuevo turno
    setNuevoTurno({
      ...nuevoTurno,
      fecha_hora: startDate
    });
  };

  // Mapear turnos a eventos para el calendario
  const events = turnos.map((turno) => {
    const startDate = new Date(turno.fecha_hora);
    const duracion = turno.servicio?.duracion || 60; // minutos
    const endDate = new Date(startDate.getTime() + duracion * 60000); // Convertir minutos a milisegundos

    return {
      id: turno.turno_id,
      title: `${turno.servicio?.nombre || 'Servicio'} con ${turno.cliente?.nombre || 'Cliente'} ${turno.cliente?.apellido || ''}`,
      start: startDate,
      end: endDate,
      turno_data: turno
    };
  });

  const ModalCrearTurno = ({ show, handleClose }) => (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Turno</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Select
                  value={nuevoTurno.cliente_id}
                  onChange={(e) => setNuevoTurno({...nuevoTurno, cliente_id: e.target.value})}
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.cliente_id} value={cliente.cliente_id}>
                      {cliente.nombre} {cliente.apellido}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Empleado</Form.Label>
                <Form.Select
                  value={nuevoTurno.empleado_id}
                  onChange={(e) => setNuevoTurno({...nuevoTurno, empleado_id: e.target.value})}
                >
                  <option value="">Seleccione un empleado</option>
                  {empleados.map(empleado => (
                    <option key={empleado.empleado_id} value={empleado.empleado_id}>
                      {empleado.nombre} {empleado.apellido} ({empleado.puesto})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Servicio</Form.Label>
                <Form.Select
                  value={nuevoTurno.servicio_id}
                  onChange={(e) => setNuevoTurno({...nuevoTurno, servicio_id: e.target.value})}
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map(servicio => (
                    <option key={servicio.servicio_id} value={servicio.servicio_id}>
                      {servicio.nombre} - ${servicio.precio} ({servicio.duracion} min)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha y Hora</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={nuevoTurno.fecha_hora}
                  onChange={(e) => setNuevoTurno({...nuevoTurno, fecha_hora: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={nuevoTurno.estado}
                  onChange={(e) => setNuevoTurno({...nuevoTurno, estado: e.target.value})}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="cancelado">Cancelado</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={cargando}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleCrearTurno}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {' '}Cargando...
            </>
          ) : 'Crear Turno'}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const ModalEditarTurno = ({ show, handleClose }) => (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Turno</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Select
                  value={turnoEditando.cliente_id}
                  onChange={(e) => setTurnoEditando({...turnoEditando, cliente_id: e.target.value})}
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.cliente_id} value={cliente.cliente_id}>
                      {cliente.nombre} {cliente.apellido}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Empleado</Form.Label>
                <Form.Select
                  value={turnoEditando.empleado_id}
                  onChange={(e) => setTurnoEditando({...turnoEditando, empleado_id: e.target.value})}
                >
                  <option value="">Seleccione un empleado</option>
                  {empleados.map(empleado => (
                    <option key={empleado.empleado_id} value={empleado.empleado_id}>
                      {empleado.nombre} {empleado.apellido} ({empleado.puesto})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Servicio</Form.Label>
                <Form.Select
                  value={turnoEditando.servicio_id}
                  onChange={(e) => setTurnoEditando({...turnoEditando, servicio_id: e.target.value})}
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map(servicio => (
                    <option key={servicio.servicio_id} value={servicio.servicio_id}>
                      {servicio.nombre} - ${servicio.precio} ({servicio.duracion} min)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha y Hora</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={turnoEditando.fecha_hora ? turnoEditando.fecha_hora.split('.')[0].substring(0, 16) : ''}
                  onChange={(e) => setTurnoEditando({...turnoEditando, fecha_hora: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={turnoEditando.estado}
                  onChange={(e) => setTurnoEditando({...turnoEditando, estado: e.target.value})}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="cancelado">Cancelado</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={cargando}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleActualizarTurno}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {' '}Cargando...
            </>
          ) : 'Actualizar Turno'}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const ModalConfirmarEliminar = ({ show, handleClose, handleEliminar }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de eliminar este turno?</p>
        {selectedTurno && (
          <p>
            <strong>Cliente:</strong> {selectedTurno.cliente?.nombre} {selectedTurno.cliente?.apellido}<br />
            <strong>Servicio:</strong> {selectedTurno.servicio?.nombre}<br />
            <strong>Fecha y Hora:</strong> {new Date(selectedTurno.fecha_hora).toLocaleString()}<br />
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={cargando}
        >
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {' '}Cargando...
            </>
          ) : 'Eliminar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (!visible) return null;

  return (
    <>
      <style>{customStyles}</style>
      <Container fluid className="px-4 py-4">
        <h2 className="text-cyan mb-4 text-center">Calendario de Turnos</h2>

        <Row>
          <Col xs={12}>
            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={handleSeleccionarTurno}
                onSelectSlot={currentView === 'day' ? handleSlotClick : handleDateSelect}
                selectable
                defaultView="month"
                view={currentView}
                onView={setCurrentView}
                views={['month', 'week', 'day']}
                messages={{
                  date: "Fecha",
                  time: "Hora",
                  event: "Evento",
                  allDay: "Todo el día",
                  week: "Semana",
                  work_week: "Semana laboral",
                  day: "Día",
                  month: "Mes",
                  previous: "Anterior",
                  next: "Siguiente",
                  today: "Hoy",
                  agenda: "Agenda"
                }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.turno_data.estado === 'confirmado' ? '#28a745' :
                                    event.turno_data.estado === 'cancelado' ? '#dc3545' : '#ffc107',
                    borderRadius: '5px',
                    border: 'none',
                    color: 'white',
                    margin: '1px',
                    padding: '2px',
                    fontSize: '0.8rem'
                  }
                })}
              />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modales */}
      <ModalCrearTurno
        show={showCrearTurnoModal}
        handleClose={() => setShowCrearTurnoModal(false)}
      />
      <ModalEditarTurno
        show={showEditarTurnoModal}
        handleClose={() => setShowEditarTurnoModal(false)}
      />
      <ModalConfirmarEliminar
        show={showConfirmarEliminarModal}
        handleClose={() => setShowConfirmarEliminarModal(false)}
        handleEliminar={handleEliminarTurno}
      />

      {/* Mensajes de alerta */}
      {mensaje && <Alert variant="success" onClose={() => setMensaje('')} dismissible>{mensaje}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {/* Toast de notificaciones */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        className="position-fixed top-0 start-50 translate-middle-x bg-black text-light"
        style={{ zIndex: 9999 }}
        delay={5000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Notificación</strong>
        </Toast.Header>
        <Toast.Body>{mensaje}</Toast.Body>
      </Toast>
    </>
  );
};

export default Turnos;
