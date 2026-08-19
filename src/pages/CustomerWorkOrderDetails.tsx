import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface ServiceDetail {
  id: number;
  description: string;
  workPerformed: string;
  serviceDate: string | null;
  remarks: string;
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
  serviceDetail: ServiceDetail | null;
}

function CustomerWorkOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkOrder = async () => {
      try {
        const response = await api.get<WorkOrder>(
          `/api/customer/19/work-orders/${id}`,
        );

        setWorkOrder(response.data);
      } catch (error) {
        console.error("Customer work order details error:", error);
        setError("Unable to load work order details");
      } finally {
        setLoading(false);
      }
    };

    loadWorkOrder();
  }, [id]);

  if (loading) {
    return <h2>Loading work order...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!workOrder) {
    return <h2>Work order not found</h2>;
  }

  return (
    <div>
      <button onClick={() => navigate("/customer/work-orders")}>
        ← Back to My Work Orders
      </button>

      <h1>Work Order #{workOrder.id}</h1>

      <hr />

      <h2>{workOrder.title}</h2>

      <p>
        <strong>Description:</strong> {workOrder.description || "N/A"}
      </p>

      <p>
        <strong>Priority:</strong> {workOrder.priority}
      </p>

      <p>
        <strong>Status:</strong> {workOrder.status}
      </p>

      <p>
        <strong>Created At:</strong> {workOrder.createdAt}
      </p>

      <p>
        <strong>Updated At:</strong> {workOrder.updatedAt || "Not updated"}
      </p>

      <p>
        <strong>Technician:</strong>{" "}
        {workOrder.technician?.username || "Not assigned"}
      </p>

      <h2>Service Details</h2>

      {workOrder.serviceDetail ? (
        <div>
          <p>
            <strong>Description:</strong> {workOrder.serviceDetail.description}
          </p>

          <p>
            <strong>Work Performed:</strong>{" "}
            {workOrder.serviceDetail.workPerformed}
          </p>

          <p>
            <strong>Service Date:</strong>{" "}
            {workOrder.serviceDetail.serviceDate || "Not completed"}
          </p>

          <p>
            <strong>Remarks:</strong> {workOrder.serviceDetail.remarks}
          </p>
        </div>
      ) : (
        <p>No service details available yet.</p>
      )}
    </div>
  );
}

export default CustomerWorkOrderDetails;
