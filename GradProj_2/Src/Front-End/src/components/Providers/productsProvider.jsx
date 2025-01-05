import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import pic from "../../assets/companyLogo.png";
import productStatus from "../Models/ProductStatus";

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null); // State for the last added product

  const navigate = useNavigate();

  const addProduct = (product) => {
    const newProductId = product.id;
    setProducts((prevProducts) => ({
      ...prevProducts,
      [newProductId]: product,
    }));

    setAddedProduct(product);
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate("/supplier/products");
    }, 2000);
  };

  const deleteProduct = (id) => {
    setProducts((prevProducts) => {
      const updatedProducts = { ...prevProducts };
      delete updatedProducts[id]; // Remove product by ID
      return updatedProducts;
    });
  };

  return (
    <ProductsContext.Provider
      value={{ products, setProducts, addProduct, deleteProduct }}
    >
      {children}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#e6e6e6" }}>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#efefef", textAlign: "center" }}>
          <p className="fw-bold">
            Product{" "}
            <strong>{addedProduct ? addedProduct.name : "Unknown"}</strong> has
            been added successfully!
          </p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#e6e6e6" }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </ProductsContext.Provider>
  );
};
