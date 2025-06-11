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

export const checkoutService = async (cartItems, allProducts) => {
  const updatePromises = cartItems.map((item) => {
    const productToUpdate = allProducts.find((p) => p.id === item.id);
    if (!productToUpdate) {
      throw new Error(`Produto com ID ${item.id} não encontrado.`);
    }

    const newQuantity = productToUpdate.quantity - item.quantity;
    if (newQuantity < 0) {
      throw new Error(`Estoque insuficiente para o produto "${item.name}".`);
    }

    const updatedProductData = {
      ...productToUpdate,
      quantity: newQuantity,
    };

    return updateProduct(item.id, updatedProductData);
  });

  try {
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Erro durante o processo de checkout:", error);
    throw new Error(`Falha ao finalizar a compra: ${error.message}`);
  }
};