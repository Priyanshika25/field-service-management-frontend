import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

import WorkOrders from "./pages/WorkOrders";
import CreateWorkOrder from "./pages/CreateWorkOrder";
import WorkOrderDetails from "./pages/WorkOrderDetails";
import EditWorkOrder from "./pages/EditWorkOrder";

import TechnicianWorkOrders from "./pages/TechnicianWorkOrders";
import ServiceDetail from "./pages/ServiceDetail";

import CustomerWorkOrders from "./pages/CustomerWorkOrders";
import CustomerServiceRequest from "./pages/CustomerServiceRequest";
import CustomerWorkOrderDetails from "./pages/CustomerWorkOrderDetails";
import CustomerHistory from "./pages/CustomerHistory";
import DispatcherWorkOrders from "./pages/DispatcherWorkOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ALL PROTECTED / AUTHENTICATED PAGES */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* MANAGER / DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* WORK ORDERS */}
          <Route
            path="/work-orders"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <WorkOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/work-orders/create"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <CreateWorkOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/work-orders/:id"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <WorkOrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/work-orders/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <EditWorkOrder />
              </ProtectedRoute>
            }
          />

          {/* TECHNICIAN */}
          <Route
            path="/technician/work-orders"
            element={
              <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
                <TechnicianWorkOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/technician/work-orders/:workOrderId/service-details"
            element={
              <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
                <ServiceDetail />
              </ProtectedRoute>
            }
          />

          {/* CUSTOMER */}
          <Route
            path="/customer/work-orders"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <CustomerWorkOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/work-orders/:id"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <CustomerWorkOrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/service-request"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <CustomerServiceRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/history"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <CustomerHistory />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/dispatcher/work-orders"
          element={
            <ProtectedRoute allowedRoles={["DISPATCHER"]}>
              <DispatcherWorkOrders />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
