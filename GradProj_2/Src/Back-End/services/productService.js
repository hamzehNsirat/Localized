// Manages product-related business logic
const Product = require("../models/Product");
const Category = require("../models/Category");
const {
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/database");

const productService = {
  async getRetMarketplaceProducts(inputData) {
    try {
      const retMarketPlaceResult = await Product.getMarketplaceProducts(
        inputData.retailerId,
        inputData.pageSize,
        inputData.pageIndex
      );
      const marketPlace = { productItem: [] };
      for (let i = 0; i < retMarketPlaceResult.length; i++) {
        const item = {
          id: retMarketPlaceResult[i].out_product_id,
          name: retMarketPlaceResult[i].out_product_name,
          description: retMarketPlaceResult[i].out_product_description,
          image: retMarketPlaceResult[i].out_product_image,
          retailPrice: retMarketPlaceResult[i].out_product_retail_price,
          unitPrice: retMarketPlaceResult[i].out_product_unit_price,
          wholeSalePrice: retMarketPlaceResult[i].out_product_whole_sale_price,
          supplier: retMarketPlaceResult[i].out_product_supplier,
          categoryId: retMarketPlaceResult[i].out_product_category,
          establishmentName: retMarketPlaceResult[i].out_establishment_name,
        };
        marketPlace.productItem.push(item);
      }
      if (!retMarketPlaceResult) {
        return {
          success: false,
          error: "Unable to Fetch MarketPlace for Retailer",
        };
      }
      return {
        success: true,
        marketPlace: marketPlace,
      };
    } catch (error) {
      throw error;
    }
  },
  async getRetProductsByCategory(inputData) {
    try {
      const retMarketPlaceResult =
        await Product.fetchProductsByIndustryAndCategory(
          inputData.industryList,
          inputData.categoriesList,
          inputData.pageSize,
          inputData.pageIndex
        );
      if (!retMarketPlaceResult) {
        return {
          success: false,
          error: "Unable to Fetch MarketPlace for Retailer",
        };
      }
      const marketPlace = { productItem: [] };
      for (let i = 0; i < retMarketPlaceResult.length; i++) {
        const item = {
          id: retMarketPlaceResult[i].out_product_id,
          name: retMarketPlaceResult[i].out_product_name,
          description: retMarketPlaceResult[i].out_product_description,
          image: retMarketPlaceResult[i].out_product_image,
          retailPrice: retMarketPlaceResult[i].out_product_retail_price,
          unitPrice: retMarketPlaceResult[i].out_product_unit_price,
          wholeSalePrice: retMarketPlaceResult[i].out_product_whole_sale_price,
          supplier: retMarketPlaceResult[i].out_supplier_id,
          categoryId: retMarketPlaceResult[i].out_product_category,
          establishmentName: retMarketPlaceResult[i].out_establishment_name,
        };
        marketPlace.productItem.push(item);
      }
      if (!retMarketPlaceResult) {
        return {
          success: false,
          error: "Unable to Fetch MarketPlace for Retailer",
        };
      }
      return {
        success: true,
        marketPlace: marketPlace,
        totalRecordsCount: retMarketPlaceResult[0].total_records_count,
      };
    } catch (error) {
      throw error;
    }
  },
  async searchProducts(inputData) {
    try {
      const retMarketPlaceResult = await Product.searchProducts(
        inputData.searchTerm,
        inputData.pageSize,
        inputData.pageIndex
      );
      if (!retMarketPlaceResult) {
        return {
          success: false,
          error: "Unable to Fetch MarketPlace for Retailer",
        };
      }
      const marketPlace = { productItem: [] };
      for (let i = 0; i < retMarketPlaceResult.length; i++) {
        const item = {
          id: retMarketPlaceResult[i].out_product_id,
          name: retMarketPlaceResult[i].out_product_name,
          description: retMarketPlaceResult[i].out_product_description,
          image: retMarketPlaceResult[i].out_product_image,
          retailPrice: retMarketPlaceResult[i].out_product_retail_price,
          unitPrice: retMarketPlaceResult[i].out_product_unit_price,
          wholeSalePrice: retMarketPlaceResult[i].out_product_whole_sale_price,
          supplier: retMarketPlaceResult[i].out_supplier_id,
          categoryId: retMarketPlaceResult[i].out_product_category,
          establishmentName: retMarketPlaceResult[i].out_establishment_name,
        };
        marketPlace.productItem.push(item);
      }
      if (!retMarketPlaceResult) {
        return {
          success: false,
          error: "Unable to Fetch MarketPlace for Retailer",
        };
      }
      return {
        success: true,
        marketPlace: marketPlace,
        totalRecordsCount: retMarketPlaceResult[0].total_records_count,
      };
    } catch (error) {
      throw error;
    }
  },
  async getRetSupplierProducts(inputData) {
    try {
      const retMarketPlaceResult = await Product.getSupplierDetails(
        inputData.supplierId,
        inputData.pageSize,
        inputData.pageIndex
      );

      if (!retMarketPlaceResult) {
        return {
          success: false,
          error: "Unable to Fetch MarketPlace for Retailer",
        };
      }
      const supplierProfile = {
        supplierEstablishmentName:
          retMarketPlaceResult[0].supplier_establishment_name,
        supplierEstablishmentLogo:
          retMarketPlaceResult[0].supplier_establishment_logo,
        supplierEstablishmentCover:
          retMarketPlaceResult[0].supplier_establishment_cover,
        supplierIndustryTypes: retMarketPlaceResult[0].supplier_industry_type,
        products: { productItem: [] },
        totalProducts: retMarketPlaceResult[0].total_products_count,
        reviews: { reviewItem: [] },
        totalReviews: retMarketPlaceResult[0].total_reviews_count,
        reviewCount: retMarketPlaceResult[0].supplier_review_count,
        overallRating: retMarketPlaceResult[0].overall_rating,
      };
      if (retMarketPlaceResult[0].paginated_products) {
        for (
          let i = 0;
          i < retMarketPlaceResult[0].paginated_products.length;
          i++
        ) {
          const item = {
            id: retMarketPlaceResult[0].paginated_products[i].product_id,
            name: retMarketPlaceResult[0].paginated_products[i].product_name,
            description:
              retMarketPlaceResult[0].paginated_products[i].product_description,
            image: retMarketPlaceResult[0].paginated_products[i].product_image,
            retailPrice:
              retMarketPlaceResult[0].paginated_products[i]
                .product_retail_price,
            unitPrice:
              retMarketPlaceResult[0].paginated_products[i].product_unit_price,
            wholeSalePrice:
              retMarketPlaceResult[0].paginated_products[i]
                .product_whole_sale_price,
            categoryId:
              retMarketPlaceResult[0].paginated_products[i]
                .out_product_category,
          };
          supplierProfile.products.productItem.push(item);
        }
      }
      if (retMarketPlaceResult[0].paginated_reviews) {
        for (
          let i = 0;
          i < retMarketPlaceResult[0].paginated_reviews.length;
          i++
        ) {
          const item = {
            id: retMarketPlaceResult[0].paginated_reviews[i].review_id,
            rating: retMarketPlaceResult[0].paginated_reviews[i].rating,
            comment: retMarketPlaceResult[0].paginated_reviews[i].review_text,
            date: retMarketPlaceResult[0].paginated_reviews[i].review_date,
          };
          supplierProfile.reviews.reviewItem.push(item);
        }
      }
      return {
        success: true,
        supplierProfile: supplierProfile,
      };
    } catch (error) {
      throw error;
    }
  },
  async getSupplierMarketplace(inputData) {
    try {
      const suppMarketPlaceResult =
        await Product.getMarketplaceProductsSupplier(
          inputData.supplierId,
          inputData.pageSize,
          inputData.pageIndex
        );
      if (!suppMarketPlaceResult) {
        return {
          success: false,
          error: "Unable to Fetch MarketPlace for Supplier",
        };
      } else if (suppMarketPlaceResult.length === 0) {
        return {
          success: true,
          error: "No Data Found",
        };
      }
      const marketPlace = { productItem: [] };
      for (let i = 0; i < suppMarketPlaceResult.length; i++) {
        const item = {
          id: suppMarketPlaceResult[i].out_product_id,
          name: suppMarketPlaceResult[i].out_product_name,
          description: suppMarketPlaceResult[i].out_product_description,
          image: suppMarketPlaceResult[i].out_product_image,
          retailPrice: suppMarketPlaceResult[i].out_product_retail_price,
          unitPrice: suppMarketPlaceResult[i].out_product_unit_price,
          wholeSalePrice: suppMarketPlaceResult[i].out_product_whole_sale_price,
          establishmentName: suppMarketPlaceResult[i].out_establishment_name,
        };
        marketPlace.productItem.push(item);
      }
      return {
        success: true,
        marketPlace: marketPlace,
      };
    } catch (error) {
      throw error;
    }
  },
  async getSupplierOwnedProducts(inputData) {
    try {
      const suppMarketPlaceResult = await Product.getBySupplier(
        inputData.supplierId,
        inputData.pageSize,
        inputData.pageIndex
      );
      if (!suppMarketPlaceResult) {
        return {
          success: false,
          error: "Unable to Fetch MarketPlace for Supplier",
        };
      } else if (suppMarketPlaceResult.length === 0) {
        return {
          success: true,
          error: "No Data Found",
        };
      }
      const marketPlace = { productItem: [] };
      for (let i = 0; i < suppMarketPlaceResult.length; i++) {
        const item = {
          id: suppMarketPlaceResult[i].out_product_id,
          status: suppMarketPlaceResult[i].out_product_status_id,
          name: suppMarketPlaceResult[i].out_product_name,
          description: suppMarketPlaceResult[i].out_product_description,
          image: suppMarketPlaceResult[i].out_product_image,
          retailPrice: suppMarketPlaceResult[i].out_product_retail_price,
          unitPrice: suppMarketPlaceResult[i].out_product_unit_price,
          wholeSalePrice: suppMarketPlaceResult[i].out_product_whole_sale_price,
          categoryId: suppMarketPlaceResult[i].out_product_category,
        };
        marketPlace.productItem.push(item);
      }
      return {
        success: true,
        productsList: marketPlace,
      };
    } catch (error) {
      throw error;
    }
  },
  async addProduct(inputData) {
    await beginTransaction();
    const productDetails = {
      supplierId: inputData.supplierId,
      productStatusId: inputData.productStatusId || 2,
      productUnitPrice: inputData.productUnitPrice,
      productWholeSalePrice: inputData.productWholeSalePrice,
      productRetailPrice: inputData.productRetailPrice,
      productUnitPriceDiscount: inputData.productUnitPriceDiscount,
      productCategory: inputData.productCategory,
      productDescription: inputData.productDescription,
      productImage: inputData.productImage,
      productName: inputData.productName,
      lastModifiedBy: 1,
    };
    const productInsertDb = await Product.insert(productDetails);
    if (
      !productInsertDb[0].out_product_id ||
      productInsertDb[0].out_product_id == "-1"
    ) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Add Product",
      };
    }

    await commitTransaction();
    return {
      success: true,
      productId:productInsertDb[0].out_product_id
    };
  },
  async updateProduct(inputData) {
    await beginTransaction();
    const productDetails = {
      productId: inputData.productId,
      productStatusId: inputData.productStatusId,
      productUnitPrice: inputData.productUnitPrice,
      productWholeSalePrice: inputData.productWholeSalePrice,
      productRetailPrice: inputData.productRetailPrice,
      productUnitPriceDiscount: inputData.productUnitPriceDiscount,
      productCategory: inputData.productCategory,
      productDescription: inputData.productDescription,
      productImage: inputData.productImage,
      productName: inputData.productName,
      lastModifiedBy: 1,
    };
    const productUpdateDb = await Product.update(productDetails);
    if (!productUpdateDb[0] || productUpdateDb[0].update_res === -1) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Update Product",
      };
    }

    await commitTransaction();
    return {
      success: true,
    };
  },
  async getCategories(industryType) {
    try {
      const categoriesFetch = await Category.getByIndustry(industryType);
      if (!categoriesFetch) {
        return {
          success: false,
          error: "Unable to Fetch Categories",
        };
      } else if (categoriesFetch.length === 0) {
        return {
          success: true,
          error: "No Data Found",
        };
      }
      const categoryList = { categoryItem: [] };
      for (let i = 0; i < categoriesFetch.length; i++) {
        const item = {
          id: categoriesFetch[i].out_category_id,
          name: categoriesFetch[i].out_category_name
        };
        categoryList.categoryItem.push(item);
      }
      return {
        success: true,
        categoryList: categoryList,
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = productService;
