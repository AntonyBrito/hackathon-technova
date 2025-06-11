import React, { useState, useEffect } from "react";
import "./Styles/style.css";

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
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (product && product.quantity > 0) {
      setSelectedQuantity(1);
    } else {
      setSelectedQuantity(0);
    }
  }, [product]);

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.imageUrls.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.imageUrls.length) % product.imageUrls.length
    );
  };

  const handleQuantityChange = (event) => {
    let newQuantity = parseInt(event.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    } else if (newQuantity > product.quantity) {
      newQuantity = product.quantity;
    }
    setSelectedQuantity(newQuantity);
  };

  const handleAddToCartClick = () => {
    if (selectedQuantity > 0 && selectedQuantity <= product.quantity) {
      onAddToCart(product.id, selectedQuantity);
    } else {
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
              src={
                product.imageUrls[currentImageIndex] ||
                "https://via.placeholder.com/480"
              }
              alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
              className="main-product-image-mono"
            />
            {product.imageUrls.length > 1 && (
              <div className="pdp-image-nav-arrows">
                <span onClick={handlePrevImage}>&lt;</span>
                <span onClick={handleNextImage}>&gt;</span>
              </div>
            )}
          </div>
          {product.imageUrls.length > 1 && (
            <div className="thumbnail-images-pdp">
              {product.imageUrls.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} - Miniatura ${index + 1}`}
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
          <h2>{product.name}</h2>
          <p className="product-detail-price-mono">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </p>
          <p className="product-detail-manufacturer-mono">
            <strong>Fabricante:</strong> {product.manufacturer}
          </p>
          <p className="product-detail-color-mono">
            <strong>Cor:</strong> {product.color}
          </p>
          <p className="product-detail-stock-mono">
            {product.quantity > 0
              ? `Em estoque: ${product.quantity} unidades`
              : "Produto esgotado"}
          </p>
          <div className="product-detail-description-mono">
            <h4>Descrição do Produto:</h4>
            <p>{product.description}</p>
          </div>

          <div className="product-actions-pdp">
            {product.quantity > 0 ? (
              <>
                <div className="quantity-selector-pdp">
                  <label htmlFor={`quantity-pdp-${product.id}`}>
                    Quantidade:
                  </label>
                  <input
                    type="number"
                    id={`quantity-pdp-${product.id}`}
                    name="quantity"
                    value={selectedQuantity}
                    min="1"
                    max={product.quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input-pdp"
                    disabled={product.quantity === 0}
                  />
                </div>
                <button
                  className="button-mono primary-button-mono add-to-cart-button-mono"
                  onClick={handleAddToCartClick}
                  disabled={
                    selectedQuantity === 0 ||
                    selectedQuantity > product.quantity
                  }
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
