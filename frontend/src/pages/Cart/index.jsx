import React from "react";
import "./Styles/style.css";

const CartView = ({
  cartItems,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onCloseCart,
  allProducts,
  onFinalizePurchase,
}) => {
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-view-mono">
        <div className="cart-header-mono">
          <h2>Seu Carrinho</h2>
          <button
            onClick={onCloseCart}
            className="button-mono close-cart-button-mono"
          >
            &times; Fechar
          </button>
        </div>
        <p className="empty-cart-message-mono">Seu carrinho está vazio.</p>
        <button
          onClick={onCloseCart}
          className="button-mono primary-button-mono"
        >
          Continuar Comprando
        </button>
      </div>
    );
  }

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleQuantityChange = (productId, newQuantityStr) => {
    const productInAllData = allProducts.find((p) => p.id === productId);
    if (!productInAllData) return;

    let newQuantity = parseInt(newQuantityStr, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    } else if (newQuantity > productInAllData.quantity) {
      newQuantity = productInAllData.quantity;
      alert(`O estoque máximo para este produto é ${newQuantity}.`);
    }
    onUpdateCartQuantity(productId, newQuantity);
  };

  return (
    <div className="cart-view-mono">
      <div className="cart-header-mono">
        <h2>Seu Carrinho</h2>
        <button
          onClick={onCloseCart}
          className="button-mono close-cart-button-mono"
        >
          &times; Fechar
        </button>
      </div>
      <div className="cart-items-list-mono">
        {cartItems.map((item) => {
          const productInAllData = allProducts.find((p) => p.id === item.id);
          return (
            <div key={item.id} className="cart-item-mono">
              <img
                src={item.imageUrl || "https://via.placeholder.com/100"}
                alt={item.name}
                className="cart-item-image-mono"
              />
              <div className="cart-item-details-mono">
                <p className="cart-item-name-mono">{item.name}</p>
                <p className="cart-item-price-mono">
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div className="cart-item-quantity-mono">
                <label htmlFor={`qty-${item.id}`}>Qtd:</label>
                <input
                  type="number"
                  id={`qty-${item.id}`}
                  value={item.quantity}
                  min="1"
                  max={
                    productInAllData ? productInAllData.quantity : item.quantity
                  }
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                  className="quantity-input-cart-mono"
                />
              </div>
              <p className="cart-item-subtotal-mono">
                R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
              </p>
              <button
                onClick={() => onRemoveFromCart(item.id)}
                className="button-mono remove-item-button-mono"
              >
                Remover
              </button>
            </div>
          );
        })}
      </div>
      <div className="cart-summary-mono">
        <h3>Total: R$ {calculateTotal().toFixed(2).replace(".", ",")}</h3>
        <button
          className="button-mono primary-button-mono checkout-button-mono"
          onClick={onFinalizePurchase}
        >
          Finalizar Compra
        </button>
        <button
          onClick={onCloseCart}
          className="button-mono secondary-button-mono"
        >
          Continuar Comprando
        </button>
      </div>
    </div>
  );
};

export default CartView;
