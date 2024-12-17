// Controls the Route / Service Interaction for the following:
/*
----------------------------
-- PRODUCT Retailer CYCLE --
- Get Retailer Marketplace 
- Get Retailer Products By Category
- Search Retailer Products
- Get Supplier Profile
----------------------------
-- PRODUCT Supplier CYCLE --
- Get Supplier Products
- Add Product
- Update Product Details & Status
- Get Supplier Marketplace
- Search Supplier Products
----------------------------
*/
const productService = require("../services/productService");
const errorHandler = require("../middlewares/errorHandler");
const getRetMarketplaceProducts = async (req, res) => {
  try {
    if (
      req.body.retailerId == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0035");
    }
    const result = await productService.getRetMarketplaceProducts(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0036", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0036");
  }
};
const getRetProductsByCategory = async (req, res) => {
  try {
    if (
      (req.body.industryList == null && req.body.categoriesList == null) ||
      req.body.pageIndex == null ||
      req.body.pageSize == null
    ) {
      return errorHandler.handleError(res, "E0037");
    }
    const result = await productService.getRetProductsByCategory(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0036", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0036");
  }
};
const searchProducts = async (req, res) => {
  try {
    if (
      req.body.searchTerm == null ||
      req.body.pageIndex == null ||
      req.body.pageSize == null
    ) {
      return errorHandler.handleError(res, "E0038");
    }
    const result = await productService.searchProducts(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0039", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0039");
  }
};
const getRetSupplierProducts = async (req, res) => {
  try {
    if (
      req.body.supplierId == null ||
      req.body.pageIndex == null ||
      req.body.pageSize == null
    ) {
      return errorHandler.handleError(res, "E0040");
    }
    const result = await productService.getRetSupplierProducts(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0039", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0039");
  }
};
const getSupplierMarketplace = async (req, res) => {
  try {
    if (
      req.body.supplierId == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0070");
    }
    const result = await productService.getSupplierMarketplace(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0071", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0071");
  }
};
const getSupplierOwnedProducts = async (req, res) => {
  try {
    if (
      req.body.supplierId == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0070");
    }
    const result = await productService.getSupplierOwnedProducts(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0072", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0072");
  }
};
const addProduct = async (req, res) => {
  try {
    if (
      req.body.supplierId == null ||
      req.body.productStatusId == null ||
      req.body.productUnitPrice == null ||
      req.body.productWholeSalePrice == null ||
      req.body.productRetailPrice == null ||
      req.body.productUnitPriceDiscount == null ||
      req.body.productCategory == null ||
      req.body.productDescription == null ||
      req.body.productImage == null ||
      req.body.productName == null
    ) {
      return errorHandler.handleError(res, "E0073");
    }
    const result = await productService.addProduct(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0074", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0074");
  }
};
const updateProduct = async (req, res) => {
  try {
    if (
      req.body.productId == null
    ) {
      return errorHandler.handleError(res, "E0075");
    }
    const result = await productService.updateProduct(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0076", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0076");
  }
};
const getCategories = async (req, res) => {
  try {
    if (
      req.body.industryType == null 
    ) {
      return errorHandler.handleError(res, "E0087");
    }
    const result = await productService.getCategories(req.body.industryType);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0072", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0072");
  }
};

module.exports = {
  getRetMarketplaceProducts,
  getRetProductsByCategory,
  searchProducts,
  getRetSupplierProducts,
  getSupplierMarketplace,
  getSupplierOwnedProducts,
  addProduct,
  updateProduct,
  getCategories,
};
