// Loads role-specific dashboards and data analytics
const productService = require("../services/productService");
const errorHandler = require("../middlewares/errorHandler");
const { executeQuery } = require("../config/database");

const getretmarketplaceproducts = async (req, res) => {
  try {
    if (
      req.body.retailerId == null ||
      req.body.pageSize   == null ||
      req.body.pageIndex  == null
    ) {
      return errorHandler.handleError(res, "E0035");
    }
    const result = await productService.getretmarketplaceproducts(
      req.body
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0036", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0036");
  }
};

module.exports = {
  getretmarketplaceproducts,
};
