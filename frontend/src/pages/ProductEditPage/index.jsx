import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductForm from "../../components/ProductForm";

const ProductEditPage = ({ allProducts, onUpdateProduct, onDeleteProduct }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId && allProducts.length > 0) {
      const product = allProducts.find((p) => p.id === productId);
      if (product) {
        setProductToEdit(product);
      } else {
        alert("Produto não encontrado para edição!");
        navigate("/admin/manage-products"); // Volta para a lista de gerenciamento
      }
      setLoading(false);
    } else if (allProducts.length > 0) {
      // Se não há productId mas há produtos, algo está errado
      setLoading(false); // Para o carregamento
    }
    // Se allProducts ainda não carregou, espera. Adicionar allProducts.length às dependências
  }, [productId, allProducts, navigate]);

  if (loading) {
    return (
      <div
        className="product-registration-page-mono"
        style={{ padding: "40px", textAlign: "center" }}
      >
        <p>Carregando...</p>
      </div>
    );
  }
  if (!productToEdit) {
    return (
      <div
        className="product-registration-page-mono"
        style={{ padding: "40px", textAlign: "center" }}
      >
        <p>Produto não encontrado.</p>
        <Link
          to="/admin/manage-products"
          className="button-mono secondary-button-mono"
        >
          Voltar para Gerenciamento
        </Link>
      </div>
    );
  }

  const handleProductUpdateSubmit = (updatedProductData) => {
    // O ID já estará em updatedProductData se ProductForm o incluir
    onUpdateProduct(updatedProductData);
    // A navegação será feita no App.js após onUpdateProduct ser chamada
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Tem certeza que deseja remover o produto "${productToEdit.nome}"?`
      )
    ) {
      onDeleteProduct(productToEdit.id);
      // A navegação será feita no App.js após onDeleteProduct
    }
  };

  return (
    <div className="product-registration-page-mono product-edit-page-mono">
      <div className="registration-header-mono">
        <h2>
          Editar Produto:{" "}
          <span style={{ textTransform: "none", color: "#555" }}>
            {productToEdit.nome}
          </span>
        </h2>
        <Link
          to="/admin/manage-products"
          className="button-mono secondary-button-mono cancel-button-mono"
        >
          Cancelar Edição
        </Link>
      </div>
      <ProductForm
        initialData={productToEdit}
        onSubmit={handleProductUpdateSubmit}
        submitButtonText="Salvar Alterações"
        isEditMode={true}
      />
      <div
        className="form-actions-mono"
        style={{
          marginTop: "20px",
          paddingTop: "20px",
          borderTop: "1px solid #e0e0e0",
          textAlign: "left",
        }}
      >
        <button
          type="button"
          onClick={handleDelete}
          className="button-mono danger-button-mono delete-product-button-mono"
        >
          Remover Este Produto
        </button>
      </div>
    </div>
  );
};

export default ProductEditPage;
