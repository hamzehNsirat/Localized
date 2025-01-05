import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Card, Form, Row, Col } from "react-bootstrap";
import AppColors from "../../Theme/AppColors.jsx";
import userIcon from "../../../assets/Camera.png";
import CustomInput from "../../Common/CustomInput.jsx";
import { useProducts } from "../../Providers/productsProvider.jsx";
import { useAuth } from "../../Providers/authProvider.jsx";
import industryTypes from "../../Models/IndustryTypes.jsx";
import supplierApi from "../../../api/supplierAPIs/supplier.js";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, uploadImage } = useAuth();
  const industryTypeId =
    userData.establishmentDetails.establishmentIndustryType[0];
  const { isNewProduct, product } = location.state || {};
  var [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);
  var pageIndex = 1;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await supplierApi.getCategories(
          industryTypeId,
          5, // pageSize
          pageIndex // pageIndex
        );
        if (response?.body.success && response?.body.error == "No Data Found") {
          console.log("no categories found");
        } else if (response?.body.success) {
          setCategories(
            response.body.categoryList.categoryItem.reduce((acc, category) => {
              acc[category.id] = {
                id: parseInt(category.id),
                name: category.name,
              };
              return acc;
            }, {})
          );
        } else console.log("idk: ", response);
      } catch (err) {
        setError("Failed to fetch supplier products data.", err);
      } finally {
        setLoading(false); // Stop the loading screen
      }
    };
    fetchCategories();
  }, [pageIndex]);
  // State for form fields
  const [formValues, setFormValues] = useState({
    name: product?.name || "",
    description: product?.description || "",
    retailPrice: product?.retailPrice || 0,
    wholesalePrice: product?.wholeSalePrice || 0,
    sellingPrice: product?.unitPrice || 0,
    category: product?.category,
    image: product?.image || null,
    status: product?.status || 2,
  });

  const { addProduct, deleteProduct } = useProducts();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value, // Handle file upload separately
    }));
  };

  // Handle form submission
  const handleSubmit = async (statusId) => {
    const supId = userData.supplierDetails.supplierId;

    try {
      const imgUrl = await uploadImage(formValues.image);

      if (!imgUrl || imgUrl == null) {
        console.log("Failed image upload");
        return false;
      }
      console.log("Image URL:", imgUrl);
      const response = await supplierApi.addProduct(
        supId,
        statusId,
        formValues.retailPrice,
        formValues.wholesalePrice,
        formValues.sellingPrice,
        formValues.category,
        formValues.description,
        imgUrl,
        formValues.name
      );
      if (response?.body.success) {
        const newProduct = {
          productId: response.body.productId,
          productStatusId: statusId,
          productUnitPrice: formValues.unitPrice,
          productWholeSalePrice: formValues.wholesalePrice,
          productRetailPrice: formValues.retailPrice,
          productUnitPriceDiscount: 0,
          productCategory: formValues.category,
          productDescription: formValues.description,
          productImage: null,
          productName: formValues.name,
        };
        addProduct(newProduct);
        console.log("product uploaded");
      } else {
        console.log("failed to upload product", response);
      }
    } catch (err) {
      console.error("error uploading product: ", err);
    }
  };
  const handleUpdate = async (statusId) => {
    const prodId = product.id;

    const isImageChanged = product.image == formValues.image ? false : true;

    try {
      var imgUrl = isImageChanged
        ? await uploadImage(formValues.image)
        : product.image;
      console.log("Image response:", imgUrl);
      if (!imgUrl || imgUrl == null) {
        console.log("Failed image upload");
        return false;
      }
      const response = await supplierApi.updateProduct(
        prodId,
        statusId,
        formValues.retailPrice == product.retailPrice
          ? null
          : formValues.retailPrice,
        formValues.wholesalePrice == product.wholeSalePrice
          ? null
          : formValues.wholesalePrice,
        formValues.sellingPrice == product.unitPrice
          ? null
          : formValues.sellingPrice,
        formValues.category == product.categoryId ? null : formValues.category,
        formValues.description == product.description
          ? null
          : formValues.description,
        imgUrl,
        formValues.name == product.name ? null : formValues.name
      );
      if (response.body.success) {
        const updatedProduct = {
          productId: response.body.productId,
          productStatusId: statusId,
          productUnitPrice: formValues.unitPrice,
          productWholeSalePrice: formValues.wholesalePrice,
          productRetailPrice: formValues.retailPrice,
          productUnitPriceDiscount: 0,
          productCategory: formValues.category,
          productDescription: formValues.description,
          productImage: null,
          productName: formValues.name,
        };
        addProduct(updatedProduct);
        console.log("product updated");
      } else {
        console.log("failed to updated product", response);
      }
    } catch (err) {
      console.error("error updating product: ", err);
    }
  };
  const handleDelete = () => {
    deleteProduct(product.id); // Delete the product
    navigate(-1); // Navigate back to the product list
  };
  return (
    <Container className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
        <h2 className="fw-bold">
          {isNewProduct ? "Add Product" : "Edit Product"}
        </h2>
        <Button
          className="fw-bold px-4 py-2"
          onClick={() => navigate(-1)}
          style={{
            width: "max-content",
            backgroundColor: AppColors.primaryColor,
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
            border: "0",
            borderRadius: "3px",
            fontSize: "0.8rem",
          }}
        >
          Back to Products
        </Button>
      </div>

      {/* Form */}
      <Card
        style={{ boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)" }}
        className="p-2"
      >
        <Card.Body>
          <Form>
            <Row>
              <Col md={7}>
                <CustomInput
                  className="mb-3"
                  label="Product Name"
                  labelClassName="fw-bold mb-0"
                  controlId="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold mb-0">
                    Product Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    style={{
                      borderRadius: "3px",
                      resize: "none",
                      boxShadow: "none",
                    }}
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <CustomInput
                      className="mb-3"
                      type="number"
                      label="Retail Price"
                      labelClassName="fw-bold mb-0"
                      controlId="retailPrice"
                      value={formValues.retailPrice}
                      onChange={handleInputChange}
                      required
                      min={0}
                      step={0.1}
                    />
                    <CustomInput
                      className="mb-3"
                      label="Industry"
                      labelClassName="fw-bold mb-0"
                      controlId="industry"
                      value={industryTypes[industryTypeId]}
                      onChange={handleInputChange}
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <CustomInput
                      className="mb-3"
                      type="number"
                      label="Wholesale Price"
                      labelClassName="fw-bold mb-0"
                      controlId="wholesalePrice"
                      value={formValues.wholesalePrice}
                      onChange={handleInputChange}
                      required
                      min={0}
                      step={0.1}
                    />
                    <Form.Group controlId="category" className="mb-3">
                      <Form.Label className="mb-0 fw-bold">Category</Form.Label>

                      {loading ? (
                        <p>Loading</p>
                      ) : (
                        <Form.Select
                          name="category"
                          value={formValues.category}
                          onChange={handleInputChange}
                          style={{
                            height: "2.5rem",
                            borderRadius: "3px",
                            boxShadow: "none",
                            outline: "none",
                          }}
                        >
                          <option key={0} value="">
                            Select Category
                          </option>
                          {Object.values(categories).map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <CustomInput
                      className="mb-3"
                      type="number"
                      label="Selling Price"
                      labelClassName="fw-bold mb-0"
                      controlId="sellingPrice"
                      value={formValues.sellingPrice}
                      onChange={handleInputChange}
                      required
                      min={0}
                      step={0.1}
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={5} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-0 fw-bold">
                    Product Image
                  </Form.Label>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      position: "relative",
                      width: "100%",
                      maxHeight: "250px",
                      border: "1px dashed #ccc",
                      borderRadius: "10px",
                      overflow: "hidden",
                      backgroundColor: "#f9f9f9",
                      cursor: "pointer",
                    }}
                  >
                    <label
                      htmlFor="upload-image"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={
                          formValues.image instanceof File
                            ? URL.createObjectURL(formValues.image)
                            : formValues.image ?? userIcon
                        }
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </label>

                    <Form.Control
                      type="file"
                      id="upload-image"
                      name="image"
                      accept=".jpeg, .jpg, .png"
                      onChange={handleInputChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between mt-4">
              <div className="d-flex gap-4">
                <Button
                  className="py-1"
                  style={{
                    backgroundColor: AppColors.primaryColor,
                    border: "none",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    isNewProduct ? handleSubmit(1) : handleUpdate(1);
                  }}
                >
                  {isNewProduct
                    ? "Publish Product"
                    : "Update & Publish Product"}
                </Button>
                {!isNewProduct && (
                  <Button
                    variant="danger"
                    onClick={() => handleUpdate(3)}
                    style={{
                      backgroundColor: "transparent",
                      color: "red",
                      border: "none",
                      textDecoration: "underline",
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <Button
                variant="dark"
                className="px-4 py-1"
                style={{
                  border: "none",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                  borderRadius: "5px",
                }}
                onClick={() => {
                  isNewProduct ? handleSubmit(2) : handleUpdate(2);
                }}
              >
                {isNewProduct ? "Save Draft" : "Update & Save Draft"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductForm;
