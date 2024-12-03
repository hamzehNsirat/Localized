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
  async getretmarketplaceproducts(inputData) {
    try {
      const retMarketPlaceResult = await Product.getMarketplaceProducts(
        inputData.retailerId,
        inputData.pageSize,
        inputData.pageIndex
      );
      const marketPlace = {productItem:[]};
      for(let i = 0; i < retMarketPlaceResult.length; i++){
          const item = {
            id: retMarketPlaceResult[i].out_product_id,
            name: retMarketPlaceResult[i].out_product_name,
            description: retMarketPlaceResult[i].out_product_description,
            image: retMarketPlaceResult[i].out_product_image
              ? retMarketPlaceResult[i].out_product_image.toString("base64")
              : null,
            retailPrice: retMarketPlaceResult[i].out_product_retail_price,
            unitPrice: retMarketPlaceResult[i].out_product_unit_price,
            wholeSalePrice:
              retMarketPlaceResult[i].out_product_whole_sale_price,
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
};

module.exports = productService;
