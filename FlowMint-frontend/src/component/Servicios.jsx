import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { servicesAPI } from "../services/api";
import {
  Scissors,
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Clock,
} from "lucide-react";

const Servicios = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesAPI.getAll();
      setServices(data);
      setError("");
    } catch (err) {
      setError("Failed to load services. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        nombre: service.nombre,
        descripcion: service.descripcion || "",
        precio: service.precio.toString(),
        duracion: service.duracion.toString(),
      });
    } else {
      setEditingService(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        duracion: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      duracion: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (parseFloat(formData.precio) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (parseInt(formData.duracion) <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    try {
      const serviceData = {
        ...formData,
        precio: parseFloat(formData.precio),
        duracion: parseInt(formData.duracion),
      };

      if (editingService) {
        await servicesAPI.update(editingService.servicio_id, serviceData);
        setSuccess("Service updated successfully!");
      } else {
        await servicesAPI.create(serviceData);
        setSuccess("Service created successfully!");
      }
      handleCloseModal();
      loadServices();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save service. Please try again.",
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await servicesAPI.delete(id);
        setSuccess("Service deleted successfully!");
        loadServices();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Failed to delete service. Please try again.");
      }
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.descripcion &&
        service.descripcion.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3 mb-3">
            <Scissors size={36} style={{ color: "var(--neon-pink)" }} />
            <div>
              <h2 style={{ color: "var(--neon-pink)", marginBottom: "0" }}>
                SERVICES
              </h2>
              <small style={{ color: "var(--text-muted)" }}>
                Manage your service catalog
              </small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Alerts */}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
          className="alert-error"
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccess("")}
          className="alert-success"
        >
          {success}
        </Alert>
      )}

      {/* Actions Bar */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-color)",
                color: "var(--neon-cyan)",
              }}
            >
              <Search size={20} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search services by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="text-end">
          <Button
            variant="success"
            onClick={() => handleShowModal()}
            className="btn-success"
            style={{ textTransform: "uppercase", fontWeight: "bold" }}
          >
            <Plus size={20} className="me-2" />
            Add Service
          </Button>
        </Col>
      </Row>

      {/* Services Table */}
      <Row>
        <Col>
          <div className="card">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner mx-auto mb-3"></div>
                <p style={{ color: "var(--text-muted)" }}>
                  Loading services...
                </p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center p-5">
                <Scissors
                  size={64}
                  style={{ color: "var(--text-muted)", opacity: 0.3 }}
                  className="mb-3"
                />
                <h4 style={{ color: "var(--text-muted)" }}>
                  No services found
                </h4>
                <p style={{ color: "var(--text-muted)" }}>
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Start by adding your first service"}
                </p>
                {!searchTerm && (
                  <Button
                    variant="primary"
                    onClick={() => handleShowModal()}
                    className="mt-3"
                  >
                    <Plus size={20} className="me-2" />
                    Add First Service
                  </Button>
                )}
              </div>
            ) : (
              <Table
                responsive
                hover
                style={{ marginBottom: 0 }}
                className="table-dark"
              >
                <thead>
                  <tr>
                    <th style={{ color: "var(--neon-cyan)" }}>ID</th>
                    <th style={{ color: "var(--neon-cyan)" }}>SERVICE</th>
                    <th style={{ color: "var(--neon-cyan)" }}>PRICE</th>
                    <th style={{ color: "var(--neon-cyan)" }}>DURATION</th>
                    <th
                      style={{ color: "var(--neon-cyan)" }}
                      className="text-center"
                    >
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.servicio_id}>
                      <td>
                        <Badge bg="secondary" className="badge-primary">
                          #{service.servicio_id}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <strong style={{ color: "var(--text-primary)" }}>
                            {service.nombre}
                          </strong>
                          {service.descripcion && (
                            <div>
                              <small
                                style={{
                                  color: "var(--text-muted)",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {service.descripcion}
                              </small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <DollarSign
                            size={16}
                            style={{ color: "var(--neon-green)" }}
                          />
                          <span
                            style={{
                              color: "var(--neon-green)",
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                            }}
                          >
                            ${service.precio.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Clock
                            size={16}
                            style={{ color: "var(--neon-cyan)" }}
                          />
                          <span style={{ color: "var(--text-secondary)" }}>
                            {service.duracion} min
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleShowModal(service)}
                          className="me-2"
                          style={{
                            borderColor: "var(--neon-yellow)",
                            color: "var(--neon-yellow)",
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(service.servicio_id)}
                          style={{
                            borderColor: "var(--neon-pink)",
                            color: "var(--neon-pink)",
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>

          {/* Stats */}
          <div className="mt-3 text-center">
            <small style={{ color: "var(--text-muted)" }}>
              Showing {filteredServices.length} of {services.length} services
            </small>
          </div>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        contentClassName="modal-content"
      >
        <Modal.Header
          closeButton
          style={{
            background: "var(--bg-card)",
            borderBottom: "2px solid var(--border-color)",
          }}
        >
          <Modal.Title style={{ color: "var(--neon-pink)" }}>
            {editingService ? "EDIT SERVICE" : "NEW SERVICE"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "var(--bg-card)" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Service Name *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="e.g. Haircut, Massage, Consultation..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe the service (optional)"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <DollarSign size={16} className="me-2" />
                    Price *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text
                      style={{
                        background: "var(--bg-card)",
                        borderColor: "var(--border-color)",
                        color: "var(--neon-green)",
                      }}
                    >
                      $
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0.01"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <Clock size={16} className="me-2" />
                    Duration *
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      min="1"
                      name="duracion"
                      value={formData.duracion}
                      onChange={handleChange}
                      required
                      placeholder="30"
                    />
                    <InputGroup.Text
                      style={{
                        background: "var(--bg-card)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      min
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Text style={{ color: "var(--text-muted)" }}>
                    Service duration in minutes
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                style={{
                  borderColor: "var(--text-muted)",
                  color: "var(--text-muted)",
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="success" className="btn-success">
                {editingService ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Servicios;
