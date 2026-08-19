import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

interface ServiceDetailData {
  id: number;
  description: string;
  workPerformed: string;
  serviceDate: string | null;
  remarks: string;
}

function ServiceDetail() {
  const { workOrderId } = useParams();
  const navigate = useNavigate();

  const [serviceDetail, setServiceDetail] = useState<ServiceDetailData | null>(
    null,
  );

  const [description, setDescription] = useState("");
  const [workPerformed, setWorkPerformed] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServiceDetail = async () => {
      try {
        const response = await api.get<ServiceDetailData>(
          `/api/service-details/work-order/${workOrderId}`,
        );

        const data = response.data;

        setServiceDetail(data);

        setDescription(data.description ?? "");
        setWorkPerformed(data.workPerformed ?? "");

        setServiceDate(
          data.serviceDate ? data.serviceDate.substring(0, 10) : "",
        );

        setRemarks(data.remarks ?? "");
      } catch (error: any) {
        console.error("Service detail error:", error);

        /*
         * 404 means the work order does not have
         * service details yet.
         *
         * That is not a fatal error.
         * We simply show an empty form so the
         * technician can create the details.
         */

        if (error?.response?.status === 404) {
          setServiceDetail(null);

          setDescription("");
          setWorkPerformed("");
          setServiceDate("");
          setRemarks("");

          setError("");
        } else {
          setError("Unable to load service details");
        }
      } finally {
        setLoading(false);
      }
    };

    loadServiceDetail();
  }, [workOrderId]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const payload = {
        description,
        workPerformed,

        serviceDate: serviceDate ? `${serviceDate}T00:00:00` : null,

        remarks,

        workOrder: {
          id: Number(workOrderId),
        },
      };

      if (serviceDetail) {
        /*
         * Existing service details
         * → UPDATE
         */

        await api.put(`/api/service-details/${serviceDetail.id}`, payload);

        alert("Service details updated successfully");
      } else {
        /*
         * No service details yet
         * → CREATE
         */

        const response = await api.post("/api/service-details", {
          description,
          workPerformed,
          serviceDate: serviceDate ? `${serviceDate}T00:00:00` : null,
          remarks,
          workOrderId: Number(workOrderId),
        });

        setServiceDetail(response.data);

        alert("Service details created successfully");
      }

      navigate("/technician/work-orders");
    } catch (error) {
      console.error("Save service detail error:", error);

      setError("Unable to save service details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading service details...</h2>;
  }

  return (
    <div>
      <button onClick={() => navigate("/technician/work-orders")}>
        ← Back to My Work Orders
      </button>

      <h1>Service Details</h1>

      <p>
        <strong>Work Order ID:</strong> {workOrderId}
      </p>

      {!serviceDetail && (
        <p>
          No service details exist yet. Enter the information below to create
          them.
        </p>
      )}

      {error && <p>{error}</p>}

      <form onSubmit={handleSave}>
        <div>
          <label>Description</label>

          <br />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <br />

        <div>
          <label>Work Performed</label>

          <br />

          <textarea
            value={workPerformed}
            onChange={(e) => setWorkPerformed(e.target.value)}
            rows={4}
          />
        </div>

        <br />

        <div>
          <label>Service Date</label>

          <br />

          <input
            type="date"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Remarks</label>

          <br />

          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
          />
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : serviceDetail
              ? "Update Service Details"
              : "Create Service Details"}
        </button>
      </form>
    </div>
  );
}

export default ServiceDetail;
