import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Form,
  Button,
  InputGroup,
  Badge,
  ListGroup,
} from "react-bootstrap";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  X,
  Sparkles,
  Trash2,
} from "lucide-react";

const AIChat = ({ show, onHide }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy el Asistente AI de FlowMint. Puedo ayudarte con:\n\n• Gestionar turnos\n• Información de clientes\n• Horarios de empleados\n• Detalles de servicios\n• Reportes de ganancias\n\n¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI responses (you can replace this with actual API calls)
  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Predefined responses based on keywords
    if (
      lowerMessage.includes("appointment") ||
      lowerMessage.includes("turno") ||
      lowerMessage.includes("booking") ||
      lowerMessage.includes("cita") ||
      lowerMessage.includes("reserva")
    ) {
      return "Para gestionar turnos, ve a la sección de Turnos. Puedes:\n\n• Ver todos los turnos programados\n• Crear nuevos turnos\n• Actualizar reservas existentes\n• Cancelar o reprogramar turnos\n\n¿Te gustaría ayuda con algo específico?";
    } else if (
      lowerMessage.includes("client") ||
      lowerMessage.includes("cliente") ||
      lowerMessage.includes("customer") ||
      lowerMessage.includes("cliente")
    ) {
      return "En la sección de Clientes, puedes:\n\n• Ver todos los clientes registrados\n• Agregar nuevos clientes con su información de contacto\n• Actualizar detalles del cliente\n• Buscar clientes por nombre, email o teléfono\n\n¿Hay alguna operación específica de cliente que necesites ayuda?";
    } else if (
      lowerMessage.includes("employee") ||
      lowerMessage.includes("empleado") ||
      lowerMessage.includes("staff") ||
      lowerMessage.includes("trabajador")
    ) {
      return "La sección de Empleados te permite:\n\n• Gestionar a tus miembros del equipo\n• Agregar nuevos empleados\n• Actualizar la información del empleado\n• Asignar roles y posiciones\n\n¿Qué te gustaría saber sobre la gestión de empleados?";
    } else if (
      lowerMessage.includes("service") ||
      lowerMessage.includes("servicio")
    ) {
      return "En la sección de Servicios, puedes:\n\n• Ver todos los servicios disponibles\n• Agregar nuevos servicios con precios y duración\n• Actualizar detalles del servicio\n• Eliminar servicios que ya no se ofrecen\n\n¿Necesitas ayuda para gestionar tus servicios?";
    } else if (
      lowerMessage.includes("revenue") ||
      lowerMessage.includes("ganancia") ||
      lowerMessage.includes("money") ||
      lowerMessage.includes("profit") ||
      lowerMessage.includes("ingresos") ||
      lowerMessage.includes("facturación")
    ) {
      return "La sección de Ganancias proporciona:\n\n• Resumen financiero y estadísticas\n• Cálculos de ganancias totales\n• Desglose de ingresos por servicio\n• Filtrado por rango de fechas\n\n¿Te gustaría saber más sobre el seguimiento de ganancias?";
    } else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("ayuda") ||
      lowerMessage.includes("?")
    ) {
      return "¡Estoy aquí para ayudarte! Aquí están las características principales:\n\n📅 **Turnos** - Programar y gestionar reservas\n👥 **Clientes** - Gestionar base de datos de clientes\n👨‍💼 **Empleados** - Gestión de equipo\n✂️ **Servicios** - Catálogo de servicios\n💰 **Ganancias** - Reportes financieros\n👤 **Usuarios** - Gestión de usuarios del sistema\n\n¿Qué te gustaría explorar?";
    } else if (
      lowerMessage.includes("how") ||
      lowerMessage.includes("cómo") ||
      lowerMessage.includes("como")
    ) {
      return "Puedo guiarte a través de:\n\n1. **Crear turnos** - Selecciona un cliente, elige un servicio, elige un empleado y establece fecha/hora\n2. **Agregar clientes** - Completa nombre, email y número de teléfono\n3. **Gestionar servicios** - Establece nombre del servicio, precio y duración\n4. **Ver reportes** - Filtrar por rango de fechas para ver ganancias\n\n¿Con qué proceso te gustaría ayuda?";
    } else if (
      lowerMessage.includes("thanks") ||
      lowerMessage.includes("thank") ||
      lowerMessage.includes("gracias")
    ) {
      return "¡De nada! No dudes en preguntar si necesitas algo más. ¡Estoy siempre aquí para ayudarte! 😊";
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hola")) {
      return "¡Hola! 👋 ¿Cómo puedo ayudarte con FlowMint hoy?";
    } else {
      return "Entiendo que estás preguntando sobre: \"" +
        userMessage +
        "\"\n\n¿Podrías proporcionar más detalles? Puedo ayudarte con:\n\n• Gestión de turnos\n• Operaciones de clientes\n• Información de empleados\n• Catálogo de servicios\n• Reportes de ganancias\n\n¡Por favor, especifica en qué necesitas ayuda!";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleClearChat = () => {
    if (window.confirm("¿Estás seguro de que deseas borrar el historial de chat?")) {
      setMessages([
        {
          id: 1,
          text: "¡Chat borrado! ¿Cómo puedo ayudarte?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    { text: "¿Cómo creo un turno?", icon: "📅" },
    { text: "Mostrar gestión de clientes", icon: "👥" },
    { text: "Explicar reportes de ganancias", icon: "💰" },
    { text: "Ayuda con servicios", icon: "✂️" },
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      contentClassName="modal-content"
      style={{ maxHeight: "90vh" }}
    >
      {/* Header */}
      <Modal.Header
        style={{
          background: "var(--bg-card)",
          borderBottom: "2px solid var(--border-color)",
          padding: "1rem 1.5rem",
        }}
      >
        <div className="d-flex align-items-center gap-3 w-100">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "48px",
              height: "48px",
              background:
                "linear-gradient(135deg, var(--neon-cyan), var(--neon-green))",
              border: "2px solid var(--neon-cyan)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Bot size={24} />
          </div>
          <div className="flex-grow-1">
            <h5
              className="mb-0"
              style={{
                color: "var(--neon-green)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              FlowMint AI Assistant
            </h5>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--neon-green)",
                  boxShadow: "0 0 10px var(--neon-green)",
                }}
              />
              <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                Online - Ready to help
              </small>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            style={{
              borderColor: "var(--neon-yellow)",
              color: "var(--neon-yellow)",
            }}
            title="Clear chat"
          >
            <Trash2 size={18} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onHide}
            style={{
              borderColor: "var(--neon-pink)",
              color: "var(--neon-pink)",
            }}
          >
            <X size={18} />
          </Button>
        </div>
      </Modal.Header>

      {/* Chat Messages */}
      <Modal.Body
        style={{
          background: "var(--bg-primary)",
          padding: "1.5rem",
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <div className="d-flex flex-column gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`d-flex ${message.sender === "user" ? "justify-content-end" : "justify-content-start"} align-items-start gap-2`}
            >
              {message.sender === "bot" && (
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "var(--neon-green)",
                    border: "2px solid var(--neon-cyan)",
                  }}
                >
                  <Bot size={20} style={{ color: "var(--bg-primary)" }} />
                </div>
              )}

              <div
                style={{
                  maxWidth: "75%",
                  padding: "0.875rem 1.125rem",
                  borderRadius: "12px",
                  background:
                    message.sender === "user"
                      ? "var(--neon-cyan)"
                      : "var(--bg-card)",
                  color:
                    message.sender === "user"
                      ? "var(--bg-primary)"
                      : "var(--text-primary)",
                  border:
                    message.sender === "bot"
                      ? "2px solid var(--border-color)"
                      : "none",
                  boxShadow:
                    message.sender === "user"
                      ? "var(--shadow-glow)"
                      : "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: "1.5",
                    fontSize: "0.95rem",
                  }}
                >
                  {message.text}
                </div>
                <div
                  className="mt-2"
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.7,
                    textAlign: message.sender === "user" ? "right" : "left",
                  }}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.sender === "user" && (
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    background:
                      "linear-gradient(135deg, var(--neon-pink), var(--neon-purple))",
                    border: "2px solid var(--neon-pink)",
                  }}
                >
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="d-flex justify-content-start align-items-start gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "var(--neon-green)",
                  border: "2px solid var(--neon-cyan)",
                }}
              >
                <Bot size={20} style={{ color: "var(--bg-primary)" }} />
              </div>
              <div
                style={{
                  padding: "0.875rem 1.125rem",
                  borderRadius: "12px",
                  background: "var(--bg-card)",
                  border: "2px solid var(--border-color)",
                }}
              >
                <div className="d-flex gap-2 align-items-center">
                  <div
                    className="spinner"
                    style={{ width: "8px", height: "8px" }}
                  ></div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    El AI está pensando...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="mt-4">
            <small
              style={{
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "1px",
              }}
            >
              Acciones Rápidas
            </small>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {quickActions.map((action, index) => (
                <Badge
                  key={index}
                  bg="secondary"
                  className="badge-primary"
                  style={{
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    fontSize: "0.85rem",
                    fontWeight: "normal",
                    border: "2px solid var(--neon-cyan)",
                    background: "transparent",
                    color: "var(--neon-cyan)",
                  }}
                  onClick={() => setInputMessage(action.text)}
                >
                  {action.icon} {action.text}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>

      {/* Input Footer */}
      <Modal.Footer
        style={{
          background: "var(--bg-card)",
          borderTop: "2px solid var(--border-color)",
          padding: "1rem 1.5rem",
        }}
      >
        <Form onSubmit={handleSendMessage} className="w-100">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Escribe tu mensaje aquí..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
              style={{
                background: "var(--bg-primary)",
                border: "2px solid var(--border-color)",
                color: "var(--text-primary)",
                padding: "0.75rem 1rem",
              }}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="btn-primary"
              style={{
                borderColor: "var(--neon-cyan)",
                background: "var(--neon-cyan)",
                color: "var(--bg-primary)",
                padding: "0.75rem 1.5rem",
              }}
            >
              <Send size={20} />
            </Button>
          </InputGroup>
          <div className="d-flex align-items-center gap-2 mt-2">
            <Sparkles
              size={14}
              style={{ color: "var(--neon-yellow)" }}
            />
            <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              Potenciado por AI - Pregúntame cualquier cosa sobre FlowMint
            </small>
          </div>
        </Form>
      </Modal.Footer>
    </Modal>
  );
};

export default AIChat;
