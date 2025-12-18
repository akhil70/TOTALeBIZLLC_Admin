// views/users/UsersPage.js
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MainCard from "components/MainCard";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../utils/ApiService";

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]); // fetch on page change

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers({ emailId: search, page, size });
      setUsers(data?.payLoad?.data || []);
      setTotalPages(data?.payLoad?.totalPages || 0);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0); // reset to first page on search
    fetchUsers();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Row>
      <Col xl={12}>
        <MainCard>
          <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
            <input
              type="text"
              placeholder="Search user..."
              className="form-control"
              style={{ width: "250px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button variant="secondary" onClick={handleSearch}>
              Search
            </Button>

            <Button variant="primary" onClick={() => navigate("/users/add")}>
              Add New User +
            </Button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Role</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id || index}>
                        <td>{page * size + index + 1}</td>
                        <td>{user.userName}</td>
                        <td>{user.emailId}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.role}</td>
                        <td>{user.phoneNumber || "-"}</td>
                        <td>{user.address || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(0)}
                      disabled={page === 0}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 0}
                    />

                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item
                        key={i}
                        active={i === page}
                        onClick={() => handlePageChange(i)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages - 1}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages - 1)}
                      disabled={page === totalPages - 1}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </MainCard>
      </Col>
    </Row>
  );
}
