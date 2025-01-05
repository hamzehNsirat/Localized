import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import PopupProduct from "../components/PopupProduct.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { filterProducts } from "../services/productService.js";
import PaginationComponent from "../components/PaginationComponent.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

import "../styles/Products.css";
import supplierApi from "../../../api/supplierAPIs/supplier.js";
import { useAuth } from "../../Providers/authProvider.jsx";

/* 
  displayProductsByPage: {page:10, pageNumber:, supId:} returns depending on his industry type a list of products with data
  searchProducts: {page:10, pageNumber:, searchTerm: {productName, category, factoryName}, displayProductsByPageByFilter()} returns list of products with data
*/

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { userData } = useAuth();
  const [products, setProducts] = useState({});

  const productsPerPage = 12;

  const handleSearch = () => {
    setFilteredProducts(filterProducts(searchTerm));
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchMarketPlaceProducts = async () => {
      try {
        const payload = {
          supplierId: parseInt(userData.supplierDetails.supplierId),
          pageSize: 5,
          pageIndex: 1,
        };
        const response = await supplierApi.getSupplierMarketplace(payload);
        if (response?.body.success) {
          console.log(response.body);
          setProducts(
            response.body.marketPlace.productItem.reduce((acc, product) => {
              acc[product.id] = {
                id: product.id,
                name: product.name,
                description: product.description || "No description", // Fallback for empty descriptions
                image: product.image || "No image available",
                retailPrice: product.retailPrice,
                unitPrice: product.unitPrice,
                wholeSalePrice: product.wholeSalePrice,
                category: product.categoryId,
                factoryName: product.establishmentName,
                supplier: product.supplier,
              };
              return acc; // Always return the accumulator
            }, {}) // Initialize as an empty object
          );
        }
      } catch (err) {}
    };
    fetchMarketPlaceProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(filterProducts(""));
  }, []);
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <Container className="my-0 w-100">
      <Row className="mt-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
      </Row>
      <Row className="w-100">
        <Col className="my-4">
          <ProductGrid
            products={products}
            handleViewProduct={handleViewProduct}
          />
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Col>
      </Row>
      {selectedProduct && (
        <PopupProduct
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          selectedProduct={selectedProduct}
        />
      )}
    </Container>
  );
};

export default Marketplace;
