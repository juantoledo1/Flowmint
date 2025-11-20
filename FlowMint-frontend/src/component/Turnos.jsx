import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Table, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import api from '../services/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Turnos = () => {
  const [showListarTurnosModal, setShowListarTurnosModal] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [showConfirmarEliminarModal, setShowConfirmarEliminarModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    listarTurnos();
  }, []);

  const listarTurnos = async () => {
    try {
      const response = await api.get('/turnos');
      setTurnos(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de turnos:', error);
      setError('Error al obtener la lista de turnos');
    }
  };

  const handleListarTurnosModal = () => {
    setSelectedTurno(null); // Limpiar el turno seleccionado al abrir el modal
    setShowListarTurnosModal(true);
  };

  const handleCloseListarTurnosModal = () => setShowListarTurnosModal(false);

  const handleConfirmarEliminarModal = (turno) => {
    setSelectedTurno(turno);
    setShowConfirmarEliminarModal(true);
  };

  const handleCloseConfirmarEliminarModal = () => {
    setSelectedTurno(null);
    setShowConfirmarEliminarModal(false);
  };

  const handleEliminarTurno = async () => {
    try {
      const id_turno = selectedTurno.id || selectedTurno.turno_id;
      const response = await api.delete(`/turnos/${id_turno}`);
      console.log(response.data);
      setMensaje('El turno se eliminó correctamente');
      setShowToast(true);
      setSelectedTurno(null);
      handleCloseConfirmarEliminarModal();
      listarTurnos();
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      setError('Error al eliminar turno');
    }
  };

  const events = turnos.map((turno) => {
    // En el nuevo sistema, los turnos tienen fecha_hora como campo único de tipo DateTime
    const startDate = new Date(turno.fecha_hora);

    // Calcular la duración del servicio en minutos para establecer la hora de finalización
    const duracion = turno.servicio.duracion || 60; // Si no hay duración, usar 60 minutos por defecto
    const endDate = new Date(startDate.getTime() + duracion * 60 * 1000); // Sumar duración en minutos

    // Necesitamos cargar los datos relacionados de cliente, empleado y servicio
    return {
      id: turno.turno_id,
      title: `${turno.servicio.nombre || 'Servicio'} con ${turno.empleado.nombre || 'Empleado'} ${turno.empleado.apellido || ''}`,
      start: startDate,
      end: endDate,
      details: {
        id: turno.turno_id,
        cliente: `${turno.cliente.nombre || 'Cliente'} ${turno.cliente.apellido || ''}`,
        empleado: `${turno.empleado.nombre || 'Empleado'} ${turno.empleado.apellido || ''}`,
        servicio: turno.servicio.nombre || 'Servicio',
        fecha: moment(startDate).format('YYYY-MM-DD'),
        hora: moment(startDate).format('HH:mm'),
        estado: turno.estado,
      },
    };
  });

  const DetallesTurno = ({ turno, onEliminar }) => (
    <div>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr key={turno.details.id}>
            <td>{turno.details.id}</td>
            <td>{turno.details.cliente}</td>
            <td>{turno.details.empleado}</td>
            <td>{turno.details.servicio}</td>
            <td>{turno.details.fecha}</td>
            <td>{turno.details.hora}</td>
            <td>${turno.details.precio || turno.details.servicio?.precio || 'N/A'}</td>
            <td>{turno.details.estado || 'N/A'}</td>
            <td>
              <Button variant="danger" onClick={() => onEliminar(turno)}>Eliminar</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );

  const ModalListarTurnos = ({ show, handleClose, events }) => (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Listado de Turnos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: '500px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={(event) => setSelectedTurno(event)}
          />
        </div>
        {selectedTurno ? (
          <DetallesTurno turno={selectedTurno} onEliminar={handleConfirmarEliminarModal} />
        ) : (
          <Alert variant="info">
            Seleccione un turno del calendario para ver los detalles.
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="danger" onClick={handleEliminar}>Eliminar</Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <div className="bg-dark text-light vh-100 d-flex align-items-center justify-content-center">
        <div>
          <h2 className='text-center'>Turnos</h2>
          <div className="d-grid gap-2 mb-3">
            <Button variant="info" size="lg" onClick={handleListarTurnosModal}>Ver Turnos</Button>
          </div>
        </div>
      </div>

      <ModalListarTurnos
        show={showListarTurnosModal}
        handleClose={handleCloseListarTurnosModal}
        events={events}
      />
      <ModalConfirmarEliminar
        show={showConfirmarEliminarModal}
        handleClose={handleCloseConfirmarEliminarModal}
        handleEliminar={handleEliminarTurno}
      />

      {mensaje && <Alert variant="success" onClose={() => setMensaje('')} dismissible>{mensaje}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      
      <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                className="position-fixed top-0 start-50 translate-middle-x bg-black text-light"
                style={{ zIndex: 9999 }}
                delay={5000} // Duración del toast en milisegundos
                autohide
            >
                <Toast.Header>
                    <strong className="me-auto">Notificación</strong>
                </Toast.Header>
                <Toast.Body>{mensaje}</Toast.Body>
            </Toast>


{/*  */}
    </>
  );
};

export default Turnos;
