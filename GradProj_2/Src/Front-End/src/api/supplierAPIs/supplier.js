import apiClient from "../index.js";
import { useAuth } from "../../components/Providers/authProvider.jsx";
import { toast } from "react-toastify";
import AppColors from "../../components/Theme/AppColors.jsx";



const supplierApi = {
  getSupplierAllDetails: async (usrId) => {
  try {
    const payload = { userId: usrId }; // Wrap the userId in an object
    const response = await apiClient.post("/dashboard/getsupplierdetails", payload);
    return response.data;
  } catch (err) {
     if(err.response?.data.header.errorCode == 'TOKEN_EXPIRED'){
      console.log(err.response?.data);
      return {token: "failed"};
    }
    console.error("Error in getSupplierAllDetails: ", err.response?.data || err.message);
    return false;
  }
},
  getSupplierMarketplace: async (payload) => {
    const response = await apiClient.post("/products/getsuppliermarketplace",payload);
    return response.data;
  },
  getOwnedProducts: async (supId, pageSize, pageIndex) => {
    const payload = {supplierId:supId, pageSize:pageSize, pageIndex: pageIndex};
    const response = await apiClient.post("/products/getsupplierownedproducts", payload);
    return response.data;
  },
  addProduct: async (supId, statusId, retailPrice, wholesalePrice, unitPrice, categoryId, description, image, name) => {
    try {
    // Wait for the image upload and get the URL
    const payload = {
      supplierId: supId,
      productStatusId: statusId,
      productUnitPrice: unitPrice,
      productWholeSalePrice: wholesalePrice,
      productRetailPrice: retailPrice,
      productUnitPriceDiscount: 0,
      productCategory: categoryId,
      productDescription: description,
      productImage: image, // Use the uploaded image URL
      productName: name
    };

    // Send the API request
    const response = await apiClient.post("/products/add", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error.message);
    return false;
  }
},

  updateProduct: async (prodId, statusId, retailPrice, wholesalePrice, unitPrice, categoryId, description, image, name) => {
    const payload = {
      productId:prodId,
      productStatusId: statusId,
      productUnitPrice: unitPrice,
      productWholeSalePrice: wholesalePrice,
      productRetailPrice: retailPrice,
      productUnitPriceDiscount: 0,
      productCategory: categoryId,
      productDescription: description,
      productImage: image, // Use the uploaded image URL
      productName: name
    };

    console.log("Payload:", payload);
    try{

      const response = await apiClient.post("/products/update",payload);
      return response.data;
    }
    catch(err){
      console.error("Error adding product:", error.message);
    return false;
    }
  },
  getCategories: async (industryTypeId) => {
    const payload = {industryType: industryTypeId};
    const response = await apiClient.post("/products/getcategories",payload);
    return response.data;
  },
};

export default supplierApi;

