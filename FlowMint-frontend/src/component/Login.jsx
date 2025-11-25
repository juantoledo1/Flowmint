import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { motion } from "framer-motion";
import { Zap, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import "../index.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ user: "", pass: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    if (authAPI.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);

      if (response.access_token) {
        // Success - redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Credenciales inválidas. Por favor, inténtalo de nuevo.",
      );
      setCredentials({ ...credentials, pass: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        {/* Logo & Title */}
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Zap
              size={64}
              className="neon-pulse"
              style={{ color: "var(--neon-cyan)" }}
            />
          </motion.div>
          <h1 className="mt-3 mb-1">FlowMint</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Plataforma Profesional de Gestión de Negocios
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="alert alert-error mb-3"
          >
            <AlertCircle size={20} style={{ marginRight: "8px" }} />
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="user" className="mb-2">
              <User
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Usuario
            </label>
            <input
              type="text"
              id="user"
              name="user"
              value={credentials.user}
              onChange={handleChange}
              placeholder="Ingresa tu nombre de usuario"
              required
              autoComplete="username"
              disabled={loading}
            />
            <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
              Prueba demo: admin / admin123 o usuario / user123
            </small>
          </div>

          <div className="mb-4">
            <label htmlFor="pass" className="mb-2">
              <Lock
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="pass"
                name="pass"
                value={credentials.pass}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
                autoComplete="current-password"
                disabled={loading}
                style={{ paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--neon-cyan)",
                  cursor: "pointer",
                  padding: "0.5rem",
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
            style={{ fontSize: "1rem", padding: "0.875rem" }}
          >
            {loading ? (
              <>
                <div
                  className="spinner"
                  style={{
                    width: "20px",
                    height: "20px",
                    display: "inline-block",
                    marginRight: "8px",
                    verticalAlign: "middle",
                  }}
                ></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                <Zap
                  size={18}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div
          className="text-center"
          style={{
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            ¿No tienes una cuenta?{" "}
            <Link to="/registros" style={{ color: "var(--neon-green)" }}>
              Regístrate
            </Link>
          </p>
        </div>

        {/* Version Info */}
        <div className="text-center mt-3">
          <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
            FlowMint v1.0.0 - Gestión de turnos y negocios a nivel empresarial
          </small>
        </div>
      </motion.div>

      {/* Background Animation Elements */}
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
          top: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(0,243,255,0.15) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",
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
          bottom: "10%",
          left: "10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(255,0,110,0.15) 0%, rgba(255,109,0,0.1) 50%, transparent 70%)",
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
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default Login;
