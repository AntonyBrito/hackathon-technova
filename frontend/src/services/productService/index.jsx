import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post("/products", productData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Falha ao criar produto";
    console.error("Erro em createProduct:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getProducts = async () => {
  try {
    const response = await apiClient.get("/products");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Falha ao buscar produtos";
    console.error("Erro em getProducts:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Falha ao buscar produto com ID ${id}`;
    console.error("Erro em getProductById:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Falha ao atualizar produto com ID ${id}`;
    console.error("Erro em updateProduct:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const deleteProduct = async (id) => {
  try {
    await apiClient.delete(`/products/${id}`);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Falha ao remover produto com ID ${id}`;
    console.error("Erro em deleteProduct:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const checkoutService = async (cartItems) => {
  try {
    const response = await apiClient.post("/stock/checkout", cartItems);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Falha ao finalizar a compra";
    console.error("Erro no checkoutService:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getStockSummary = async () => {
  try {
    const response = await apiClient.get("/stock/summary");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Falha ao buscar o resumo do estoque";
    console.error("Erro em getStockSummary:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getStockHistory = async () => {
  try {
    const response = await apiClient.get("/stock/history");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Falha ao buscar o histórico do estoque";
    console.error("Erro em getStockHistory:", errorMessage);
    throw new Error(errorMessage);
  }
};
