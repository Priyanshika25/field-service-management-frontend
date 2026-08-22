import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface WorkOrder {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  serviceDetail: ServiceDetail | null;
}

interface ServiceDetail {
  id: number;
  description: string;
  workPerformed: string;
  serviceDate: string | null;
  remarks: string;
}

function TechnicianWorkOrders() {
  const navigate = useNavigate();

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const technicianId = Number(localStorage.getItem("userId"));

  if (!technicianId) {
    console.error("Technician userId not found in localStorage");
  }

  const loadWorkOrders = async () => {
    try {
      const response = await api.get<WorkOrder[]>(
        `/api/technician/${technicianId}/work-orders`,
      );

      setWorkOrders(response.data);

      setError("");
    } catch (error) {
      console.error("Technician work orders error:", error);

      setError("Unable to load assigned work orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (workOrderId: number, status: string) => {
    try {
      setError("");

      await api.put(`/api/technician/work-orders/${workOrderId}/status`, null, {
        params: {
          status,
        },
      });

      await loadWorkOrders();
    } catch (error) {
      console.error("Update status error:", error);

      setError("Unable to update work order status");
    }
  };

  useEffect(() => {
    loadWorkOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Loading assigned work orders...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1 className="page-title">My Work Orders</h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "-15px",
            }}
          >
            View and manage your assigned field service work
          </p>
        </div>

        <div
          style={{
            padding: "10px 16px",
            background: "#f3f4f6",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          Technician ID: <strong>{technicianId}</strong>
        </div>
      </div>

      {/* ERROR */}

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

      {/* EMPTY STATE */}

      {workOrders.length === 0 ? (
        <div className="card">
          <h2>No assigned work orders</h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            There are currently no work orders assigned to you.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>

                <th>Title</th>

                <th>Priority</th>

                <th>Status</th>

                <th>Created</th>

                <th>Action</th>

                <th>Service Details</th>
              </tr>
            </thead>

            <tbody>
              {workOrders.map((workOrder) => (
                <tr key={workOrder.id}>
                  {/* ID */}

                  <td>#{workOrder.id}</td>

                  {/* TITLE */}

                  <td>
                    <strong>{workOrder.title}</strong>

                    {workOrder.description && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "5px",
                          maxWidth: "250px",
                        }}
                      >
                        {workOrder.description}
                      </div>
                    )}
                  </td>

                  {/* PRIORITY */}

                  <td>
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
                      {workOrder.priority}
                    </span>
                  </td>

                  {/* STATUS */}

                  <td>
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
                      {workOrder.status}
                    </span>
                  </td>

                  {/* CREATED */}

                  <td>
                    <span
                      style={{
                        fontSize: "13px",
                      }}
                    >
                      {workOrder.createdAt}
                    </span>
                  </td>

                  {/* ACTION */}

                  <td>
                    {workOrder.status === "ASSIGNED" && (
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          updateStatus(workOrder.id, "IN_PROGRESS")
                        }
                      >
                        Start Work
                      </button>
                    )}

                    {workOrder.status === "IN_PROGRESS" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => updateStatus(workOrder.id, "DONE")}
                      >
                        Complete Work
                      </button>
                    )}

                    {workOrder.status === "DONE" && (
                      <span
                        style={{
                          color: "#166534",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Completed
                      </span>
                    )}
                  </td>

                  {/* SERVICE DETAILS */}

                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        navigate(
                          `/technician/work-orders/${workOrder.id}/service-details`,
                        )
                      }
                    >
                      View Details
                    </button>

                    {workOrder.serviceDetail && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#6b7280",
                        }}
                      >
                        Service details available
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TechnicianWorkOrders;
