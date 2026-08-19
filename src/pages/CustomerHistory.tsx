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

function CustomerHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerId = 19;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get<WorkOrder[]>(
          `/api/customer/${customerId}/history`,
        );

        setHistory(response.data);
      } catch (error) {
        console.error("Customer history error:", error);

        setError("Unable to load service history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return <h2>Loading service history...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <button onClick={() => navigate("/customer/work-orders")}>
        ← Back to My Work Orders
      </button>

      <h1>Service History</h1>

      {history.length === 0 ? (
        <p>No service history found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {history.map((workOrder) => (
              <tr key={workOrder.id}>
                <td>{workOrder.id}</td>

                <td>{workOrder.title}</td>

                <td>{workOrder.priority}</td>

                <td>{workOrder.status}</td>

                <td>{workOrder.createdAt}</td>

                <td>{workOrder.updatedAt || "Not updated"}</td>

                <td>
                  <button
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
      )}
    </div>
  );
}

export default CustomerHistory;
