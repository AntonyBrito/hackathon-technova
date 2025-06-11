import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import ProductForm from "../../components/ProductForm";
import { createProduct } from "../../services/productService";
import "./Styles/style.css";

const ProductRegistrationPage = () => {
  const navigate = useNavigate();

  const handleRegisterProduct = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      await Swal.fire({
        title: 'Sucesso!',
        text: `Produto "${newProduct.name}" cadastrado com sucesso!`,
        icon: 'success',
        confirmButtonColor: '#1E1E1E',
        confirmButtonText: 'OK',
        background: '#FFFFFF',
        customClass: {
          title: 'swal-title',
          popup: 'swal-popup',
          confirmButton: 'swal-button'
        }
      });
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      Swal.fire({
        title: 'Erro!',
        text: `Falha ao cadastrar o produto: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#1E1E1E',
        confirmButtonText: 'Tentar Novamente',
        background: '#FFFFFF',
        customClass: {
          title: 'swal-title',
          popup: 'swal-popup',
          confirmButton: 'swal-button'
        }
      });
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