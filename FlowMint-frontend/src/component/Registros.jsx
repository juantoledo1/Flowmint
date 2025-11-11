import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usersAPI } from "../services/api";
import { motion } from "framer-motion";
import {
  Zap,
  Lock,
  User,
  Mail,
  AlertCircle,
  UserPlus,
  Eye,
  EyeOff,
  CreditCard,
} from "lucide-react";
import "../index.css";

const Registros = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    user: "",
    pass: "",
    correo: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Basic validation
    if (formData.pass.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Add default role_id for new users
      const userData = {
        ...formData,
        rol_id: 2, // Default user role
        estado: "A", // Active status
      };

      await usersAPI.create(userData);
      setSuccess("Account created successfully! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    alert(
      "Google Sign-up integration coming soon! For now, please use the regular registration form.",
    );
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{ maxWidth: "600px", width: "100%" }}
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
            Start managing your business efficiently
          </p>
        </div>

        {/* Alerts */}
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

        {success && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="alert alert-success mb-3"
          >
            ✓ {success}
          </motion.div>
        )}

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="btn btn-outline w-100 mb-3"
          style={{
            borderColor: "var(--neon-pink)",
            color: "var(--neon-pink)",
            fontSize: "1rem",
            padding: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: "var(--neon-pink)" }}
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div
          className="text-center mb-3"
          style={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              background: "linear-gradient(145deg, #1e1e3e 0%, #2a2050 100%)",
              padding: "0 1rem",
              position: "relative",
              zIndex: 1,
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Or sign up with email
          </span>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "1px",
              background: "var(--border-color)",
              zIndex: 0,
            }}
          />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="nombre" className="mb-2">
                <User
                  size={16}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                First Name *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="apellido" className="mb-2">
                <User
                  size={16}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Last Name *
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Enter last name"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="dni" className="mb-2">
              <CreditCard
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              ID Number
            </label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="Enter your ID number (optional)"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="user" className="mb-2">
              <User
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Username *
            </label>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="correo" className="mb-2">
              <Mail
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Email *
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="pass" className="mb-2">
              <Lock
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Password *
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="pass"
                name="pass"
                value={formData.pass}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                autoComplete="new-password"
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
            <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              Must be at least 6 characters
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mb-3"
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
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus
                  size={18}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Create Account
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
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--neon-green)" }}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Version Info */}
        <div className="text-center mt-3">
          <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
            FlowMint v1.0.0 - Professional Business Management for Service
            Industries
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
            "radial-gradient(circle, rgba(22,242,179,0.15) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",
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
            "radial-gradient(circle, rgba(255,214,10,0.15) 0%, rgba(255,109,0,0.1) 50%, transparent 70%)",
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
            "radial-gradient(circle, rgba(0,243,255,0.08) 0%, transparent 60%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default Registros;
