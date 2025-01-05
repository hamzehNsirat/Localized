import React, { useState, useRef } from "react";
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

const SupplierProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reviewsRef = useRef(null);

  const { favorites, handleFavorite } = useFavorites();
  const [viewedProduct, setViewedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { companyName, companyProducts } = location.state;
  const { requestedProducts, setRequestedProducts } = useRequestedProducts();

  const handleViewProduct = (product) => {
    setViewedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleRequestProduct = (product) => {
    if (!requestedProducts.some((p) => p.id === product.id)) {
      setRequestedProducts([...requestedProducts, product]);
    }
  };

  const handleExitQuotation = () => {
    navigate(-1);
  };

  const handleQuotationDetails = () => {
    navigate(`/retailer/marketplace/${companyName}/products/newQuotation`);
  };

  const scrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const reviews = [
    {
      logo: pic,
      rating: 4.5,
      companyName: "TasteBites Inc.",
      description:
        "TasteBites Inc. delivers fresh, high-quality ingredients to elevate your culinary experience. A trusted partner for food enthusiasts.",
    },
    {
      logo: pic,
      rating: 4.2,
      companyName: "Healthy Harvest Foods",
      description:
        "A pioneer in organic and sustainable food products, Healthy Harvest Foods is your go-to for healthy living.",
    },
    {
      logo: pic,
      rating: 4.8,
      companyName: "Flavor Fusion Co.",
      description:
        "Flavor Fusion Co. specializes in exotic spices and sauces, bringing the world’s flavors to your doorstep.",
    },
    {
      logo: pic,
      rating: 4.0,
      companyName: "SnackMakers",
      description:
        "SnackMakers crafts delicious, ready-to-eat snacks with an emphasis on taste and quality.",
    },
    {
      logo: pic,
      rating: 4.6,
      companyName: "FarmFresh Produce",
      description:
        "FarmFresh Produce connects farmers directly to your kitchen, ensuring the freshest fruits and vegetables every time.",
    },
  ];

  return (
    <div style={{ paddingBottom: "50px" }}>
      <Row>
        <img
          src={coverPic}
          style={{ height: "140px", objectFit: "cover" }}
          alt="Cover"
        />
      </Row>
      <Container className="mt-2">
        <Row>
          <div style={{ width: "100px", position: "relative" }}>
            <img
              src={pic}
              alt="Logo"
              width="110px"
              height="110px"
              style={{
                position: "absolute",
                top: "-50%",
                borderRadius: "100px",
                filter: "drop-shadow(0px 0px 10px rgba(0,0,0,0.3))",
              }}
            />
          </div>
          <Col style={{ marginLeft: "3%" }}>
            <h2 className="fw-bold mb-0">{companyName}</h2>
            <div className="d-flex align-items-center align-content-center gap-2">
              <div>
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    viewBox="0 0 24 24"
                    fill={index <= 3 ? "black" : "none"}
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
                ({reviews.length} Reviews)
              </a>
            </div>
            <p className="text-muted mt-0">Food and Beverage</p>
          </Col>
        </Row>

        <Row className="my-4">
          {companyProducts.map((product) => (
            <Col md={3} key={product.id} className="mb-4">
              <ProductCard
                product={product}
                favorites={favorites}
                handleFavorite={handleFavorite}
                handleViewProduct={handleViewProduct}
                handleRequestProduct={handleRequestProduct}
              />
            </Col>
          ))}
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

        <section className="my-4" ref={reviewsRef}>
          <h4>Customer Reviews</h4>
          <Row className="g-4 mt-3">
            {reviews.map((review, index) => (
              <Col md={6} key={index}>
                <ReviewCard
                  logo={review.logo}
                  rating={review.rating}
                  companyName={review.companyName}
                  description={review.description}
                />
              </Col>
            ))}
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
    </div>
  );
};

export default SupplierProducts;
