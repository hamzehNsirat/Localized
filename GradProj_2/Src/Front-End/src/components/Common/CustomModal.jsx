import React from "react";
import { Modal, Button } from "react-bootstrap";

const CustomModal = ({
  show,
  onHide,
  title = "Modal Title",
  bodyContent = "This is the body content.",
  footerContent,
  onCloseText = "Close",
  customStyles = {},
}) => {
  const { headerStyle = {}, bodyStyle = {}, footerStyle = {} } = customStyles;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#e6e6e6", ...headerStyle }}
      >
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: "#efefef",
          textAlign: "center",
          ...bodyStyle,
        }}
      >
        {typeof bodyContent === "string" ? (
          <p className="fw-bold">{bodyContent}</p>
        ) : (
          bodyContent
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#e6e6e6", ...footerStyle }}>
        {footerContent || (
          <Button variant="secondary" onClick={onHide}>
            {onCloseText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
