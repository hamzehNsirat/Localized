// Manages product-related business logic
const User = require("../models/User"); // User model
const Establishment = require("../models/Establishment"); // Establishment model
const Supplier = require("../models/supplier");
const Retailer = require("../models/retailer");
const Admin = require("../models/Adminstrator");
const Product = require("../models/Product");
const crypto = require("crypto");
const { sendEmail } = require("../config/email");
const env = require("../config/env");
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
          image: retMarketPlaceResult[i].out_product_image
            ? retMarketPlaceResult[i].out_product_image.toString("base64")
            : null,
          retailPrice: retMarketPlaceResult[i].out_product_retail_price,
          unitPrice: retMarketPlaceResult[i].out_product_unit_price,
          wholeSalePrice: retMarketPlaceResult[i].out_product_whole_sale_price,
          supplier: retMarketPlaceResult[i].out_product_supplier,
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
          image: null,
          // retMarketPlaceResult[i].out_product_image
          //? retMarketPlaceResult[i].out_product_image.toString("base64")
          //: null,
          retailPrice: retMarketPlaceResult[i].out_product_retail_price,
          unitPrice: retMarketPlaceResult[i].out_product_unit_price,
          wholeSalePrice: retMarketPlaceResult[i].out_product_whole_sale_price,
          supplier: retMarketPlaceResult[i].out_supplier_id,
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
  async searchRetProducts(inputData) {
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
          image: null,
          // retMarketPlaceResult[i].out_product_image
          //? retMarketPlaceResult[i].out_product_image.toString("base64")
          //: null,
          retailPrice: retMarketPlaceResult[i].out_product_retail_price,
          unitPrice: retMarketPlaceResult[i].out_product_unit_price,
          wholeSalePrice: retMarketPlaceResult[i].out_product_whole_sale_price,
          supplier: retMarketPlaceResult[i].out_supplier_id,
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
            image: null,
            // retMarketPlaceResult[i].product_image
            //? retMarketPlaceResult[i].product_image.toString("base64")
            //: null,
            retailPrice:
              retMarketPlaceResult[0].paginated_products[i]
                .product_retail_price,
            unitPrice:
              retMarketPlaceResult[0].paginated_products[i].product_unit_price,
            wholeSalePrice:
              retMarketPlaceResult[0].paginated_products[i]
                .product_whole_sale_price,
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
};

module.exports = productService;
