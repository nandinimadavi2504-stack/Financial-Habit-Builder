import { useState } from "react";
import { submitFeedback } from "../services/feedbackService";
import "../styles/Feedback.css";

function Feedback() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitFeedback({
        subject,
        message,
      });

      alert("Feedback submitted successfully.");

      setSubject("");
      setMessage("");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to submit feedback.");
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <h2>Feedback & Complaint</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <textarea
            rows="6"
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
