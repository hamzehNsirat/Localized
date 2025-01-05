import apiClient from "../index.js";

const categoriesApi = {
  getCategories: async (data) => {
    const response = await apiClient.post("/products/getcategories", data);
    return response.data;
  },
};

export default categoriesApi;
