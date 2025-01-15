import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFavorites } from "../../Providers/favoriteProvider.jsx";
import { useRequestedProducts } from "../../Providers/requestedProductsProvider.jsx";
import Sidebar from "../components/Sidebar.jsx";
import PopupProduct from "../components/PopupProduct.jsx";
import SearchBar from "../components/SearchBar.jsx";
import {
  filterProducts,
  filterProductsByCompany,
} from "../services/productService.js";
import PaginationComponent from "../../Common/PaginationComponent.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

import "../styles/Products.css";
import retailerApi from "../../../api/retailerAPIs/retailer.js";
import { useAuth } from "../../Providers/authProvider.jsx";
import { variance } from "@visactor/vchart/esm/util/math.js";
import LoadingScreen from "../../Common/LoadingScreen.jsx";

/* 
  displayProductsByPage: {page:10, pageNumber:, retId:} returns list of products with data
  displayProductsByPageByFilter: {page:10, pageNumber:, retId: industryTypse:, mainCategories:} returns list of products with data
  searchProducts: {page:10, pageNumber:, searchTerm: {productName, category, factoryName}, displayProductsByPageByFilter()} returns list of products with data
  getSupplierData: {supId} returns supplier's some of data
  */

const Marketplace = () => {
  const navigate = useNavigate();
  const { favorites, handleFavorite } = useFavorites();
  const { requestedProducts, setRequestedProducts } = useRequestedProducts();
  const { userData } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ favorites: false });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [totalProducts, setTotalProducts] = useState(0); // Track next page availability

  var [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);

  const [industryTypes, setIndustryTypes] = useState([]); // Selected industry types
  const [categories, setCategories] = useState([]); // Selected categories types
  const handleIndustryToggle = (industryTypeId) => {
    setIndustryTypes((prev) =>
      prev.includes(industryTypeId)
        ? prev.filter((id) => id !== industryTypeId)
        : [...prev, industryTypeId]
    );
  };

  const handleCategoryToggle = (categoryId) => {
    // Toggle category selection
    setCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const mainCategories =
    userData.establishmentDetails.establishmentIndustryType;
  useEffect(() => {
    const fetchMarketPlaceProducts = async () => {
      const retId = parseInt(userData.retailerDetails.retailerId);
      try {
        const response = await retailerApi.getRetailerMarketplace(
          retId,
          productsPerPage,
          currentPage
        );
        if (response?.body?.success) {
          setProducts(
            response.body.marketPlace.productItem.map((product) => ({
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
            }))
          );
          if (totalProducts == 0)
            setTotalProducts(parseInt(response.body.totalRecordsCount));
        } else console.log("idk: ", response);
      } catch (err) {
        setError("Failed to fetch supplier products data.", err);
        console.log("Failed to fetch supplier products data.", err);
      } finally {
        setLoading(false); // Stop the loading screen
      }
    };
    fetchMarketPlaceProducts();
  }, [currentPage]);

  useEffect(() => {
    setRequestedProducts([]);
    setFilteredProducts(filterProducts("", filters, favorites));
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleRequestProduct = (product) => {
    setRequestedProducts([...requestedProducts, product]);

    const companyName = product.company ?? "company";
    const supId = product.supplier;

    navigate(`/retailer/marketplace/${companyName}/products`, {
      state: { supId },
    });
  };

  const handleCloseModal = () => setShowModal(false);

  if (loading) <LoadingScreen />;

  return (
    <Container className="my-0">
      <Row>
        <Col md={3} className="pe-4">
          <Sidebar
            filters={filters}
            setFilters={setFilters}
            mainCategories={mainCategories}
            industryTypes={industryTypes}
            setIndustryTypes={setIndustryTypes}
            handleIndustryToggle={handleIndustryToggle}
            categories={categories}
            setCategories={setCategories}
            handleCategoryToggle={handleCategoryToggle}
          />
        </Col>
        <Col md={9} className="my-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            industryTypes={industryTypes}
            categories={categories}
            setProducts={setProducts}
            setLoading={setLoading}
          />
          <ProductGrid
            products={products}
            favorites={favorites}
            handleFavorite={handleFavorite}
            handleViewProduct={handleViewProduct}
            handleRequestProduct={handleRequestProduct}
          />
          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(totalProducts / productsPerPage)}
            onPageChange={setCurrentPage}
          />
        </Col>
      </Row>
      {selectedProduct && (
        <PopupProduct
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          selectedProduct={selectedProduct}
          companyProducts={filterProductsByCompany(selectedProduct.company)}
          handleFavorite={handleFavorite}
          handleRequestProduct={handleRequestProduct}
        />
      )}
    </Container>
  );
};

export default Marketplace;
