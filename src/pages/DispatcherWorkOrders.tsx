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

function DispatcherWorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [technicianIds, setTechnicianIds] = useState<Record<number, string>>(
    {},
  );

  const loadWorkOrders = async () => {
    try {
      setError("");

      const response = await api.get<WorkOrder[]>(
        "/api/dispatcher/work-orders",
      );

      setWorkOrders(response.data);
    } catch (error) {
      console.error("Dispatcher work orders error:", error);
      setError("Unable to load work orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const assignTechnician = async (workOrderId: number) => {
    const technicianId = technicianIds[workOrderId];

    if (!technicianId) {
      alert("Please enter a technician ID");
      return;
    }

    try {
      await api.put(
        `/api/dispatcher/work-orders/${workOrderId}/assign/${technicianId}`,
      );

      alert("Technician assigned successfully");

      setTechnicianIds((previous) => ({
        ...previous,
        [workOrderId]: "",
      }));

      await loadWorkOrders();
    } catch (error) {
      console.error("Assign technician error:", error);
      setError("Unable to assign technician");
    }
  };

  const getPriorityStyle = (priority: string) => {
    const value = priority?.toUpperCase();

    if (value === "CRITICAL") {
      return {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
      };
    }

    if (value === "HIGH") {
      return {
        backgroundColor: "#ffedd5",
        color: "#c2410c",
      };
    }

    if (value === "MEDIUM") {
      return {
        backgroundColor: "#fef3c7",
        color: "#a16207",
      };
    }

    return {
      backgroundColor: "#dcfce7",
      color: "#15803d",
    };
  };

  const getStatusStyle = (status: string) => {
    const value = status?.toUpperCase();

    if (value === "DONE" || value === "COMPLETED") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (value === "ASSIGNED") {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (value === "IN_PROGRESS") {
      return {
        backgroundColor: "#ede9fe",
        color: "#6d28d9",
      };
    }

    if (value === "ON_HOLD") {
      return {
        backgroundColor: "#fef3c7",
        color: "#a16207",
      };
    }

    return {
      backgroundColor: "#f1f5f9",
      color: "#475569",
    };
  };

  const totalOrders = workOrders.length;
  const assignedOrders = workOrders.filter(
    (order) => order.status?.toUpperCase() === "ASSIGNED",
  ).length;
  const inProgressOrders = workOrders.filter(
    (order) => order.status?.toUpperCase() === "IN_PROGRESS",
  ).length;
  const completedOrders = workOrders.filter(
    (order) =>
      order.status?.toUpperCase() === "DONE" ||
      order.status?.toUpperCase() === "COMPLETED",
  ).length;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          color: "#334155",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "30px 40px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>⏳</div>
          <h3 style={{ margin: 0 }}>Loading work orders...</h3>
        </div>
      </div>
    );
  }

  if (error && workOrders.length === 0) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "36px" }}>⚠️</div>

          <h2 style={{ color: "#b91c1c" }}>Unable to load work orders</h2>

          <p style={{ color: "#64748b" }}>{error}</p>

          <button
            onClick={loadWorkOrders}
            style={{
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              padding: "10px 20px",
              borderRadius: "7px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "30px",
        fontFamily: "Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            Dispatcher Work Orders
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Monitor work orders and assign technicians
          </p>
        </div>

        <button
          onClick={loadWorkOrders}
          style={{
            border: "1px solid #cbd5e1",
            backgroundColor: "#ffffff",
            color: "#334155",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "18px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            borderLeft: "5px solid #2563eb",
          }}
        >
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Total Work Orders
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "28px",
              color: "#0f172a",
            }}
          >
            {totalOrders}
          </h2>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            borderLeft: "5px solid #0ea5e9",
          }}
        >
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Assigned
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "28px",
              color: "#0f172a",
            }}
          >
            {assignedOrders}
          </h2>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            borderLeft: "5px solid #8b5cf6",
          }}
        >
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            In Progress
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "28px",
              color: "#0f172a",
            }}
          >
            {inProgressOrders}
          </h2>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            borderLeft: "5px solid #16a34a",
          }}
        >
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Completed
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "28px",
              color: "#0f172a",
            }}
          >
            {completedOrders}
          </h2>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "12px 15px",
            marginBottom: "18px",
          }}
        >
          {error}
        </div>
      )}

      {/* WORK ORDER TABLE */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 22px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "20px",
            }}
          >
            Work Orders
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Assign technicians to pending work orders
          </p>
        </div>

        {workOrders.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            <div style={{ fontSize: "42px", marginBottom: "10px" }}>📋</div>

            <h3 style={{ margin: "0 0 5px", color: "#334155" }}>
              No work orders found
            </h3>

            <p style={{ margin: 0 }}>
              There are currently no work orders available.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1050px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {[
                    "ID",
                    "Work Order",
                    "Priority",
                    "Status",
                    "Customer",
                    "Technician",
                    "Assign Technician",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        fontSize: "13px",
                        color: "#475569",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {workOrders.map((workOrder, index) => (
                  <tr
                    key={workOrder.id}
                    style={{
                      borderBottom:
                        index === workOrders.length - 1
                          ? "none"
                          : "1px solid #e2e8f0",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px",
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      #{workOrder.id}
                    </td>

                    <td
                      style={{
                        padding: "16px",
                        minWidth: "210px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#0f172a",
                          marginBottom: "4px",
                        }}
                      >
                        {workOrder.title}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          maxWidth: "240px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={workOrder.description}
                      >
                        {workOrder.description || "No description"}
                      </div>
                    </td>

                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          ...getPriorityStyle(workOrder.priority),
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {workOrder.priority}
                      </span>
                    </td>

                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          ...getStatusStyle(workOrder.status),
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {workOrder.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "16px",
                        color: "#334155",
                      }}
                    >
                      {workOrder.customer?.username || "Not assigned"}
                    </td>

                    <td
                      style={{
                        padding: "16px",
                        color: "#334155",
                      }}
                    >
                      {workOrder.technician?.username || (
                        <span style={{ color: "#94a3b8" }}>Not assigned</span>
                      )}
                    </td>

                    <td style={{ padding: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <input
                          type="number"
                          placeholder="Technician ID"
                          value={technicianIds[workOrder.id] || ""}
                          onChange={(e) =>
                            setTechnicianIds((previous) => ({
                              ...previous,
                              [workOrder.id]: e.target.value,
                            }))
                          }
                          style={{
                            width: "115px",
                            padding: "8px 9px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            outline: "none",
                            fontSize: "13px",
                            boxSizing: "border-box",
                          }}
                        />

                        <button
                          onClick={() => assignTechnician(workOrder.id)}
                          style={{
                            border: "none",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            padding: "8px 13px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DispatcherWorkOrders;
