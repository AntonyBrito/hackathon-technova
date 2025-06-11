import React, { useState } from "react";
import Header from "../../components/Header"; 
import "./Styles/style.css";

const ProductDetailPage = ({
  product,
  onAddToCart,
  onBack,
  cartItemCount,
  isCartAnimating,
  onCartClick,
  onLogoClick,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(
    product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : ""
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!product) {
    return (
      <div>
        <p>Produto não encontrado.</p>
        <button onClick={onBack}>Voltar para a loja</button>
      </div>
    );
  }

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + amount, product.quantity)));
  };

  const handleThumbnailClick = (url) => {
    setMainImage(url);
  };

  const handleAddToCartClick = () => {
    onAddToCart(product.id, quantity);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  return (
    <div className="product-detail-page-mono">
      <Header
        cartItemCount={cartItemCount}
        isCartAnimating={isCartAnimating}
        onCartClick={onCartClick}
        onLogoClick={onLogoClick}
      />

      <main className="product-main-content-mono">
        <div className="product-gallery-mono">
          <div className="product-main-image-mono">
            <img src={mainImage} alt={product.name} />
          </div>
          <div className="product-thumbnails-mono">
            {product.imageUrls &&
              product.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  onClick={() => handleThumbnailClick(url)}
                  className={mainImage === url ? "active-thumbnail" : ""}
                />
              ))}
          </div>
        </div>
        <div className="product-info-mono">
          <h1 className="product-title-mono">{product.name}</h1>
          <p className="product-price-mono">
            R$ {product.price ? product.price.toFixed(2).replace(".", ",") : '0,00'}
          </p>
          <p className="product-description-mono">{product.description}</p>
          <div className="product-meta-mono">
            <span>
              <strong>Marca:</strong> {product.manufacturer}
            </span>
            <span>
              <strong>Cor:</strong> {product.color}
            </span>
            <span>
              <strong>Em estoque:</strong> {product.quantity} unidades
            </span>
          </div>
          <div className="product-actions-mono">
            <div className="quantity-selector-mono">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
            <button
              onClick={handleAddToCartClick}
              className="add-to-cart-btn-mono"
              disabled={product.quantity <= 0}
            >
              {product.quantity > 0 ? "Adicionar ao Carrinho" : "Fora de Estoque"}
            </button>
            {showConfirmation && (
              <span className="confirmation-message-mono">Adicionado!</span>
            )}
          </div>
           <button onClick={onBack} className="button-mono secondary-button-mono" style={{marginTop: '20px', alignSelf: 'center'}}>
                &larr; Voltar para a Loja
            </button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;