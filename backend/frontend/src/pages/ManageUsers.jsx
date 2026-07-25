import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/adminService";
import AdminSidebar from "../components/AdminSidebar";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (error) {
      console.log(error);
      alert("Failed to load users");
    }
  };

  const handleDelete = async (id) => {
    if (id === loggedInUser.id) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);
      alert("User deleted successfully.");
      loadUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to delete user.");
    }
  };

  return (
    <>
      <AdminSidebar />

      <div className="manage-users">
        <h1>Manage Users</h1>

        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Occupation</th>
              <th>Role</th>
              <th>Monthly Income</th>
              <th>Currency</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-users">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>{user.occupation || "-"}</td>

                  <td>{user.role}</td>

                  <td>₹{user.monthlyIncome}</td>

                  <td>{user.currency}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageUsers;
