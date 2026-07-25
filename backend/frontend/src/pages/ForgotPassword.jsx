import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.phone ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email: formData.email,
          phone: formData.phone,
          newPassword: formData.newPassword,
        },
      );

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Reset Password</h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Verify your account and create a new password.
        </p>

        <form onSubmit={handleResetPassword}>
          <div>
            <label>Email</label>
            <br />
            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Registered Phone Number</label>
            <br />
            <input
              type="text"
              name="phone"
              placeholder="Enter your registered phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>New Password</label>
            <br />
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Confirm Password</label>
            <br />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <button type="submit">Reset Password</button>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
