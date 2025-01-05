import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../Providers/authProvider";

const ComplaintsContext = createContext();

export const useComplaints = () => useContext(ComplaintsContext);

export const ComplaintsProvider = ({ children }) => {
  const [complaints, setComplaints] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();

  const navigate = useNavigate();

  // Function to add a new quotation
  const addComplaint = (complaint) => {
    const newComplaintId = complaint.id;
    setComplaints((prevComplaints) => ({
      ...prevComplaints,
      [newComplaintId]: complaint,
    }));

    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      const userNavigate = {
        2: "retailer",
        3: "supplier",
      };
      navigate(`/${userNavigate[user.role]}/complaints`);
    }, 2000);
  };

  return (
    <ComplaintsContext.Provider value={{ complaints, addComplaint }}>
      {children}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#e6e6e6" }}>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#efefef", textAlign: "center" }}>
          <p className="fw-bold">Complaint has been created successfully!</p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#e6e6e6" }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </ComplaintsContext.Provider>
  );
};
