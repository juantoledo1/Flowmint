import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Zap, LogIn, UserPlus, Calendar, Users, Sparkles } from "lucide-react";
import "../index.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.clear();
  };

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Streamline bookings for any service-based business",
      color: "var(--neon-cyan)",
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Organize and manage your customer database",
      color: "var(--neon-green)",
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      description: "24/7 intelligent support for your operations",
      color: "var(--neon-pink)",
    },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <Container className="flex-grow-1 d-flex align-items-center py-5">
        <Row className="w-100">
          <Col lg={6} className="mb-5 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo */}
              <motion.div
                className="mb-4"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Zap
                  size={80}
                  className="neon-pulse"
                  style={{ color: "var(--neon-cyan)" }}
                />
              </motion.div>

              {/* Title */}
              <h1
                className="mb-4"
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "bold",
                  lineHeight: "1.2",
                }}
              >
                Welcome to{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, var(--neon-cyan), var(--neon-pink))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  FlowMint
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="mb-4"
                style={{
                  fontSize: "1.25rem",
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                }}
              >
                Professional appointment management system for any business.
                Manage{" "}
                <span style={{ color: "var(--neon-green)" }}>clients</span>,{" "}
                <span style={{ color: "var(--neon-cyan)" }}>appointments</span>,{" "}
                <span style={{ color: "var(--neon-pink)" }}>services</span>, and{" "}
                <span style={{ color: "var(--neon-yellow)" }}>revenue</span> all
                in one place.
              </p>

              {/* CTA Buttons */}
              <div className="d-flex flex-wrap gap-3 mb-5">
                <Button
                  as={Link}
                  to="/login"
                  onClick={handleLogout}
                  className="btn-primary"
                  style={{
                    padding: "1rem 2rem",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <LogIn size={20} />
                  Sign In
                </Button>
                <Button
                  as={Link}
                  to="/registros"
                  onClick={handleLogout}
                  className="btn-success"
                  style={{
                    padding: "1rem 2rem",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <UserPlus size={20} />
                  Get Started
                </Button>
              </div>

              {/* Stats */}
              <Row className="g-4">
                <Col xs={4}>
                  <div className="text-center">
                    <h3
                      style={{
                        color: "var(--neon-cyan)",
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      Easy
                    </h3>
                    <small style={{ color: "var(--text-muted)" }}>
                      Setup & Use
                    </small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="text-center">
                    <h3
                      style={{
                        color: "var(--neon-green)",
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      Multi
                    </h3>
                    <small style={{ color: "var(--text-muted)" }}>
                      Industry Ready
                    </small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="text-center">
                    <h3
                      style={{
                        color: "var(--neon-pink)",
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      24/7
                    </h3>
                    <small style={{ color: "var(--text-muted)" }}>
                      AI Assistance
                    </small>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </Col>

          {/* Features */}
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-100 d-flex flex-column justify-content-center gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="card p-4"
                  style={{
                    background:
                      "linear-gradient(145deg, #1e1e3e 0%, #2a2050 100%)",
                    border: `2px solid ${feature.color}`,
                    cursor: "pointer",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 0 30px ${feature.color}50`,
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded"
                      style={{
                        width: "60px",
                        height: "60px",
                        background: `${feature.color}20`,
                        border: `2px solid ${feature.color}`,
                        flexShrink: 0,
                      }}
                    >
                      <feature.icon
                        size={30}
                        style={{ color: feature.color }}
                      />
                    </div>
                    <div>
                      <h4
                        style={{
                          color: feature.color,
                          marginBottom: "0.5rem",
                          fontSize: "1.25rem",
                        }}
                      >
                        {feature.title}
                      </h4>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          marginBottom: 0,
                          fontSize: "0.95rem",
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer
        className="py-4 text-center"
        style={{
          borderTop: "2px solid var(--border-color)",
          background: "linear-gradient(180deg, transparent 0%, #1a1a3e 100%)",
        }}
      >
        <Container>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            FlowMint v1.0.0 - Professional Appointment & Business Management
            System
          </p>
          <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Perfect for salons, spas, clinics, consultants, and any
            service-based business
          </small>
        </Container>
      </footer>

      {/* Background Animations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "fixed",
          top: "20%",
          right: "10%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(0,243,255,0.1) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "fixed",
          bottom: "20%",
          left: "10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(255,0,110,0.1) 0%, rgba(255,109,0,0.08) 50%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          top: "50%",
          right: "30%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(22,242,179,0.1) 0%, transparent 60%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default Home;
