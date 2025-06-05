import React, { useState } from "react";
import { Link } from "react-router-dom"; // Passo 1: Importar Link
import "./Styles/style.css";
import ProductDetailPage from "../Product";
import { allProductsData as initialAllProductsData } from "../../assets/allProductsData"; // Renomeado para clareza
import CartView from "../Cart";
// Importe sua página de cadastro se App.js precisar interagir diretamente com ela (ex: passar props),
// caso contrário, o React Router cuidará de renderizá-la na rota correta.
// import ProductRegistrationPage from '../ProductRegistrationPage'; // Se necessário aqui

// --- COMPONENTES INTERNOS (ProductImage e ProductCard) ---
const ProductImage = ({ src, alt, className = "" }) => {
  return (
    <div className={`product-image-container ${className}`}>
      <img src={src} alt={alt} />
    </div>
  );
};

const ProductCard = ({
  product,
  showPrice = true,
  size = "default",
  onProductClick,
}) => {
  let cardClass = "product-card";
  if (size === "small") cardClass += " product-card-small";
  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    onProductClick(product.id);
  };
  return (
    <div className={cardClass} onClick={handleCardClick}>
      <div className="product-image-wrapper">
        <ProductImage src={product.imagens[0]} alt={product.nome} />
      </div>
      <p className="product-name">{product.nome}</p>
      {showPrice && product.preco && (
        <p className="product-price">
          R$ {product.preco.toFixed(2).replace(".", ",")}
        </p>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
function App() {
  // É uma boa prática gerenciar a lista de produtos no estado se ela pode mudar (ex: por cadastro)
  const [allProductsData, setAllProductsData] = useState(
    initialAllProductsData
  );

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartViewActive, setIsCartViewActive] = useState(false);

  // Lógica para Produtos em Destaque (usando 'allProductsData' do estado)
  const FEATURED_PRODUCTS_COUNT = 2;
  const [featuredCurrentIndex, setFeaturedCurrentIndex] = useState(0);
  const featuredProductsData = allProductsData.slice(0, 6);
  const handleFeaturedNext = () =>
    setFeaturedCurrentIndex((prevIndex) =>
      Math.min(
        prevIndex + FEATURED_PRODUCTS_COUNT,
        featuredProductsData.length - FEATURED_PRODUCTS_COUNT
      )
    );
  const handleFeaturedPrev = () =>
    setFeaturedCurrentIndex((prevIndex) =>
      Math.max(prevIndex - FEATURED_PRODUCTS_COUNT, 0)
    );
  const displayedFeaturedProducts = featuredProductsData.slice(
    featuredCurrentIndex,
    featuredCurrentIndex + FEATURED_PRODUCTS_COUNT
  );

  // Lógica para Novidades (usando 'allProductsData' do estado)
  const NEW_ARRIVALS_COUNT = 4;
  const [newArrivalsCurrentIndex, setNewArrivalsCurrentIndex] = useState(0);
  const newArrivalsData = allProductsData.slice(2, 10);
  const handleNewArrivalsNext = () =>
    setNewArrivalsCurrentIndex((prevIndex) =>
      Math.min(
        prevIndex + NEW_ARRIVALS_COUNT,
        newArrivalsData.length - NEW_ARRIVALS_COUNT
      )
    );
  const handleNewArrivalsPrev = () =>
    setNewArrivalsCurrentIndex((prevIndex) =>
      Math.max(prevIndex - NEW_ARRIVALS_COUNT, 0)
    );
  const displayedNewArrivalsProducts = newArrivalsData.slice(
    newArrivalsCurrentIndex,
    newArrivalsCurrentIndex + NEW_ARRIVALS_COUNT
  );

  // Lógica para Navegue por Marcas (usando 'allProductsData' do estado)
  const ITEMS_PER_BRAND_PAGE = 3;
  const brands = [...new Set(allProductsData.map((p) => p.fabricante))];
  const [activeBrandFilter, setActiveBrandFilter] = useState("All");
  const [brandDisplayedCount, setBrandDisplayedCount] =
    useState(ITEMS_PER_BRAND_PAGE);
  const filteredByBrandProducts = allProductsData.filter((product) =>
    activeBrandFilter === "All"
      ? true
      : product.fabricante === activeBrandFilter
  );
  const displayedBrandProducts = filteredByBrandProducts.slice(
    0,
    brandDisplayedCount
  );
  const handleLoadMoreBrand = () =>
    setBrandDisplayedCount((prevCount) =>
      Math.min(prevCount + ITEMS_PER_BRAND_PAGE, filteredByBrandProducts.length)
    );
  const handleBrandFilterClick = (brand) => {
    setActiveBrandFilter(brand);
    setBrandDisplayedCount(ITEMS_PER_BRAND_PAGE);
  };

  // --- Funções de Navegação (para visualizações controladas por estado) ---
  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsCartViewActive(false);
    // Se estiver usando React Router, a navegação para detalhes do produto também seria um <Link> ou useNavigate
    // e não necessariamente controlada por este estado 'selectedProductId' globalmente no App,
    // a menos que App seja um layout que renderiza condicionalmente baseado na rota.
    window.scrollTo(0, 0);
  };

  const handleBackToStore = () => {
    setSelectedProductId(null);
    setIsCartViewActive(false);
    // Com React Router, isso geralmente seria uma navegação para a rota da home, ex: navigate('/');
    window.scrollTo(0, 0);
  };

  const toggleCartView = () => {
    setIsCartViewActive((prev) => !prev);
    setSelectedProductId(null);
    // Similar ao handleProductClick, a visualização do carrinho idealmente seria uma rota.
    if (!isCartViewActive) window.scrollTo(0, 0);
  };

  // --- Funções do Carrinho ---
  const handleAddToCart = (productId, quantityToAdd) => {
    const productToAdd = allProductsData.find((p) => p.id === productId);
    if (!productToAdd) {
      console.error("Produto não encontrado:", productId);
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem) {
        let newQuantity = existingItem.quantity + quantityToAdd;
        if (newQuantity > productToAdd.quantidade) {
          newQuantity = productToAdd.quantidade;
          alert(
            `Quantidade ajustada para o máximo em estoque (${productToAdd.quantidade}).`
          );
        }
        if (newQuantity <= 0)
          return prevItems.filter((item) => item.id !== productId);
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantityToAdd > productToAdd.quantidade) {
          quantityToAdd = productToAdd.quantidade;
          alert(
            `Quantidade ajustada para o máximo em estoque (${productToAdd.quantidade}).`
          );
        }
        if (quantityToAdd <= 0) return prevItems;
        return [
          ...prevItems,
          {
            id: productToAdd.id,
            nome: productToAdd.nome,
            preco: productToAdd.preco,
            imagem: productToAdd.imagens[0],
            quantity: quantityToAdd,
          },
        ];
      }
    });
    if (!isCartViewActive) {
      setIsCartViewActive(true); // Abre o carrinho
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    const productInAllData = allProductsData.find((p) => p.id === productId);
    if (!productInAllData) return;
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    let validatedQuantity = newQuantity;
    if (newQuantity > productInAllData.quantidade) {
      validatedQuantity = productInAllData.quantidade;
      alert(`Quantidade máxima em estoque é ${validatedQuantity}.`);
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: validatedQuantity } : item
      )
    );
  };

  // Função para ser chamada pela ProductRegistrationPage
  // Se ProductRegistrationPage é uma rota, esta função precisa ser passada
  // através das props da rota ou usar Context/Redux para atualizar allProductsData.
  const handleAddNewProduct = (newProduct) => {
    setAllProductsData((prevProducts) => [newProduct, ...prevProducts]);
    alert(`Produto "${newProduct.nome}" cadastrado!`);
    // Com React Router, você usaria navigate('/') ou similar para voltar à home após o cadastro.
  };

  // --- Renderização Condicional (para visualizações que não são rotas principais) ---
  // Se você está usando React Router extensivamente, App.js geralmente configura as <Routes> e <Route>.
  // As visualizações de ProductDetail e Cart também se tornariam rotas.
  // Por agora, mantendo sua estrutura de estado para ProductDetail e Cart:
  if (selectedProductId) {
    const productToDisplay = allProductsData.find(
      (p) => p.id === selectedProductId
    );
    return (
      <div className="app-wrapper-monochrome">
        {/* O Header poderia ser um componente separado e incluído aqui também,
            ou estar fora desta lógica condicional se for comum a todas as "páginas" */}
        <ProductDetailPage
          product={productToDisplay}
          onAddToCart={handleAddToCart}
          onBack={handleBackToStore}
        />
      </div>
    );
  }

  function smoothScroll(target, duration = 600) {
    const start = window.pageYOffset;
    const end = target.getBoundingClientRect().top + start;
    const distance = end - start;
    let startTime = null;

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, start, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  const handleScroll = () => {
    const element = document.getElementById("viewAll");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isCartViewActive) {
    return (
      <div className="app-wrapper-monochrome">
        <header className="header-mono">
          <nav className="main-nav-mono">
            <Link to="/">HOME</Link>
            <Link to="/ProductResgistration">CADASTRAR PRODUTO</Link>
            <Link to="/ProductEditPage">EDITAR PRODUTO</Link>
          </nav>
          <div
            className="logo-mono central-logo-mono"
            onClick={() => {
              /* idealmente navigate('/') */ handleBackToStore();
            }}
            style={{ cursor: "pointer" }}
          >
            TechNova
          </div>
          <div className="header-icons-mono">
            <span>&#128269;</span>
            <span>CONTA</span>
            <span
              onClick={toggleCartView}
              style={{
                cursor: "pointer",
                fontWeight: cartItems.length > 0 ? "bold" : "normal",
              }}
            >
              CARRINHO (
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </span>
          </div>
        </header>
        <CartView
          cartItems={cartItems}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onCloseCart={toggleCartView}
          allProducts={allProductsData}
        />
        <footer className="footer-mono">{/* ... seu footer ... */}</footer>
      </div>
    );
  }

  // Renderização da loja principal (Home)
  // Se App.js é o local onde as rotas são definidas, esta parte seria o elemento da rota "/"
  return (
    <div className="app-wrapper-monochrome">
      <header className="header-mono">
        <nav className="main-nav-mono">
          <Link to="/">HOME</Link>
          <Link to="/ProductRegistration">CADASTRAR PRODUTO</Link>
          <Link to="/ProductManagementList">EDITAR PRODUTO</Link>
        </nav>
        <div
          className="logo-mono central-logo-mono"
          onClick={() => {
            /* idealmente navigate('/') */ handleBackToStore();
          }}
          style={{ cursor: "pointer" }}
        >
          TechNova
        </div>
        <div className="header-icons-mono">
          <span>&#128269;</span>
          <span>CONTA</span>
          <span
            onClick={toggleCartView}
            style={{
              cursor: "pointer",
              fontWeight: cartItems.length > 0 ? "bold" : "normal",
            }}
          >
            CARRINHO ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </span>
        </div>
      </header>

      {/* Conteúdo da Loja Principal */}
      <section className="section-mono new-collection-mono">
        <div className="new-collection-text">
          <h2>Produtos em Destaque</h2>
          <p className="collection-description">
            Confira nossas principais ofertas e os produtos mais procurados
            pelos nossos clientes.
          </p>
          <div className="collection-actions">
            <button
              onClick={handleScroll}
              className="button-mono primary-button-mono"
            >
              VER TODOS
            </button>
            <div className="nav-arrows-mono">
              <span
                onClick={handleFeaturedPrev}
                className={featuredCurrentIndex === 0 ? "disabled-arrow" : ""}
              >
                &lt;
              </span>
              <span
                onClick={handleFeaturedNext}
                className={
                  featuredCurrentIndex >=
                  featuredProductsData.length - FEATURED_PRODUCTS_COUNT
                    ? "disabled-arrow"
                    : ""
                }
              >
                &gt;
              </span>
            </div>
          </div>
        </div>
        <div className="new-collection-products-mono">
          {displayedFeaturedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showPrice={true}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      </section>

      <section className="section-mono new-this-week-mono">
        <div className="section-header-mono">
          <h3>
            Novidades <span className="badge-mono">NEW</span>
          </h3>
          <div className="nav-arrows-mono small-arrows-mono">
            <span
              onClick={handleNewArrivalsPrev}
              className={newArrivalsCurrentIndex === 0 ? "disabled-arrow" : ""}
            >
              &lt;
            </span>
            <span
              onClick={handleNewArrivalsNext}
              className={
                newArrivalsCurrentIndex >=
                newArrivalsData.length - NEW_ARRIVALS_COUNT
                  ? "disabled-arrow"
                  : ""
              }
            >
              &gt;
            </span>
          </div>
        </div>
        <div className="horizontal-product-grid-mono">
          {displayedNewArrivalsProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              size="small"
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      </section>

      <section id={"viewAll"} className="section-mono xiv-collections-mono">
        <div className="section-header-mono">
          <h3>Navegue por Marcas</h3>
          <div className="collection-filters-mono">
            <a
              href="#"
              className={
                activeBrandFilter === "All" ? "active-filter-mono" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                handleBrandFilterClick("All");
              }}
            >
              Todas
            </a>
            {brands.map((brand) => (
              <a
                key={brand}
                href="#"
                className={
                  activeBrandFilter === brand ? "active-filter-mono" : ""
                }
                onClick={(e) => {
                  e.preventDefault();
                  handleBrandFilterClick(brand);
                }}
              >
                {brand}
              </a>
            ))}
          </div>
        </div>
        <div className="main-product-grid-mono">
          {displayedBrandProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
        {brandDisplayedCount < filteredByBrandProducts.length && (
          <div className="load-more-container-mono">
            <button
              className="button-mono secondary-button-mono"
              onClick={handleLoadMoreBrand}
            >
              CARREGAR MAIS
            </button>
          </div>
        )}
      </section>

      <footer className="footer-mono">
        <div className="footer-links-mono">
          <a href="#">SOBRE A TECHNOVA</a>
          <a href="#">CONTATO</a>
          <a href="#">ENTREGAS</a>
          <a href="#">AJUDA</a>
        </div>
        <div className="footer-logo-mono">
          <div>TechNova</div>
        </div>
        <div className="footer-bottom-text-mono">
          <p>
            &copy; {new Date().getFullYear()} TechNova Store. TODOS OS DIREITOS
            RESERVADOS.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
