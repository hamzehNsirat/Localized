import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Image, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import coverPic from "../dumpAssets/coverPic.png";
import pic from "../dumpAssets/companyLogo.png";
import AppColors from "../../Theme/AppColors.jsx";
import { useFavorites } from "../../Providers/favoriteProvider.jsx";
import { useRequestedProducts } from "../../Providers/requestedProductsProvider.jsx";
import PopupProduct from "../components/PopupProduct.jsx";
import ProductCard from "../components/ProductCard.jsx";
import CustomButton from "../../Common/CustomButton.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import marketplaceApi from "../../../api/retailerAPIs/marketplace.js";
import LoadingScreen from "../../Common/LoadingScreen.jsx";
import PaginationComponent from "../../Common/PaginationComponent.jsx";
import updateApi from "../../../api/retailerAPIs/updates.js";

/* 
  getSupplierData: {prodId, supId} returns supplier's some of data:
      getSupplierProducts: {page:10, pageNumber:, supId}
      getSupplierReviews: {page:10, pageNumber:, supId}
*/

const SupplierProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reviewsRef = useRef(null);

  const { favorites, handleFavorite } = useFavorites();
  const [viewedProduct, setViewedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { supId } = location.state;
  const { requestedProducts, setRequestedProducts } = useRequestedProducts();

  var [products, setProducts] = useState({});
  var [reviews, setReviews] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplierData, setSupplierData] = useState(null);

  const hasUpdated = useRef(false); // Track if the view has been updated

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await marketplaceApi.getSupplierProfile(
          parseInt(supId),
          5,
          currentPage
        );

        if (response?.body?.success) {
          setSupplierData(response.body.supplierProfile);
          setProducts(
            response.body.supplierProfile.products.productItem.reduce(
              (acc, product) => {
                acc[product.id] = {
                  id: product.id,
                  name: product.name,
                  description: product.description || "No description", // Fallback for empty descriptions
                  image: product.image || "No image available",
                  retailPrice: product.retailPrice,
                  unitPrice: product.unitPrice,
                  wholeSalePrice: product.wholeSalePrice,
                  category: product.categoryId,
                };
                return acc; // Always return the accumulator
              },
              {}
            ) // Initialize as an empty object
          );
          setReviews(
            response.body.supplierProfile.reviews.reviewItem.reduce(
              (acc, review) => {
                acc[review.id] = {
                  id: review.id,
                  name: review.name,
                  comment: review.comment || "No comment available", // Fallback for empty descriptions
                  rating: review.rating,
                  companyName: review.companyName,
                  companyLogo: review.companyLogo,
                };
                return acc;
              },
              {}
            ) // Initialize as an empty object
          );
        } else console.log("idk: ", response);
      } catch (err) {
        setError("Failed to fetch supplier profile data.", err);
        console.log("Failed to fetch supplier profile data.", err);
      } finally {
        setLoading(false); // Stop the loading screen
      }
    };

    fetchSupplier();
  }, [currentPage]);

  useEffect(() => {
    const updateView = async () => {
      if (!hasUpdated.current) {
        // Check if it's already updated
        hasUpdated.current = true; // Mark it as updated
        try {
          const response = await updateApi.updateSupplierViews(parseInt(supId));
          if (response?.body?.success) {
            console.log("Supplier view updated successfully");
          } else {
            console.error("Failed to update supplier views", response);
          }
        } catch (err) {
          console.error("Error updating supplier views", err);
        }
      }
    };

    updateView();
  }, []); // Empty dependency array ensures it only runs once

  const handleViewProduct = (product) => {
    setViewedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleRequestProduct = (product) => {
    if (
      !requestedProducts.some((p) => parseInt(p.id) === parseInt(product.id))
    ) {
      setRequestedProducts([...requestedProducts, product]);
    }
  };

  const handleExitQuotation = () => {
    navigate(-1);
  };

  const handleQuotationDetails = () => {
    navigate(
      `/retailer/marketplace/${supplierData.supplierEstablishmentName}/products/newQuotation`,
      { state: { supId, supplierData } }
    );
  };

  const scrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const totalPages = Math.ceil(Object.keys(products).length / productsPerPage);

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ paddingBottom: "50px", overflow: "hidden" }}>
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          {supplierData.supplierEstablishmentCover && (
            <Row>
              <img
                src={supplierData.supplierEstablishmentCover}
                style={{ height: "140px", objectFit: "cover" }}
                loading="lazy"
                alt="Cover"
                className="px-0"
              />
            </Row>
          )}
          <Container className="mt-2">
            <Row
              className={
                supplierData.supplierEstablishmentCover
                  ? ""
                  : `align-items-center`
              }
            >
              <div style={{ width: "100px", position: "relative" }}>
                <img
                  src={supplierData.supplierEstablishmentLogo}
                  loading="lazy"
                  alt="Logo"
                  width="110px"
                  height="110px"
                  style={{
                    position: supplierData.supplierEstablishmentCover
                      ? "absolute"
                      : "relative",
                    top: supplierData.supplierEstablishmentCover ? "-50%" : "",
                    borderRadius: "100px",
                    filter: "drop-shadow(0px 0px 10px rgba(0,0,0,0.3))",
                  }}
                />
              </div>
              <Col style={{ marginLeft: "3%" }}>
                <h2 className="fw-bold mb-0">
                  {supplierData.supplierEstablishmentName}
                </h2>
                <div className="d-flex align-items-center align-content-center gap-2">
                  <div>
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        viewBox="0 0 24 24"
                        fill={
                          index < (supplierData.overallRating || 0)
                            ? "black"
                            : "none"
                        }
                        stroke="black"
                        style={{
                          width: "15px",
                          height: "15px",
                        }}
                      >
                        <polygon points="12 2 15 8.5 22 9.5 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.5 9 8.5" />
                      </svg>
                    ))}
                  </div>
                  <a
                    className="text-muted"
                    style={{
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                    onClick={scrollToReviews}
                  >
                    ({supplierData.totalReviews} Reviews)
                  </a>
                </div>
                <p className="text-muted mt-0">Food and Beverage</p>
              </Col>
            </Row>

            <Row className="my-4">
              {(Object.keys(products).length !== 0) != 0 ? (
                Object.keys(products).map((key) => {
                  const product = products[key];
                  return (
                    <Col md={3} key={product.id} className="mb-4">
                      <ProductCard
                        product={product}
                        favorites={favorites}
                        handleFavorite={handleFavorite}
                        handleViewProduct={handleViewProduct}
                        handleRequestProduct={handleRequestProduct}
                      />
                    </Col>
                  );
                })
              ) : (
                <h3 className="d-flex align-content-center justify-content-center mt-5 text-muted">
                  No Other Products For This Supplier Yet!
                </h3>
              )}
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Row>

            <Row
              className="fixed-bottom p-3 border-top"
              style={{ backgroundColor: AppColors.primaryColor, border: "0" }}
            >
              <Col className="d-flex align-items-center">
                <div className="d-flex overflow-auto">
                  {requestedProducts.map((product) => (
                    <Image
                      key={product.id}
                      src={product.image}
                      alt={product.title}
                      className="requested-product-image mx-1"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                        backgroundColor: "white",
                        borderRadius: "10px",
                      }}
                    />
                  ))}
                </div>
                <CustomButton
                  label="Proceed"
                  style={{ width: "13%" }}
                  className="ms-auto me-2"
                  onClick={handleQuotationDetails}
                />
                <Button
                  onClick={handleExitQuotation}
                  style={{
                    width: "13%",
                    backgroundColor: "transparent",
                    textDecoration: "underline white",
                    border: "0",
                  }}
                >
                  Exit Quotation
                </Button>
              </Col>
            </Row>

            <section className="my-4 mb-5" ref={reviewsRef}>
              <h4>Customer Reviews</h4>
              <Row className="g-4 mt-3">
                {(Object.keys(supplierData.reviews.reviewItem).length !== 0) !=
                0 ? (
                  Object.keys(reviews).map((key, index) => {
                    const review = reviews[key];
                    return (
                      <Col md={6} key={index}>
                        <ReviewCard
                          logo={review.companyLogo}
                          rating={review.rating}
                          companyName={review.companyName}
                          description={review.comment}
                        />
                      </Col>
                    );
                  })
                ) : (
                  <h3 className="d-flex align-content-center justify-content-center mt-2 text-muted">
                    No reviews recieved yet!
                  </h3>
                )}
              </Row>
            </section>

            {viewedProduct && (
              <PopupProduct
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                selectedProduct={viewedProduct}
                handleFavorite={handleFavorite}
                justView={true}
              />
            )}
          </Container>
        </>
      )}
    </div>
  );
};

export default SupplierProducts;
