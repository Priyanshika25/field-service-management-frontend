import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);

      (login(response.token, response.email, response.role, response.userId));

      if (response.role === "MANAGER") {
        navigate("/dashboard");
      } else if (response.role === "DISPATCHER") {
        navigate("/dispatcher/work-orders");
      } else if (response.role === "TECHNICIAN") {
        navigate("/technician/work-orders");
      } else if (response.role === "CUSTOMER") {
        navigate("/customer/work-orders");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);

      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">
          <div
            style={{
              fontSize: "42px",
              marginBottom: "10px",
            }}
          >
            🛠️
          </div>

          <h1>Field Service</h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "5px",
            }}
          >
            Management System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">Email</label>

            <input
              className="form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label className="form-label">Password</label>

            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "18px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "13px",
            marginTop: "25px",
          }}
        >
          Secure Field Service Management
        </p>
      </div>
    </div>
  );
};

export default Login;
