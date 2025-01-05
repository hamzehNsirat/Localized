import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../Providers/authProvider";

const QuotationsContext = createContext();

export const useQuotations = () => useContext(QuotationsContext);

export const QuotationsProvider = ({ children }) => {
  const [quotations, setQuotations] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();

  const navigate = useNavigate();

  // Function to add a new quotation
  const addQuotation = (quotation) => {
    const newQuotationId = quotation.id;
    setQuotations((prevQuotations) => ({
      ...prevQuotations,
      [newQuotationId]: quotation,
    }));

    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate(`/${user.role}/ManageQuotations`);
    }, 2000);
  };

  const updateQuotationPaymentMethod = (quotationId, newPaymentMethod) => {
    //console.log("Updating payment method:", quotationId, newPaymentMethod);
    setQuotations((prevQuotations) => {
      if (!prevQuotations[quotationId]) {
        console.error(`Quotation with ID ${quotationId} not found.`);
        return prevQuotations;
      }

      const updatedQuotations = {
        ...prevQuotations,
        [quotationId]: {
          ...prevQuotations[quotationId],
          paymentMethod: newPaymentMethod,
        },
      };

      //console.log("Updated Quotations:", updatedQuotations);
      return updatedQuotations;
    });
  };

  return (
    <QuotationsContext.Provider
      value={{ quotations, addQuotation, updateQuotationPaymentMethod }}
    >
      {children}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#e6e6e6" }}>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#efefef", textAlign: "center" }}>
          <p className="fw-bold">Quotation has been created successfully!</p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#e6e6e6" }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </QuotationsContext.Provider>
  );
};
