import axios from "axios";

// A URL base da API aponta para o seu backend Spring Boot na porta 8080.
const API_BASE_URL = "http://localhost:8080/api";

// Instância do axios com configurações padrão
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Cria um novo produto.
 * @param {object} productData - Os dados do produto a ser criado.
 * @returns {Promise<object>} O produto criado.
 * @throws {Error} Se a requisição falhar.
 */
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

/**
 * Busca todos os produtos.
 * @returns {Promise<Array<object>>} Uma lista de produtos.
 * @throws {Error} Se a requisição falhar.
 */
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

/**
 * Busca um produto específico pelo ID.
 * @param {string | number} id - O ID do produto.
 * @returns {Promise<object>} O produto encontrado.
 * @throws {Error} Se a requisição falhar ou o produto não for encontrado.
 */
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

/**
 * Atualiza um produto existente.
 * @param {string | number} id - O ID do produto a ser atualizado.
 * @param {object} productData - Os novos dados do produto.
 * @returns {Promise<object>} O produto atualizado.
 * @throws {Error} Se a requisição falhar.
 */
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

/**
 * Remove um produto.
 * @param {string | number} id - O ID do produto a ser removido.
 * @returns {Promise<void>}
 * @throws {Error} Se a requisição falhar.
 */
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

/**
 * Processa a compra, atualizando a quantidade de cada produto no carrinho.
 * @param {Array<object>} cartItems - Itens no carrinho.
 * @param {Array<object>} allProducts - Lista de todos os produtos para obter dados completos.
 * @returns {Promise<void>}
 * @throws {Error} Se a atualização de qualquer produto falhar.
 */
export const checkoutService = async (cartItems, allProducts) => {
  const updatePromises = cartItems.map((item) => {
    // Encontra o produto completo para obter a quantidade atual e outros dados
    const productToUpdate = allProducts.find((p) => p.id === item.id);
    if (!productToUpdate) {
      throw new Error(`Produto com ID ${item.id} não encontrado.`);
    }

    const newQuantity = productToUpdate.quantity - item.quantity;
    if (newQuantity < 0) {
      throw new Error(`Estoque insuficiente para o produto "${item.name}".`);
    }

    // Cria o objeto de dados para atualização, mantendo os dados existentes
    const updatedProductData = {
      ...productToUpdate,
      quantity: newQuantity,
    };

    return updateProduct(item.id, updatedProductData);
  });

  // Executa todas as promessas de atualização em paralelo
  try {
    await Promise.all(updatePromises);
  } catch (error) {
    // Se uma falhar, o Promise.all irá rejeitar.
    console.error("Erro durante o processo de checkout:", error);
    // Propaga o erro para ser tratado pelo componente que chamou.
    throw new Error(`Falha ao finalizar a compra: ${error.message}`);
  }
};
