import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateWorkOrder() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/api/work-orders", {
        title,
        description,
        priority,

        status: "CREATED",

        customer: null,
        technician: null,
      });

      navigate("/work-orders");
    } catch (error) {
      console.error("Create work order error:", error);

      setError("Unable to create work order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* HEADER */}

      <div style={{ marginBottom: "25px" }}>
        <h1 className="page-title">Create Work Order</h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "-15px",
          }}
        >
          Create a new field service work order
        </p>
      </div>

      {/* FORM CARD */}

      <div className="form-card">
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* TITLE */}

          <div className="form-group">
            <label className="form-label">Work Order Title</label>

            <input
              className="form-input"
              type="text"
              placeholder="Enter work order title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className="form-group">
            <label className="form-label">Description</label>

            <textarea
              className="form-input"
              placeholder="Describe the service required"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          {/* PRIORITY */}

          <div className="form-group">
            <label className="form-label">Priority</label>

            <select
              className="form-input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>

              <option value="MEDIUM">Medium</option>

              <option value="HIGH">High</option>

              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "25px",
            }}
          >
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Work Order"}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate("/work-orders")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkOrder;
