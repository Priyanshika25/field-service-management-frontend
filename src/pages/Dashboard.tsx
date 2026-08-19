import { useEffect, useState } from "react";

import { getDashboardData } from "../services/dashboardService";
import type { DashboardData } from "../services/dashboardService";

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();

        setDashboard(data);
      } catch (error) {
        console.error("Dashboard error:", error);

        setError("Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Loading dashboard...</h2>
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

  if (!dashboard) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>No dashboard data available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* HEADER */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h1 className="page-title">Dashboard</h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "-15px",
          }}
        >
          Field Service Management Overview
        </p>
      </div>

      {/* STATISTICS */}

      <div className="dashboard-grid">
        {/* TOTAL */}

        <div className="dashboard-card">
          <div className="dashboard-card-title">Total Work Orders</div>

          <div className="dashboard-card-value">
            {dashboard.totalWorkOrders}
          </div>
        </div>

        {/* CREATED */}

        <div className="dashboard-card">
          <div className="dashboard-card-title">Created</div>

          <div className="dashboard-card-value">{dashboard.created}</div>
        </div>

        {/* ASSIGNED */}

        <div className="dashboard-card">
          <div className="dashboard-card-title">Assigned</div>

          <div className="dashboard-card-value">{dashboard.assigned}</div>
        </div>

        {/* IN PROGRESS */}

        <div className="dashboard-card">
          <div className="dashboard-card-title">In Progress</div>

          <div className="dashboard-card-value">{dashboard.inProgress}</div>
        </div>

        {/* COMPLETED */}

        <div className="dashboard-card">
          <div className="dashboard-card-title">Completed</div>

          <div className="dashboard-card-value">{dashboard.done}</div>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="card">
        <h2>Work Order Summary</h2>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Current status of work orders in the field service system.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <span className="status-badge status-pending">
            Created: {dashboard.created}
          </span>

          <span className="status-badge status-progress">
            In Progress: {dashboard.inProgress}
          </span>

          <span className="status-badge status-completed">
            Completed: {dashboard.done}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
