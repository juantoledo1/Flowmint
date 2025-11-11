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
      text: "Hello! I'm FlowMint AI Assistant. I can help you with:\n\n• Managing appointments\n• Client information\n• Employee schedules\n• Service details\n• Revenue reports\n\nHow can I assist you today?",
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
      lowerMessage.includes("booking")
    ) {
      return "To manage appointments, go to the Appointments section. You can:\n\n• View all scheduled appointments\n• Create new appointments\n• Update existing bookings\n• Cancel or reschedule appointments\n\nWould you like help with anything specific?";
    } else if (
      lowerMessage.includes("client") ||
      lowerMessage.includes("cliente") ||
      lowerMessage.includes("customer")
    ) {
      return "In the Clients section, you can:\n\n• View all registered clients\n• Add new clients with their contact information\n• Update client details\n• Search clients by name, email, or phone\n\nIs there a specific client operation you need help with?";
    } else if (
      lowerMessage.includes("employee") ||
      lowerMessage.includes("empleado") ||
      lowerMessage.includes("staff")
    ) {
      return "The Employees section allows you to:\n\n• Manage your team members\n• Add new employees\n• Update employee information\n• Assign roles and positions\n\nWhat would you like to know about employee management?";
    } else if (
      lowerMessage.includes("service") ||
      lowerMessage.includes("servicio")
    ) {
      return "In the Services section, you can:\n\n• View all available services\n• Add new services with pricing and duration\n• Update service details\n• Remove services that are no longer offered\n\nDo you need help managing your services?";
    } else if (
      lowerMessage.includes("revenue") ||
      lowerMessage.includes("ganancia") ||
      lowerMessage.includes("money") ||
      lowerMessage.includes("profit")
    ) {
      return "The Revenue section provides:\n\n• Financial overview and statistics\n• Total revenue calculations\n• Service-based income breakdown\n• Date range filtering\n\nWould you like to know more about revenue tracking?";
    } else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("ayuda") ||
      lowerMessage.includes("?")
    ) {
      return "I'm here to help! Here are the main features:\n\n📅 **Appointments** - Schedule and manage bookings\n👥 **Clients** - Manage customer database\n👨‍💼 **Employees** - Team management\n✂️ **Services** - Service catalog\n💰 **Revenue** - Financial reports\n👤 **Users** - System user management\n\nWhat would you like to explore?";
    } else if (
      lowerMessage.includes("how") ||
      lowerMessage.includes("cómo") ||
      lowerMessage.includes("como")
    ) {
      return "I can guide you through:\n\n1. **Creating appointments** - Select a client, choose a service, pick an employee, and set date/time\n2. **Adding clients** - Fill in name, email, and phone number\n3. **Managing services** - Set service name, price, and duration\n4. **Viewing reports** - Filter by date range to see revenue\n\nWhich process would you like help with?";
    } else if (
      lowerMessage.includes("thanks") ||
      lowerMessage.includes("thank") ||
      lowerMessage.includes("gracias")
    ) {
      return "You're welcome! Feel free to ask if you need anything else. I'm always here to help! 😊";
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! 👋 How can I assist you with FlowMint today?";
    } else {
      return "I understand you're asking about: \"" +
        userMessage +
        "\"\n\nCould you provide more details? I can help with:\n\n• Appointments management\n• Client operations\n• Employee information\n• Service catalog\n• Revenue reports\n\nPlease specify what you need assistance with!";
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
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([
        {
          id: 1,
          text: "Chat cleared! How can I help you?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    { text: "How do I create an appointment?", icon: "📅" },
    { text: "Show me client management", icon: "👥" },
    { text: "Explain revenue reports", icon: "💰" },
    { text: "Help with services", icon: "✂️" },
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
                    AI is thinking...
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
              Quick Actions
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
              placeholder="Type your message here..."
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
              Powered by AI - Ask me anything about FlowMint
            </small>
          </div>
        </Form>
      </Modal.Footer>
    </Modal>
  );
};

export default AIChat;
