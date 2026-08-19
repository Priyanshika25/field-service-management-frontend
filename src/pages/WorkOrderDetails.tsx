import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface WorkOrder {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  customer: User | null;
  technician: User | null;
}

function WorkOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkOrder = async () => {
      try {
        const response = await api.get<WorkOrder>(`/api/work-orders/${id}`);

        setWorkOrder(response.data);
      } catch (error) {
        console.error("Work order details error:", error);

        setError("Unable to load work order");
      } finally {
        setLoading(false);
      }
    };

    loadWorkOrder();
  }, [id]);

  const handleDelete = async () => {
    if (!workOrder) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this work order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/api/work-orders/${workOrder.id}`);

      navigate("/work-orders");
    } catch (error) {
      console.error("Delete work order error:", error);

      setError("Unable to delete work order");
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

  if (error) {
    return (
      <div className="page-container">
        <div className="card">
          <h2
            style={{
              color: "#dc2626",
            }}
          >
            {error}
          </h2>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Work order not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* TOP ACTIONS */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="page-title">Work Order #{workOrder.id}</h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "-15px",
            }}
          >
            View complete work order information
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/work-orders")}
          >
            ← Back
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate(`/work-orders/${workOrder.id}/edit`)}
          >
            Edit Work Order
          </button>

          <button
            className="btn"
            style={{
              background: "#dc2626",
              color: "white",
            }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {/* MAIN DETAILS */}

      <div className="card">
        <h2
          style={{
            marginTop: 0,
            marginBottom: "25px",
          }}
        >
          {workOrder.title}
        </h2>

        {/* STATUS / PRIORITY */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <span
            className="status-badge"
            style={{
              background:
                workOrder.priority === "CRITICAL"
                  ? "#fee2e2"
                  : workOrder.priority === "HIGH"
                    ? "#ffedd5"
                    : workOrder.priority === "MEDIUM"
                      ? "#fef3c7"
                      : "#e5e7eb",

              color:
                workOrder.priority === "CRITICAL"
                  ? "#991b1b"
                  : workOrder.priority === "HIGH"
                    ? "#9a3412"
                    : workOrder.priority === "MEDIUM"
                      ? "#92400e"
                      : "#374151",
            }}
          >
            Priority: {workOrder.priority}
          </span>

          <span
            className={`status-badge ${
              workOrder.status === "DONE"
                ? "status-completed"
                : workOrder.status === "IN_PROGRESS"
                  ? "status-progress"
                  : workOrder.status === "CANCELLED"
                    ? "status-cancelled"
                    : "status-pending"
            }`}
          >
            Status: {workOrder.status}
          </span>
        </div>

        {/* DESCRIPTION */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h3>Description</h3>

          <p
            style={{
              color: "#4b5563",
              lineHeight: "1.7",
            }}
          >
            {workOrder.description || "No description provided."}
          </p>
        </div>

        {/* PEOPLE */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* CUSTOMER */}

          <div
            style={{
              padding: "20px",
              background: "#f9fafb",
              borderRadius: "10px",
            }}
          >
            <h3>Customer</h3>

            <p>
              <strong>Name:</strong>{" "}
              {workOrder.customer?.username || "Not assigned"}
            </p>

            <p>
              <strong>Email:</strong> {workOrder.customer?.email || "N/A"}
            </p>
          </div>

          {/* TECHNICIAN */}

          <div
            style={{
              padding: "20px",
              background: "#f9fafb",
              borderRadius: "10px",
            }}
          >
            <h3>Technician</h3>

            <p>
              <strong>Name:</strong>{" "}
              {workOrder.technician?.username || "Not assigned"}
            </p>

            <p>
              <strong>Email:</strong> {workOrder.technician?.email || "N/A"}
            </p>
          </div>
        </div>

        {/* TIMESTAMPS */}

        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "20px",
          }}
        >
          <h3>Work Order Information</h3>

          <p>
            <strong>Created:</strong> {workOrder.createdAt}
          </p>

          <p>
            <strong>Last Updated:</strong>{" "}
            {workOrder.updatedAt || "Not updated"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkOrderDetails;
