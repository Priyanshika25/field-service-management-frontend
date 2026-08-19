import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

interface WorkOrder {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
}

function EditWorkOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [status, setStatus] = useState("CREATED");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkOrder = async () => {
      try {
        const response = await api.get<WorkOrder>(`/api/work-orders/${id}`);

        const workOrder = response.data;

        setTitle(workOrder.title);
        setDescription(workOrder.description || "");
        setPriority(workOrder.priority);
        setStatus(workOrder.status);
      } catch (error) {
        console.error("Load work order error:", error);

        setError("Unable to load work order");
      } finally {
        setLoading(false);
      }
    };

    loadWorkOrder();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await api.put(`/api/work-orders/${id}`, {
        title,
        description,
        priority,
        status,
      });

      navigate(`/work-orders/${id}`);
    } catch (error) {
      console.error("Update work order error:", error);

      setError("Unable to update work order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Loading work order...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* HEADER */}

      <div style={{ marginBottom: "25px" }}>
        <h1 className="page-title">Edit Work Order #{id}</h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "-15px",
          }}
        >
          Update work order information and status
        </p>
      </div>

      {/* FORM */}

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

          {/* STATUS */}

          <div className="form-group">
            <label className="form-label">Status</label>

            <select
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="CREATED">Created</option>

              <option value="ASSIGNED">Assigned</option>

              <option value="IN_PROGRESS">In Progress</option>

              <option value="DONE">Completed</option>
            </select>
          </div>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Updating..." : "Update Work Order"}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate(`/work-orders/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWorkOrder;
