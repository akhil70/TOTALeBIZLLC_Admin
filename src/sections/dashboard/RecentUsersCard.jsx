import React, { useEffect, useState } from "react";

// react-bootstrap
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

// project-imports
import MainCard from "components/MainCard";
import { getUsers } from "../../utils/ApiService";
import { fetchApplicants } from "../../utils/ApiService"; // 👈 API for jobs

export default function RecentDataCard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role"); // Get role

  useEffect(() => {
    fetchData();
  }, [page, search, role]);

const fetchData = async () => {
  setLoading(true);
  try {
    if (role === "ADMIN") {
      const res = await getUsers({ emailId: search, page, size });
      setData(res?.payLoad?.data || []);
      setTotalPages(res?.payLoad?.totalPages || 0);
    } else if (role === "USER") {
      // Use a variable or state for status filter
      const res = await fetchApplicants(status && "PENDING" && "SHORTLISTED" && "HIRED" && "REJECTED", page, size);
      setData(res || []);
    }
  } catch (error) {
    console.error("Failed to load data", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <MainCard
      title={role === "ADMIN" ? "Recent Users" : "My Job Applications"}
      className="Recent-Data table-card"
    >
      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" size="sm" /> Loading...
        </div>
      ) : data.length === 0 ? (
        <p className="text-center my-3">
          {role === "ADMIN" ? "No users found." : "No job applications found."}
        </p>
      ) : (
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              {role === "ADMIN" ? (
                <>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Status</th>
                </>
              ) : (
                <>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </>
              )}
            </tr>
          </thead>
        <tbody>
  {data.map((item, index) => (
    <tr key={index}>
      {role === "ADMIN" ? (
        <>
          <td>{`${item.firstName || ""} ${item.lastName || ""}`.trim()}</td>
          <td>{item.emailId}</td>
          <td>{item.phoneNumber}</td>
          <td>{item.address}</td>
          <td>
            <Badge bg="success" className="me-2 f-12">
              Active
            </Badge>
          </td>
        </>
      ) : (
        <>
          <td>{item.jobId?.jobTitle}</td>
          <td>{item.jobId?.location}</td>
          <td>{new Date(item.appliedDate).toLocaleDateString()}</td>
          <td>
            <Badge
              bg={
                item.status === "PENDING"
                  ? "warning"
                  : item.status === "SHORTLISTED"
                  ? "info"
                  : item.status === "HIRED"
                  ? "success"
                  : item.status === "REJECTED"
                  ? "danger"
                  : "secondary"
              }
              className="me-2 f-12"
            >
              {item.status}
            </Badge>
          </td>
        </>
      )}
    </tr>
  ))}
</tbody>


        </Table>
      )}
    </MainCard>
  );
}
