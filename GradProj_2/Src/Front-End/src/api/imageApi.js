const apiClient = axios.create({
  baseURL:  "http://localhost:5055",
  headers: {
    "Content-Type": "application/json",
  },
});

const imageApi = {
  uploadImage: async (data) => {
    const response = await apiClient.post("/uploads/images/upload" , data);
    return response.data;
  },
  getImage: async (filename) => {
    const url = `/uploads/images/${filename}`; 
    const response = await apiClient.get(url);

    return { imageName: filename, data: response.data };
  },
}