import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../Providers/productsProvider.jsx";
import AppColors from "../../Theme/AppColors.jsx";
import companyLogo from "../../../assets/companyLogo.png";
import StatusColors from "../../Theme/StatusColors.jsx";
import productStatus from "../../Models/ProductStatus.jsx";
import supplierApi from "../../../api/supplierAPIs/supplier.js";
import { useAuth } from "../../Providers/authProvider.jsx";
import LoadingScreen from "../../Common/LoadingScreen.jsx";

/* 
  displaySupplierProductsById: {pageSize:10, pageNumber:, supId:} returns list of his products with data
*/

const ManageProducts = () => {
  const navigate = useNavigate();
  var { products, setProducts } = useProducts();
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);
  const { userData } = useAuth();
  var pageIndex = 1;

  useEffect(() => {
    const fetchProducts = async () => {
      const supId = userData.supplierDetails.supplierId;
      try {
        const response = await supplierApi.getOwnedProducts(
          supId,
          5, // pageSize
          pageIndex // pageIndex
        );
        if (response.body.success && response.body.error == "No Data Found") {
          console.log("no products found");
        } else if (response.body.success) {
          setProducts(
            response.body.productsList.productItem.reduce((acc, product) => {
              const statusId = parseInt(product.status);

              if (statusId != 3) {
                acc[product.id] = {
                  id: product.id,
                  name: product.name,
                  description: product.description || "No description", // Fallback for empty descriptions
                  statusId: statusId,
                  image: product.image || "No image available",
                  retailPrice: product.retailPrice,
                  unitPrice: product.unitPrice,
                  wholeSalePrice: product.wholeSalePrice,
                  category: product.categoryId,
                };
              }
              return acc; // Always return the accumulator
            }, {}) // Initialize as an empty object
          );
        } else console.log("idk: ", response);
      } catch (err) {
        setError("Failed to fetch supplier products data.", err);
        console.log("Failed to fetch supplier products data.", err);
      } finally {
        setLoading(false); // Stop the loading screen
      }
    };
    fetchProducts();
  }, [pageIndex]);

  if (loading) return <LoadingScreen />;

  return error ? (
    <p style={{ color: "red" }}>{error}</p>
  ) : (
    <Container className="p-4">
      <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
        <h2 className="fw-bold">Products</h2>
        <Button
          className="fw-bold px-4 py-2"
          onClick={() => {
            const isNewProduct = true;
            navigate("addProduct", {
              state: { isNewProduct },
            });
          }}
          style={{
            width: "max-content",
            backgroundColor: AppColors.primaryColor,
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
            border: "0",
            borderRadius: "3px",
            fontSize: "0.8rem",
          }}
        >
          Add Product
        </Button>
      </div>
      {(Object.keys(products).length !== 0) != 0 ? (
        Object.keys(products).map((key) => {
          const product = products[key];
          return (
            <Card
              key={product.id}
              className="mb-4 px-2 py-2"
              style={{
                borderRadius: "5px",
                border: "0",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Card.Body>
                <Row className="d-flex align-items-center justify-content-between">
                  <Col md={4} className="d-flex align-items-center gap-4">
                    <Col md={2} style={{ minWidth: "100px" }}>
                      <Card.Title className="fw-bold mb-0">
                        #{product.id}
                      </Card.Title>
                    </Col>
                    <Col md={1} style={{ width: "15%" }}>
                      <img
                        src={product.image || companyLogo}
                        alt={product.name}
                        style={{ width: "100%", objectFit: "contain" }}
                      ></img>
                    </Col>
                    <Col md="auto" style={{ minWidth: "50px" }}>
                      <p
                        className="fw-bold mb-0 text-center"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {product.name}
                      </p>
                    </Col>
                  </Col>
                  <Col
                    md={4}
                    className="d-flex align-items-center justify-content-end gap-4"
                  >
                    <a
                      className="fw-bold mb-0 w-25"
                      style={{
                        fontSize: "0.9rem",
                        color: "gray",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const isNewProduct = false;
                        navigate(`product/${product.id}`, {
                          state: { isNewProduct, product },
                        });
                      }}
                    >
                      Edit
                    </a>
                    <div
                      className="fw-bold mb-0 w-50"
                      style={{
                        fontSize: "0.8rem",
                        width: "100%",
                        padding: "10px",
                        backgroundColor:
                          StatusColors.productStatus[
                            productStatus[product.statusId]
                          ],
                        color: "white",
                        borderRadius: "5px",
                        textAlign: "center",
                      }}
                    >
                      {productStatus[product.statusId]}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <h3 className="d-flex align-content-center justify-content-center mt-5 text-muted">
          No products yet!
        </h3>
      )}
    </Container>
  );
};

export default ManageProducts;
