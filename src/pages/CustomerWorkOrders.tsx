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
}

function CustomerWorkOrders() {
  const navigate = useNavigate();

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Temporary fixed customer ID for testing.
  // Later we can get this from the logged-in user/JWT.
  const customerId = 19;

  useEffect(() => {
    const loadWorkOrders = async () => {
      try {
        const response = await api.get<WorkOrder[]>(
          `/api/customer/${customerId}/work-orders`,
        );

        setWorkOrders(response.data);
      } catch (error) {
        console.error("Customer work orders error:", error);

        setError("Unable to load your work orders");
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
          <h2>Loading your work orders...</h2>
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

          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* PAGE HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1 className="page-title">My Work Orders</h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "-10px",
            }}
          >
            View and track your service requests
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/customer/service-request")}
        >
          + New Service Request
        </button>
      </div>

      {/* EMPTY STATE */}

      {workOrders.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "50px 20px",
          }}
        >
          <h2>No Work Orders</h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            You currently have no work orders.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/customer/service-request")}
          >
            Create Service Request
          </button>
        </div>
      ) : (
        /* WORK ORDER TABLE */

        <div className="card">
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px",
                    }}
                  >
                    ID
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px",
                    }}
                  >
                    Title
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px",
                    }}
                  >
                    Priority
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px",
                    }}
                  >
                    Created
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {workOrders.map((workOrder) => (
                  <tr
                    key={workOrder.id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px",
                      }}
                    >
                      #{workOrder.id}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {workOrder.title}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                      }}
                    >
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: "20px",
                          background: "#f3f4f6",
                        }}
                      >
                        {workOrder.priority}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "14px",
                      }}
                    >
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: "20px",
                          background: "#f3f4f6",
                        }}
                      >
                        {workOrder.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "14px",
                      }}
                    >
                      {new Date(workOrder.createdAt).toLocaleDateString()}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                      }}
                    >
                      <button
                        className="btn btn-secondary"
                        onClick={() =>
                          navigate(`/customer/work-orders/${workOrder.id}`)
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerWorkOrders;
