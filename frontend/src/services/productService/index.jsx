import axios from "axios";

// Idealmente, viria de import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = "http://localhost:8000/api";

// Você pode criar uma instância do axios com configurações padrão
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Outros headers padrão aqui, se necessário
    // Ex: 'Authorization': `Bearer ${TOKEN}` se você tiver um token
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
    throw new Error(errorMessage);
  }
};

/**
 * Busca um produto específico pelo ID.
 * @param {string} id - O ID do produto.
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
    throw new Error(errorMessage);
  }
};

/**
 * Atualiza um produto existente.
 * @param {string} id - O ID do produto a ser atualizado.
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
    throw new Error(errorMessage);
  }
};

/**
 * Remove um produto.
 * @param {string} id - O ID do produto a ser removido.
 * @returns {Promise<object|null>} Normalmente retorna uma confirmação ou nada (depende do backend).
 * @throws {Error} Se a requisição falhar.
 */
export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    // O backend pode retornar o item deletado, uma mensagem de sucesso, ou status 204 (No Content)
    // Se for 204, response.data pode ser undefined ou null.
    return response.data; // Ajuste conforme o que seu backend retornar
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Falha ao remover produto com ID ${id}`;
    throw new Error(errorMessage);
  }
};

// Você pode adicionar mais funções para outros endpoints ou configurações aqui.
// Exemplo: adicionar um interceptor para tokens de autenticação
// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });
