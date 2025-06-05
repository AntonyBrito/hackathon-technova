// src/pages/ProductEditListPage.js
import React, { useState, useEffect } from "react"; // Adicionado useEffect
import { Link, useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm"; // Ajuste o caminho se necessário

// Importa DIRETAMENTE os dados dos produtos para esta página
// Certifique-se que o caminho está correto em relação a este arquivo ProductEditListPage.js
// Se ProductEditListPage.js está em src/pages/, e allProductsData.js está em src/assets/
// o caminho seria: import { allProductsData } from "../assets/allProductsData";
import { allProductsData as initialProductsFromSource } from "../../assets/allProductsData";

// Importe o CSS para esta página
import "./Style/style.css";

const ProductEditListPage = ({
  // A prop 'products' não é mais necessária se estamos importando diretamente
  onUpdateProduct, // Ainda necessário para atualizar o estado global no App.js
  onDeleteProduct, // Ainda necessário para deletar do estado global no App.js
}) => {
  // Estado para gerenciar a lista de produtos exibida (inicializado com os dados importados)
  // Isso permite que a lista seja modificada localmente (ex: após deleção) para feedback imediato,
  // embora a fonte da verdade ainda seja o App.js para consistência global.
  const [displayedProducts, setDisplayedProducts] = useState(
    initialProductsFromSource
  );
  const [editingProduct, setEditingProduct] = useState(null); // Produto selecionado para edição
  const navigate = useNavigate();

  // Se os dados pudessem mudar externamente e você quisesse sincronizar,
  // você poderia passar a lista do App.js como prop e usar um useEffect.
  // Mas como estamos importando diretamente, `displayedProducts` começa com esses dados.

  useEffect(() => {
    // Se os dados importados fossem carregados de forma assíncrona, você poderia fazer algo aqui.
    // Por enquanto, apenas garantimos que o estado local reflita os dados importados inicialmente.
    setDisplayedProducts(initialProductsFromSource);
  }, []); // Executa uma vez na montagem para garantir que temos os dados mais recentes do import

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleProductUpdateSubmit = (updatedProductData) => {
    onUpdateProduct(updatedProductData); // Chama a função do App.js para atualizar o estado global
    // Atualiza a lista local para reflexo imediato
    setDisplayedProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === updatedProductData.id ? updatedProductData : p
      )
    );
    setEditingProduct(null); // Volta para a visualização da lista
    alert(`Produto "${updatedProductData.nome}" atualizado com sucesso!`);
  };

  const handleDeleteProduct = (productId, productName) => {
    if (
      window.confirm(
        `Tem certeza que deseja remover o produto "${productName}"?`
      )
    ) {
      onDeleteProduct(productId); // Chama a função do App.js para atualizar o estado global
      // Atualiza a lista local para reflexo imediato
      setDisplayedProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId)
      );
      if (editingProduct && editingProduct.id === productId) {
        setEditingProduct(null);
      }
    }
  };

  // Se nenhum produto estiver selecionado para edição, mostra a lista
  if (!editingProduct) {
    return (
      <div className="product-management-page-mono">
        <div className="management-header-mono">
          <h2>Gerenciar Produtos (Editar/Remover)</h2>
          <Link to="/" className="button-mono secondary-button-mono">
            Voltar para Home
          </Link>
        </div>
        {/* Agora usa 'displayedProducts' (estado local) */}
        {!displayedProducts || displayedProducts.length === 0 ? (
          <>
            <p className="empty-list-message-mono">
              Nenhum produto cadastrado na fonte de dados.
            </p>
            {/* O botão "Cadastrar Novo Produto" aqui ainda faz sentido se a lista estiver vazia */}
            <Link
              to="/ProductRegistration" // Rota para sua ProductRegistrationPage
              className="button-mono primary-button-mono"
            >
              Cadastrar Novo Produto
            </Link>
          </>
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
              {/* Itera sobre 'displayedProducts' */}
              {displayedProducts.map((product) => (
                <div key={product.id} className="product-item-manageable-mono">
                  <img
                    src={
                      product.imagens && product.imagens.length > 0
                        ? product.imagens[0]
                        : "https://via.placeholder.com/60"
                    }
                    alt={product.nome}
                    className="product-item-image-manageable-mono"
                  />
                  <div className="product-item-name-manageable-mono">
                    {product.nome}
                    <small>ID: {product.id}</small>
                  </div>
                  <div className="product-item-price-manageable-mono">
                    R$ {product.preco.toFixed(2).replace(".", ",")}
                  </div>
                  <div className="product-item-stock-manageable-mono">
                    {product.quantidade} unid.
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
                        handleDeleteProduct(product.id, product.nome)
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
        {/* Botão "Adicionar Novo Produto" no rodapé da lista (opcional, mas útil) */}
        {/* Se você já tem "Cadastrar Produto" no header principal, pode remover este */}
        <div className="management-footer-actions-mono">
          <Link
            to="/ProductRegistration" // Rota para sua ProductRegistrationPage
            className="button-mono primary-button-mono"
          >
            + Adicionar Novo Produto
          </Link>
        </div>
      </div>
    );
  }

  // Se um produto ESTÁ selecionado para edição, mostra o formulário
  return (
    <div className="product-registration-page-mono product-edit-page-form-view">
      <div className="registration-header-mono">
        <h2>
          Editando Produto:{" "}
          <span style={{ textTransform: "none", color: "#555" }}>
            {editingProduct.nome}
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
      <div
        className="delete-action-container-mono"
        style={{
          marginTop: "20px",
          paddingTop: "20px",
          borderTop: "1px solid #e0e0e0",
          textAlign: "left",
        }}
      >
        <button
          type="button"
          onClick={() =>
            handleDeleteProduct(editingProduct.id, editingProduct.nome)
          }
          className="button-mono danger-button-mono delete-product-button-mono"
        >
          Remover este Produto
        </button>
      </div>
    </div>
  );
};

export default ProductEditListPage;
