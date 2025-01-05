import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRequestedProducts } from "../../Providers/requestedProductsProvider";
import AppColors from "../../Theme/AppColors";

const PopupProduct = ({
  showModal,
  handleCloseModal,
  selectedProduct,
  handleFavorite,
  justView,
  companyProducts,
  handleRequestProduct,
}) => {
  const navigate = useNavigate();

  const { requestedProducts, setRequestedProducts } = useRequestedProducts();

  const handleViewProduct = (selectedProduct) => {
    handleRequestProduct(selectedProduct);
  };

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      centered
      size="lg"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <Modal.Header closeButton={true} style={{ backgroundColor: "#e6e6e6" }}>
        <h5 className="modal-title">{selectedProduct.name}</h5>
      </Modal.Header>
      <Modal.Body closeButton style={{ backgroundColor: "#efefef" }}>
        <div
          className="d-flex gap-3"
          style={{ marginRight: "20px", width: "100%" }}
        >
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            style={{ width: "40%", objectFit: "contain" }}
          />
          <div style={{ textAlign: "left", width: "55%" }}>
            <h2 className="fw-bold">{selectedProduct.name}</h2>
            <h6 className="text-muted">{selectedProduct.company}</h6>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column align-items-start">
                <h5
                  className="mb-0 fw-bold"
                  style={{ color: "#C1272D", letterSpacing: "0.05rem" }}
                >
                  {selectedProduct.wholeSalePrice} - {selectedProduct.unitPrice}{" "}
                  JOD
                </h5>
                <p className="text-muted mt-0" style={{ fontSize: "0.7rem" }}>
                  Buying price
                </p>
              </div>
              <div className="d-flex flex-column align-items-start">
                <h5
                  className="mb-0 fw-bold"
                  style={{ letterSpacing: "0.05rem" }}
                >
                  {selectedProduct.retailPrice} JOD
                </h5>
                <p className="text-muted mt-0" style={{ fontSize: "0.7rem" }}>
                  Selling price
                </p>
              </div>
              <div className="d-flex flex-column align-items-start">
                <h5
                  className="mb-0 fw-bold"
                  style={{
                    color: AppColors.primaryColor,
                    letterSpacing: "0.05rem",
                  }}
                >
                  {(
                    selectedProduct.retailPrice - selectedProduct.wholeSalePrice
                  ).toFixed(2)}{" "}
                  -{" "}
                  {(
                    selectedProduct.retailPrice - selectedProduct.unitPrice
                  ).toFixed(2)}
                  JOD
                </h5>
                <p className="text-muted mt-0" style={{ fontSize: "0.7rem" }}>
                  Expected Profit Margin
                </p>
              </div>
            </div>
            <p style={{ fontSize: "0.9rem" }}>{selectedProduct.description}</p>
          </div>
        </div>
        {!justView && (
          <div className="fw-bold">
            <Button
              onClick={() => handleViewProduct(selectedProduct)}
              variant="dark"
              className="w-100 my-2 mt-4 fs-6"
            >
              Add to cart
            </Button>
            <Button
              onClick={() => handleFavorite(selectedProduct.id)}
              style={{ backgroundColor: AppColors.primaryColor }}
              className="w-100 fs-6"
            >
              Add to Favorites
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PopupProduct;
