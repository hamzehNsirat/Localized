import React from "react";
import { Card } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import MarketplaceStyles from "../styles/MarketplaceStyles";
import CustomButton from "../../Common/CustomButton.jsx";

const ProductCard = ({
  product,
  favorites,
  handleFavorite,
  handleViewProduct,
  handleRequestProduct,
}) => {
  const isFavorite = favorites.includes(product.id) ? (
    <FaHeart
      className="w-25 fs-5 text-danger"
      onClick={() => handleFavorite(product.title, product.id)}
      style={{ ...MarketplaceStyles.iconStyle }}
    />
  ) : (
    <FaRegHeart
      className="w-25 fs-5"
      onClick={() => handleFavorite(product.title, product.id)}
      style={{ ...MarketplaceStyles.iconStyle }}
    />
  );
  return (
    <Card
      className="h-100 text-center d-flex flex-column justify-content-center align-items-center"
      style={{
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#FFFFFF",
        border: "none",
      }}
    >
      <div
        className="p-2 mb-0 d-flex justify-content-center"
        style={{ backgroundColor: "white" }}
      >
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          style={{ width: "max-content", objectFit: "contain" }}
        />
      </div>
      <Card.Body className="w-75 px-0">
        <Card.Title className="mt-0 fw-bold">{product.name}</Card.Title>
        <Card.Text>{product.factoryName}</Card.Text>
        <CustomButton
          label="Add to cart"
          className="w-100 fw-bold"
          style={{ fontSize: "0.8rem", height: "2rem", borderRadius: "5px" }}
          onClick={() => {
            handleRequestProduct(product);
          }}
        />
        <div className="d-flex align-items-center w-100 mt-2">
          <CustomButton
            label="View"
            className="text-light w-75"
            style={{
              ...MarketplaceStyles.buttonStyle,
              fontSize: "0.8rem",
              height: "2rem",
              borderRadius: "5px",
            }}
            onClick={() => handleViewProduct(product)}
          />
          {isFavorite}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
