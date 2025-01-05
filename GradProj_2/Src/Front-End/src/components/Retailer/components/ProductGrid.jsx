import React from "react";
import { Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard.jsx";

const ProductGrid = ({
  products,
  favorites,
  handleFavorite,
  handleViewProduct,
  handleRequestProduct,
}) => {
  return (
    <Row>
      {(Object.keys(products).length !== 0) != 0 ? (
        Object.keys(products).map((key) => {
          const product = products[key];
          return (
            <Col md={4} sm={6} key={product.id} className="mb-4">
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
          No products yet!
        </h3>
      )}
    </Row>
  );
};

export default ProductGrid;
