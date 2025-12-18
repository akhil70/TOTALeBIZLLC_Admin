import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MainCard from "components/MainCard";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import { toast } from 'react-toastify';


import {
  getDepartments,
  addDepartment,
} from "../utils/ApiService";

import "./DepartmentPage.css"; 

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", description: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDepartments();
      setDepartments(res?.payLoad || []);
    } catch (err) {
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

 const handleAddDepartment = async () => {
  if (!newDept.name.trim()) {
    toast.error("Department name is required");
    return;
  }
  try {
    await addDepartment(newDept);

    toast.success("Department added successfully!");
    setShowModal(false);
    setNewDept({ name: "", description: "" });
    fetchDepartments();
  } catch (err) {
    toast.error("Failed to add department. Please try again.");
  }
};

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Row>
      <Col xl={12}>
        <MainCard className="glass-card" title="Departments">
          <div className="d-flex justify-content-end mb-3">
            <Button className="btn-gradient shadow" onClick={() => setShowModal(true)}>
               Add Department +
            </Button>
          </div>

          {error && <p className="text-danger">{error}</p>}

          <Table responsive hover bordered className="custom-table shadow-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Department Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((dept, index) => (
                  <tr key={dept.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{dept.name}</td>
                    <td>{dept.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination className="custom-pagination">
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Pagination.Item>
                  )
                )}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </MainCard>
      </Col>

      {/* Add Department Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department name"
                value={newDept.name}
                onChange={(e) =>
                  setNewDept({ ...newDept, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={newDept.description}
                onChange={(e) =>
                  setNewDept({ ...newDept, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="btn-gradient" onClick={handleAddDepartment}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
