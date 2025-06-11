import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Styles/style.css";
import ProductDetailPage from "../Product";
import CartView from "../Cart";
import { getProducts, checkoutService } from "../../services/productService";

// --- COMPONENTES INTERNOS (ProductImage e ProductCard) ---
const ProductImage = ({ src, alt, className = "" }) => {
  return (
    <div className={`product-image-container ${className}`}>
      <img src={src || "https://via.placeholder.com/300"} alt={alt} />
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
        <ProductImage src={product.imageUrls[0]} alt={product.name} />
      </div>
      <p className="product-name">{product.name}</p>
      {showPrice && product.price && (
        <p className="product-price">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartViewActive, setIsCartViewActive] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setAllProducts(data);
      setError(null);
    } catch (err) {
      setError(
        "Não foi possível carregar os produtos. Verifique se o back-end está rodando."
      );
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- LÓGICA PARA OS COMPONENTES DA PÁGINA (DESTAQUES, NOVIDADES, MARCAS) ---
  const FEATURED_PRODUCTS_COUNT = 2;
  const [featuredCurrentIndex, setFeaturedCurrentIndex] = useState(0);
  const featuredProductsData = allProducts.slice(0, 6);
  const handleFeaturedNext = () =>
    setFeaturedCurrentIndex((prev) =>
      Math.min(
        prev + FEATURED_PRODUCTS_COUNT,
        featuredProductsData.length - FEATURED_PRODUCTS_COUNT
      )
    );
  const handleFeaturedPrev = () =>
    setFeaturedCurrentIndex((prev) =>
      Math.max(prev - FEATURED_PRODUCTS_COUNT, 0)
    );
  const displayedFeaturedProducts = featuredProductsData.slice(
    featuredCurrentIndex,
    featuredCurrentIndex + FEATURED_PRODUCTS_COUNT
  );

  const NEW_ARRIVALS_COUNT = 4;
  const [newArrivalsCurrentIndex, setNewArrivalsCurrentIndex] = useState(0);
  const newArrivalsData = allProducts.slice(2, 10);
  const handleNewArrivalsNext = () =>
    setNewArrivalsCurrentIndex((prev) =>
      Math.min(
        prev + NEW_ARRIVALS_COUNT,
        newArrivalsData.length - NEW_ARRIVALS_COUNT
      )
    );
  const handleNewArrivalsPrev = () =>
    setNewArrivalsCurrentIndex((prev) =>
      Math.max(prev - NEW_ARRIVALS_COUNT, 0)
    );
  const displayedNewArrivalsProducts = newArrivalsData.slice(
    newArrivalsCurrentIndex,
    newArrivalsCurrentIndex + NEW_ARRIVALS_COUNT
  );

  const ITEMS_PER_BRAND_PAGE = 3;
  const brands = [...new Set(allProducts.map((p) => p.manufacturer))];
  const [activeBrandFilter, setActiveBrandFilter] = useState("All");
  const [brandDisplayedCount, setBrandDisplayedCount] =
    useState(ITEMS_PER_BRAND_PAGE);
  const filteredByBrandProducts = allProducts.filter(
    (p) => activeBrandFilter === "All" || p.manufacturer === activeBrandFilter
  );
  const displayedBrandProducts = filteredByBrandProducts.slice(
    0,
    brandDisplayedCount
  );
  const handleLoadMoreBrand = () =>
    setBrandDisplayedCount((prev) =>
      Math.min(prev + ITEMS_PER_BRAND_PAGE, filteredByBrandProducts.length)
    );
  const handleBrandFilterClick = (brand) => {
    setActiveBrandFilter(brand);
    setBrandDisplayedCount(ITEMS_PER_BRAND_PAGE);
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsCartViewActive(false);
    window.scrollTo(0, 0);
  };

  const handleBackToStore = () => {
    setSelectedProductId(null);
    setIsCartViewActive(false);
    window.scrollTo(0, 0);
  };

  const toggleCartView = () => {
    setIsCartViewActive((prev) => !prev);
    setSelectedProductId(null);
    if (!isCartViewActive) window.scrollTo(0, 0);
  };

  const handleAddToCart = (productId, quantityToAdd) => {
    const productToAdd = allProducts.find((p) => p.id === productId);
    if (!productToAdd) return;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem) {
        let newQuantity = existingItem.quantity + quantityToAdd;
        if (newQuantity > productToAdd.quantity) {
          newQuantity = productToAdd.quantity;
          alert(
            `Quantidade ajustada para o máximo em estoque (${productToAdd.quantity}).`
          );
        }
        if (newQuantity <= 0)
          return prevItems.filter((item) => item.id !== productId);
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantityToAdd > productToAdd.quantity) {
          quantityToAdd = productToAdd.quantity;
          alert(
            `Quantidade ajustada para o máximo em estoque (${productToAdd.quantity}).`
          );
        }
        if (quantityToAdd <= 0) return prevItems;
        return [
          ...prevItems,
          {
            id: productToAdd.id,
            name: productToAdd.name,
            price: productToAdd.price,
            imageUrl: productToAdd.imageUrls[0],
            quantity: quantityToAdd,
          },
        ];
      }
    });
    if (!isCartViewActive) {
      setIsCartViewActive(true);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    const productData = allProducts.find((p) => p.id === productId);
    if (!productData) return;
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    let validatedQuantity =
      newQuantity > productData.quantity ? productData.quantity : newQuantity;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: validatedQuantity } : item
      )
    );
  };

  const handleFinalizePurchase = async () => {
    if (!window.confirm("Tem certeza que deseja finalizar a compra?")) {
      return;
    }
    try {
      // Chama o serviço de checkout
      await checkoutService(cartItems, allProducts);

      alert("Compra realizada com sucesso!");

      // Limpa o carrinho
      setCartItems([]);

      // Esconde a visualização do carrinho
      setIsCartViewActive(false);

      // Recarrega os produtos do servidor para obter as quantidades atualizadas
      await fetchProducts();
    } catch (error) {
      alert(`Erro ao processar a compra: ${error.message}`);
    }
  };

  const handleScroll = () => {
    const element = document.getElementById("viewAll");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- RENDERIZAÇÃO CONDICIONAL ---
  if (selectedProductId) {
    const productToDisplay = allProducts.find(
      (p) => p.id === selectedProductId
    );
    return (
      <div className="app-wrapper-monochrome">
        <ProductDetailPage
          product={productToDisplay}
          onAddToCart={handleAddToCart}
          onBack={handleBackToStore}
        />
      </div>
    );
  }

  if (isCartViewActive) {
    return (
      <div className="app-wrapper-monochrome">
        <header className="header-mono">
          <nav className="main-nav-mono">
            <Link to="/">HOME</Link>
            <Link to="/ProductRegistration">CADASTRAR PRODUTO</Link>
            <Link to="/ProductEdit">EDITAR PRODUTO</Link>
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
          allProducts={allProducts}
          onFinalizePurchase={handleFinalizePurchase}
        />
      </div>
    );
  }

  // --- RENDERIZAÇÃO DA LOJA PRINCIPAL (HOME) ---
  return (
    <div className="app-wrapper-monochrome">
      <header className="header-mono">
        <nav className="main-nav-mono">
          <Link to="/">HOME</Link>
          <Link to="/ProductRegistration">CADASTRAR PRODUTO</Link>
          <Link to="/ProductEdit">EDITAR PRODUTO</Link>
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

      {isLoading && (
        <p style={{ textAlign: "center", padding: "40px" }}>Carregando...</p>
      )}
      {error && (
        <p style={{ textAlign: "center", padding: "40px", color: "red" }}>
          {error}
        </p>
      )}

      {!isLoading && !error && allProducts.length > 0 && (
        <>
          <section className="section-mono new-collection-mono">
            <div className="new-collection-text">
              <h2>Produtos em Destaque</h2>
              <p className="collection-description">
                Confira nossas principais ofertas e os produtos mais procurados.
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
                    className={
                      featuredCurrentIndex === 0 ? "disabled-arrow" : ""
                    }
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
                  className={
                    newArrivalsCurrentIndex === 0 ? "disabled-arrow" : ""
                  }
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
        </>
      )}

      <footer className="footer-mono">
        <div className="footer-links-mono">
          <a href="#">SOBRE A TECHNOVA</a>
          <a href="#">CONTATO</a>
          <a href="#">ENTREGAS</a>
          <a href="#">AJUDA</a>
        </div>
        <div className="footer-logo-mono">TechNova</div>
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
