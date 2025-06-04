// src/pages/Carrinho/index.jsx
import React, { useState } from 'react';
import './Styles/style.css';

function CartPage() {
  // Estado para os produtos no carrinho
  const [cartItems, setCartItems] = useState([
    {
      id: '1', // Adicionei ID para cada item
      nome: 'Fone com Microfone',
      cor: 'Branco',
      quantidade: 2,
      preco: 39.99,
      imagens: ['https://i.ibb.co/zhRPr/01.jpg']
    },
    {
      id: '2',
      nome: 'Smartphone Premium',
      cor: 'Preto',
      quantidade: 1,
      preco: 1999.90,
      imagens: ['https://i.ibb.co/Vp0B2h2m/02.jpg']
    }
  ]);

  // Estado para a animação de carregamento e mensagem de sucesso
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calcular o valor total
  const totalValue = cartItems
    .reduce((sum, item) => sum + item.preco * item.quantidade, 0)
    .toFixed(2);

  // Função para remover item do carrinho
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Função para lidar com o clique no botão Comprar
  const handlePurchase = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Mensagem desaparece após 3 segundos
    }, 2000); // Animação de carregamento por 2 segundos
  };

  return (
    <div className="app-wrapper-monochrome">
      {/* Cabeçalho */}
      <header className="header-mono">
        <nav className="main-nav-mono">
          <a href="#">HOME</a>
          <a href="#">PRODUTOS</a>
          <a href="#">MARCAS</a>
          <a href="#">SUPORTE</a>
        </nav>
        <div className="logo-mono central-logo-mono">TechNova</div>
        <div className="header-icons-mono">
          <span>🔍</span>
          <span>CONTA</span>
          <span>CARRINHO</span>
        </div>
      </header>

      {/* Conteúdo do Carrinho */}
      <section className="section-mono cart-section">
        <h2>CARRINHO DE COMPRAS</h2>
        <div className="cart-container">
          {/* Lado Esquerdo: Lista de Produtos */}
          <div className="cart-items">
            <h3>Produtos</h3>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="product-item">
                  <div className="product-image-container">
                    <img src={item.imagens[0]} alt={item.nome} />
                  </div>
                  <div className="product-details">
                    <h4 className="product-name">{item.nome}</h4>
                    <p className="product-detail">Cor: {item.cor}</p>
                    <p className="product-detail">Quantidade: {item.quantidade}</p>
                    <p className="product-price">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remover item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito: Resumo da Compra */}
          <div className="cart-summary">
            <h3>Resumo da Compra</h3>
            <p className="total-value">Total: R$ {totalValue}</p>
            <button
              className="button-mono primary-button-mono"
              onClick={handlePurchase}
              disabled={isLoading || showSuccess || cartItems.length === 0}
            >
              {isLoading ? (
                <span className="loading-spinner">Carregando...</span>
              ) : showSuccess ? (
                'Compra Realizada!'
              ) : (
                'Comprar'
              )}
            </button>
            {showSuccess && (
              <p className="success-message">Compra realizada com sucesso!</p>
            )}
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="footer-mono">
        <div className="footer-links-mono">
          <a href="#">SOBRE A TECHNOVA</a>
          <a href="#">CONTATO</a>
          <a href="#">ENTREGAS</a>
          <a href="#">AJUDA</a>
        </div>
        <div className="footer-logo-mono">TechNova</div>
        <div className="footer-bottom-text-mono">
          <p>© {new Date().getFullYear()} TechNova Store. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  );
}

export default CartPage;
