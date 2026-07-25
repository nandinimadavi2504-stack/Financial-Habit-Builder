import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/Login.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        fullName,
        email,
        phone,
        password,
        occupation: "",
        monthlyIncome: 0,
        currency: "INR",
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.log("Register Error:", error);
      console.log("Response:", error.response);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Create Account</h1>

        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          Register to continue
        </p>

        <form onSubmit={handleRegister}>
          <div>
            <label>Full Name</label>
            <br />
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Email</label>
            <br />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Phone Number</label>
            <br />
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Password</label>
            <br />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Confirm Password</label>
            <br />
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <br />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
