import React, { useState } from "react";
import "./Styles/style.css"; // Ou o caminho correto para seu CSS
import ProductDetailPage from "../Product"; // <-- IMPORTAÇÃO DO NOVO ARQUIVO
import { allProductsData } from "../../assets/allProductsData";

// --- REMOVA A DEFINIÇÃO DE ProductDetailPage DAQUI ---

// --- COMPONENTES INTERNOS ---
const ProductImage = ({ src, alt, className = "" }) => {
  // ... (código do ProductImage permanece o mesmo) ...
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
  // ... (código do ProductCard permanece o mesmo) ...
  let cardClass = "product-card";
  if (size === "small") cardClass += " product-card-small";

  const handleCardClick = (e) => {
    if (e.target.closest("button")) {
      return;
    }
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
  // ... (toda a lógica de estado e funções do App permanece a mesma) ...
  const [selectedProductId, setSelectedProductId] = useState(null);

  const FEATURED_PRODUCTS_COUNT = 2;
  const [featuredCurrentIndex, setFeaturedCurrentIndex] = useState(0);
  const featuredProductsData = allProductsData.slice(0, 6);

  const handleFeaturedNext = () => {
    setFeaturedCurrentIndex((prevIndex) =>
      Math.min(
        prevIndex + FEATURED_PRODUCTS_COUNT,
        featuredProductsData.length - FEATURED_PRODUCTS_COUNT
      )
    );
  };
  const handleFeaturedPrev = () => {
    setFeaturedCurrentIndex((prevIndex) =>
      Math.max(prevIndex - FEATURED_PRODUCTS_COUNT, 0)
    );
  };
  const displayedFeaturedProducts = featuredProductsData.slice(
    featuredCurrentIndex,
    featuredCurrentIndex + FEATURED_PRODUCTS_COUNT
  );

  const NEW_ARRIVALS_COUNT = 4;
  const [newArrivalsCurrentIndex, setNewArrivalsCurrentIndex] = useState(0);
  const newArrivalsData = allProductsData.slice(2, 10);

  const handleNewArrivalsNext = () => {
    setNewArrivalsCurrentIndex((prevIndex) =>
      Math.min(
        prevIndex + NEW_ARRIVALS_COUNT,
        newArrivalsData.length - NEW_ARRIVALS_COUNT
      )
    );
  };
  const handleNewArrivalsPrev = () => {
    setNewArrivalsCurrentIndex((prevIndex) =>
      Math.max(prevIndex - NEW_ARRIVALS_COUNT, 0)
    );
  };
  const displayedNewArrivalsProducts = newArrivalsData.slice(
    newArrivalsCurrentIndex,
    newArrivalsCurrentIndex + NEW_ARRIVALS_COUNT
  );

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

  const handleLoadMoreBrand = () => {
    setBrandDisplayedCount((prevCount) =>
      Math.min(prevCount + ITEMS_PER_BRAND_PAGE, filteredByBrandProducts.length)
    );
  };

  const handleBrandFilterClick = (brand) => {
    setActiveBrandFilter(brand);
    setBrandDisplayedCount(ITEMS_PER_BRAND_PAGE);
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    window.scrollTo(0, 0);
  };

  const handleBackToStore = () => {
    setSelectedProductId(null);
  };

  const handleAddToCart = (productId, quantity) => {
    const product = allProductsData.find((p) => p.id === productId);
    alert(
      `"${product.nome}" (ID: ${productId}, Quantidade: ${quantity}) adicionado ao carrinho! (Simulação)`
    );
  };

  if (selectedProductId) {
    const productToDisplay = allProductsData.find(
      (p) => p.id === selectedProductId
    );
    return (
      <div className="app-wrapper-monochrome">
        <ProductDetailPage // <-- Usa o componente importado
          product={productToDisplay}
          onAddToCart={handleAddToCart}
          onBack={handleBackToStore}
        />
      </div>
    );
  }

  return (
    <div className="app-wrapper-monochrome">
      {/* ... (o JSX do layout principal da loja permanece o mesmo) ... */}
      <header className="header-mono">
        <nav className="main-nav-mono">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBackToStore();
            }}
          >
            HOME
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBackToStore();
            }}
          >
            PRODUTOS
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBackToStore();
            }}
          >
            MARCAS
          </a>
          <a href="#">SUPORTE</a>
        </nav>
        <div
          className="logo-mono central-logo-mono"
          onClick={handleBackToStore}
          style={{ cursor: "pointer" }}
        >
          TechNova
        </div>
        <div className="header-icons-mono">
          <span>&#128269;</span>
          <span>CONTA</span>
          <span>CARRINHO</span>
        </div>
      </header>

      <section className="section-mono new-collection-mono">
        <div className="new-collection-text">
          <h2>Produtos em Destaque</h2>
          <p className="collection-description">
            Confira nossas principais ofertas e os produtos mais procurados
            pelos nossos clientes.
          </p>
          <div className="collection-actions">
            <button className="button-mono primary-button-mono">
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

      <section className="section-mono xiv-collections-mono">
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
