// src/pages/Product.js
import React, { useState, useEffect } from "react"; // Importe useEffect
// Se você decidir ter um CSS específico para esta página no futuro, você pode importá-lo aqui:
// import './Product.css'; // Se você criou este arquivo na etapa anterior
import "./Styles/style.css"; // Ou o caminho correto para seu CSS global se Product.css não existir ou não cobrir tudo

const ProductDetailPage = ({ product, onAddToCart, onBack }) => {
  if (!product) {
    return (
      <div
        className="app-wrapper-monochrome"
        style={{ padding: "40px", textAlign: "center" }}
      >
        <p>Produto não encontrado ou não selecionado.</p>
        <button onClick={onBack} className="button-mono primary-button-mono">
          Voltar para Loja
        </button>
      </div>
    );
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1); // Estado para a quantidade

  // Efeito para resetar a quantidade para 1 quando o produto mudar ou se a quantidade em estoque for 0
  useEffect(() => {
    if (product && product.quantidade > 0) {
      setSelectedQuantity(1); // Reseta para 1 se houver estoque
    } else {
      setSelectedQuantity(0); // Ou 0 se não houver estoque, para desabilitar o input
    }
  }, [product]); // Re-executa quando o 'product' prop mudar

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.imagens.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.imagens.length) % product.imagens.length
    );
  };

  const handleQuantityChange = (event) => {
    let newQuantity = parseInt(event.target.value, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1; // Garante que seja no mínimo 1
    } else if (newQuantity > product.quantidade) {
      newQuantity = product.quantidade; // Garante que não exceda o estoque
    }
    setSelectedQuantity(newQuantity);
  };

  const handleAddToCartClick = () => {
    if (selectedQuantity > 0 && selectedQuantity <= product.quantidade) {
      onAddToCart(product.id, selectedQuantity);
    } else {
      // Opcional: Adicionar um alerta ou feedback se a quantidade for inválida no momento do clique
      // (embora o input deva prevenir isso na maioria dos casos)
      alert("Por favor, selecione uma quantidade válida.");
    }
  };

  return (
    <div className="product-detail-page-mono">
      <button onClick={onBack} className="button-mono back-button-mono">
        &lt; Voltar para Loja
      </button>
      <div className="product-detail-content-mono">
        <div className="product-detail-images-mono">
          <div className="main-image-container-pdp">
            <img
              src={product.imagens[currentImageIndex]}
              alt={`${product.nome} - Imagem ${currentImageIndex + 1}`}
              className="main-product-image-mono"
            />
            {product.imagens.length > 1 && (
              <div className="pdp-image-nav-arrows">
                <span onClick={handlePrevImage}>&lt;</span>
                <span onClick={handleNextImage}>&gt;</span>
              </div>
            )}
          </div>
          {product.imagens.length > 1 && (
            <div className="thumbnail-images-pdp">
              {product.imagens.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.nome} - Miniatura ${index + 1}`}
                  className={
                    index === currentImageIndex ? "active-thumbnail-pdp" : ""
                  }
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-detail-info-mono">
          <h2>{product.nome}</h2>
          <p className="product-detail-price-mono">
            R$ {product.preco.toFixed(2).replace(".", ",")}
          </p>
          <p className="product-detail-manufacturer-mono">
            <strong>Fabricante:</strong> {product.fabricante}
          </p>
          <p className="product-detail-color-mono">
            <strong>Cor:</strong> {product.cor}
          </p>
          <p className="product-detail-stock-mono">
            {product.quantidade > 0
              ? `Em estoque: ${product.quantidade} unidades`
              : "Produto esgotado"}
          </p>
          <div className="product-detail-description-mono">
            <h4>Descrição do Produto:</h4>
            <p>{product.textoDescritivo}</p>
          </div>

          <div className="product-actions-pdp">
            {product.quantidade > 0 ? (
              <>
                <div className="quantity-selector-pdp">
                  {" "}
                  {/* Adicionando o seletor de quantidade */}
                  <label htmlFor={`quantity-pdp-${product.id}`}>
                    Quantidade:
                  </label>
                  <input
                    type="number"
                    id={`quantity-pdp-${product.id}`}
                    name="quantity"
                    value={selectedQuantity}
                    min="1"
                    max={product.quantidade} // Define o máximo como a quantidade em estoque
                    onChange={handleQuantityChange}
                    className="quantity-input-pdp" // Adicione uma classe para estilização se necessário
                    disabled={product.quantidade === 0} // Desabilita se não houver estoque
                  />
                </div>
                <button
                  className="button-mono primary-button-mono add-to-cart-button-mono"
                  onClick={handleAddToCartClick} // Atualizado para usar a nova função
                  disabled={
                    selectedQuantity === 0 ||
                    selectedQuantity > product.quantidade
                  } // Desabilita se a quantidade for inválida
                >
                  Adicionar ao Carrinho
                </button>
              </>
            ) : (
              <p className="out-of-stock-message-pdp">
                Produto indisponível no momento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
