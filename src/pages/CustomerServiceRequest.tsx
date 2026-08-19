import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CustomerServiceRequest() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const customerId = 19;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post(`/api/customer/${customerId}/service-request`, {
        title,
        description,
        priority,
        status: "CREATED",
      });

      setSuccess("Service request created successfully.");

      setTitle("");
      setDescription("");
      setPriority("LOW");
    } catch (error) {
      console.error("Create service request error:", error);

      setError("Unable to create service request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/customer/work-orders")}>
        ← Back to My Work Orders
      </button>

      <h1>Create Service Request</h1>

      {error && <p>{error}</p>}

      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />
        </div>

        <br />

        <div>
          <label>Priority</label>
          <br />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Service Request"}
        </button>
      </form>
    </div>
  );
}

export default CustomerServiceRequest;
