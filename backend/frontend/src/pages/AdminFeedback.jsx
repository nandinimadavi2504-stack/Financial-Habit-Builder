import { useEffect, useState } from "react";
import { getAllFeedback, deleteFeedback } from "../services/feedbackService";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminFeedback.css";

function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await getAllFeedback();
      setFeedback(data.feedback);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;

    try {
      await deleteFeedback(id);
      loadFeedback();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredFeedback = feedback.filter(
    (item) =>
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="admin-feedback-container">
      <AdminSidebar />

      <div className="admin-feedback-content">
        <h1>Feedback Management</h1>

        <input
          type="text"
          className="search-box"
          placeholder="Search by subject, name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="feedback-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan="7">No feedback found.</td>
              </tr>
            ) : (
              filteredFeedback.map((item) => (
                <tr key={item._id}>
                  <td>{item.user?.fullName}</td>

                  <td>{item.user?.email}</td>

                  <td>{item.subject}</td>

                  <td>{item.message}</td>

                  <td>{item.status}</td>

                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
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
    </div>
  );
}

export default AdminFeedback;
