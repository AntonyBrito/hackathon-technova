import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import { createProduct } from "../../services/productService";
import "./Styles/style.css";

const ProductRegistrationPage = () => {
  const navigate = useNavigate();

  const handleRegisterProduct = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      alert(`Produto "${newProduct.name}" cadastrado com sucesso!`);
      navigate("/"); // Redireciona para a home após o sucesso
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert(`Falha ao cadastrar o produto: ${error.message}`);
    }
  };

  return (
    <div className="product-registration-page-mono">
      <div className="registration-header-mono">
        <h2>Cadastrar Novo Produto</h2>
        <Link
          to="/"
          className="button-mono secondary-button-mono cancel-button-mono"
        >
          Voltar para Home
        </Link>
      </div>
      <ProductForm
        onSubmit={handleRegisterProduct}
        submitButtonText="Cadastrar Produto"
      />
    </div>
  );
};

export default ProductRegistrationPage;
