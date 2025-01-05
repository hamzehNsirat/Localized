import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import MarketplaceStyles from "../styles/MarketplaceStyles";
import marketplaceApi from "../../../api/retailerAPIs/marketplace";
import retailerApi from "../../../api/retailerAPIs/retailer";
import { useAuth } from "../../Providers/authProvider";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  industryTypes,
  categories,
  setProducts,
  setLoading,
}) => {
  const { userData } = useAuth();
  const fetchMarketPlaceProducts = async () => {
    const retId = parseInt(userData.retailerDetails.retailerId);
    try {
      const response = await retailerApi.getRetailerMarketplace(retId, 5, 1);
      if (response.body.success) {
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
      } else console.log("idk: ", response);
    } catch (err) {
      console.log("Failed to fetch supplier products data.", err);
    } finally {
      setLoading(false); // Stop the loading screen
    }
  };
  const handleSearch = async () => {
    if (
      (searchTerm == "" || searchTerm == null) &&
      industryTypes.length == 0 &&
      categories.length == 0
    ) {
      fetchMarketPlaceProducts();
      return;
    }
    setLoading(true);
    try {
      const payload = {
        searchTerm: searchTerm == null ? "" : searchTerm,
        industryList: industryTypes.length <= 0 ? null : industryTypes,
        categoriesList: categories.length <= 0 ? null : categories,
        ownerId: parseInt(userData.retailerDetails.retailerId),
        searcherType: true,
        pageSize: 10,
        pageIndex: 1,
      };
      const response = await marketplaceApi.searchProducts(payload);

      if (response?.body.success) {
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
      } else console.log("idk: ", response);
    } catch (err) {
      console.log("Failed to fetch supplier products data.", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <InputGroup>
        <FormControl
          placeholder="Search"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ borderRadius: "3px" }}
        />
        <InputGroup.Text
          style={{
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
          }}
        >
          <FaSearch
            style={{ ...MarketplaceStyles.iconStyle }}
            onClick={handleSearch}
          />
        </InputGroup.Text>
      </InputGroup>
    </div>
  );
};

export default SearchBar;
