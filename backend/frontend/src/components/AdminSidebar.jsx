import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>

      <nav>
        <Link to="/admin/dashboard">Dashboard</Link>

        <Link to="/admin/users">Manage Users</Link>

        <Link to="/admin/analytics">Analytics</Link>

        {/* NEW */}
        <Link to="/admin/feedback">Feedback</Link>

        <Link to="/dashboard">User Dashboard</Link>

        <button onClick={logout}>Logout</button>
      </nav>
    </div>
  );
}

export default AdminSidebar;
