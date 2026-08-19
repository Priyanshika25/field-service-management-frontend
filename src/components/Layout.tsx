import { Link, Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    navigate("/login");
  };

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-title">Field Service</div>

        <nav className="sidebar-nav">
          {/* MANAGER */}
          {role === "MANAGER" && (
            <>
              <Link className="sidebar-link" to="/dashboard">
                📊 Dashboard
              </Link>

              <Link className="sidebar-link" to="/work-orders">
                📋 Work Orders
              </Link>
            </>
          )}

          {/* DISPATCHER */}

          {role === "DISPATCHER" && (
            <Link className="sidebar-link" to="/dispatcher/work-orders">
              📋 Work Orders
            </Link>
          )}

          {/* TECHNICIAN */}
          {role === "TECHNICIAN" && (
            <>
              <Link className="sidebar-link" to="/technician/work-orders">
                🔧 My Work Orders
              </Link>
            </>
          )}

          {/* CUSTOMER */}
          {role === "CUSTOMER" && (
            <>
              <Link className="sidebar-link" to="/customer/work-orders">
                📋 My Work Orders
              </Link>

              <Link className="sidebar-link" to="/customer/service-request">
                🛠️ Service Request
              </Link>

              <Link className="sidebar-link" to="/customer/history">
                📜 History
              </Link>
            </>
          )}
        </nav>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
