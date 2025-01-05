import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditableModal = ({
  show,
  title,
  label,
  value,
  onClose,
  onSave,
  onChange,
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="editableValue">
          <Form.Label>{label}</Form.Label>
          <Form.Control
            type="number"
            value={value}
            onChange={onChange}
            min="0"
            step="0.01"
            style={{
              height: "2.5rem",
              boxShadow: "none",
              borderRadius: "3px",
            }}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditableModal;
