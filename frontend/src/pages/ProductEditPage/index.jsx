import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import ProductForm from "../../components/ProductForm";
import {
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import "./Style/style.css";

const ProductEditListPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleProductUpdateSubmit = async (updatedProductData) => {
    try {
      await updateProduct(updatedProductData.id, updatedProductData);
      setEditingProduct(null);
      Swal.fire({
        title: 'Sucesso!',
        text: `Produto "${updatedProductData.name}" atualizado com sucesso!`,
        icon: 'success',
        confirmButtonColor: '#1E1E1E',
        confirmButtonText: 'OK',
        background: '#FFFFFF',
      });
      fetchProducts();
    } catch (err) {
      Swal.fire({
        title: 'Erro!',
        text: `Erro ao atualizar produto: ${err.message}`,
        icon: 'error',
        confirmButtonColor: '#1E1E1E',
        confirmButtonText: 'Tentar Novamente',
        background: '#FFFFFF',
      });
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente remover o produto "${productName}"? Esta ação não pode ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5E5E5E',
      cancelButtonColor: '#A3A3A3',
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar',
      background: '#FFFFFF',
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(productId);
        if (editingProduct && editingProduct.id === productId) {
          setEditingProduct(null);
        }
        Swal.fire({
          title: 'Removido!',
          text: `Produto "${productName}" foi removido com sucesso.`,
          icon: 'success',
          confirmButtonColor: '#1E1E1E',
          background: '#FFFFFF',
        });
        fetchProducts();
      } catch (err) {
        Swal.fire({
          title: 'Erro!',
          text: `Erro ao remover produto: ${err.message}`,
          icon: 'error',
          confirmButtonColor: '#1E1E1E',
          background: '#FFFFFF',
        });
      }
    }
  };

  if (editingProduct) {
    return (
      <div className="product-registration-page-mono product-edit-page-form-view">
        <div className="registration-header-mono">
          <h2>
            Editando Produto:{" "}
            <span style={{ textTransform: "none", color: "#555" }}>
              {editingProduct.name}
            </span>
          </h2>
          <button
            onClick={handleCancelEdit}
            className="button-mono secondary-button-mono cancel-button-mono"
          >
            Voltar para Lista
          </button>
        </div>
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleProductUpdateSubmit}
          submitButtonText="Salvar Alterações"
          isEditMode={true}
        />
        <div className="delete-action-container-mono">
          <button
            type="button"
            onClick={() =>
              handleDeleteProduct(editingProduct.id, editingProduct.name)
            }
            className="button-mono danger-button-mono delete-product-button-mono"
          >
            Remover este Produto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-management-page-mono">
      <div className="management-header-mono">
        <h2>Gerenciar Produtos</h2>
        <Link to="/" className="button-mono secondary-button-mono">
          Voltar para Home
        </Link>
      </div>

      {isLoading && <p>Carregando produtos...</p>}
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {!isLoading && !error && (
        <>
          {products.length === 0 ? (
            <p className="empty-list-message-mono">
              Nenhum produto encontrado.
            </p>
          ) : (
            <>
              <div className="product-list-header-titles-mono">
                <span>Imagem</span>
                <span>Nome do Produto</span>
                <span>Preço</span>
                <span>Estoque</span>
                <span>Ações</span>
              </div>
              <div className="product-list-manageable-mono">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="product-item-manageable-mono"
                  >
                    <img
                      src={
                        product.imageUrls && product.imageUrls.length > 0
                          ? product.imageUrls[0]
                          : "https://via.placeholder.com/60"
                      }
                      alt={product.name}
                      className="product-item-image-manageable-mono"
                    />
                    <div className="product-item-name-manageable-mono">
                      {product.name}
                      <small>ID: {product.id}</small>
                    </div>
                    <div className="product-item-price-manageable-mono">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </div>
                    <div className="product-item-stock-manageable-mono">
                      {product.quantity} unid.
                    </div>
                    <div className="product-item-actions-manageable-mono">
                      <button
                        onClick={() => handleStartEdit(product)}
                        className="button-mono light-button-mono edit-action-button-list-mono"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProduct(product.id, product.name)
                        }
                        className="button-mono danger-button-mono delete-action-button-list-mono"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="management-footer-actions-mono">
            <Link
              to="/ProductRegistration"
              className="button-mono primary-button-mono"
            >
              + Adicionar Novo Produto
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductEditListPage;