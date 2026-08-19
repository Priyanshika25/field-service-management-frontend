import { useEffect, useState } from "react";
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

function WorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkOrders = async () => {
      try {
        const response = await api.get<WorkOrder[]>("/api/work-orders");

        setWorkOrders(response.data);
      } catch (error) {
        console.error("Work orders error:", error);

        setError("Unable to load work orders");
      } finally {
        setLoading(false);
      }
    };

    loadWorkOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Loading work orders...</h2>
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

  return (
    <div className="page-container">
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="page-title">Work Orders</h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "-15px",
            }}
          >
            Manage and monitor field service work orders
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            window.location.href = "/work-orders/create";
          }}
        >
          + Create Work Order
        </button>
      </div>

      {/* EMPTY STATE */}

      {workOrders.length === 0 ? (
        <div className="card">
          <h2>No work orders found.</h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Create a new work order to get started.
          </p>
        </div>
      ) : (
        /* TABLE */

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>

                <th>Title</th>

                <th>Priority</th>

                <th>Status</th>

                <th>Customer</th>

                <th>Technician</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {workOrders.map((workOrder) => (
                <tr key={workOrder.id}>
                  <td>#{workOrder.id}</td>

                  <td>
                    <strong>{workOrder.title}</strong>
                  </td>

                  {/* PRIORITY */}

                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background:
                          workOrder.priority === "URGENT"
                            ? "#fee2e2"
                            : workOrder.priority === "HIGH"
                              ? "#ffedd5"
                              : workOrder.priority === "MEDIUM"
                                ? "#fef3c7"
                                : "#e5e7eb",

                        color:
                          workOrder.priority === "URGENT"
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
                        workOrder.status === "COMPLETED"
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

                  {/* CUSTOMER */}

                  <td>{workOrder.customer?.username ?? "Not assigned"}</td>

                  {/* TECHNICIAN */}

                  <td>{workOrder.technician?.username ?? "Not assigned"}</td>

                  {/* ACTION */}

                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        (window.location.href = `/work-orders/${workOrder.id}`)
                      }
                    >
                      View
                    </button>
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

export default WorkOrders;
