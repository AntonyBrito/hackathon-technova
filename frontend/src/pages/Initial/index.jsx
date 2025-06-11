import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import "./Styles/style.css";
import ProductDetailPage from "../Product";
import CartView from "../Cart";
import Header from "../../components/Header"; 
import { getProducts, checkoutService } from "../../services/productService";

const extractType = (productName) => {
  if (!productName) return "Outros";
  const lowerCaseName = productName.toLowerCase();
  if (lowerCaseName.includes("fone") || lowerCaseName.includes("headset"))
    return "Fones & Headsets";
  if (lowerCaseName.includes("mouse")) return "Mouses";
  if (lowerCaseName.includes("teclado")) return "Teclados";
  return "Outros";
};

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
        <ProductImage
          src={product.imageUrls && product.imageUrls[0]}
          alt={product.name}
        />
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

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartViewActive, setIsCartViewActive] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      const sortedData = data.sort((a, b) => b.id - a.id);
      setAllProducts(sortedData);
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

  const FEATURED_PRODUCTS_COUNT = 2;
  const [featuredCurrentIndex, setFeaturedCurrentIndex] = useState(0);
  const featuredProductsData = allProducts.slice(2, 8);
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
  const newArrivalsData = allProducts.slice(0, 8);
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

  const ITEMS_PER_PAGE = 6;
  const brands = [...new Set(allProducts.map((p) => p.manufacturer))];
  const colors = [...new Set(allProducts.map((p) => p.color).filter(Boolean))];
  const types = [...new Set(allProducts.map((p) => extractType(p.name)))];

  const [activeBrandFilter, setActiveBrandFilter] = useState("All");
  const [activeColorFilter, setActiveColorFilter] = useState("All");
  const [activeTypeFilter, setActiveTypeFilter] = useState("All");

  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

  const filteredProducts = allProducts.filter((p) => {
    const brandMatch =
      activeBrandFilter === "All" || p.manufacturer === activeBrandFilter;
    const colorMatch =
      activeColorFilter === "All" || p.color === activeColorFilter;
    const typeMatch =
      activeTypeFilter === "All" || extractType(p.name) === activeTypeFilter;
    return brandMatch && colorMatch && typeMatch;
  });

  const displayedFilteredProducts = filteredProducts.slice(0, displayedCount);

  const handleLoadMore = () =>
    setDisplayedCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length)
    );

  const handleFilterClick = (filterType, value) => {
    if (filterType === "brand") setActiveBrandFilter(value);
    if (filterType === "color") setActiveColorFilter(value);
    if (filterType === "type") setActiveTypeFilter(value);
    setDisplayedCount(ITEMS_PER_PAGE);
  };

  const handleGoHome = () => {
    setSelectedProductId(null);
    setIsCartViewActive(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 820);

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
    const result = await Swal.fire({
      title: 'Deseja finalizar a compra?',
      text: "Esta ação atualizará o estoque dos produtos.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, finalizar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await checkoutService(cartItems, allProducts);
        Swal.fire(
          'Compra Realizada!',
          'Sua compra foi processada com sucesso.',
          'success'
        );
        setCartItems([]);
        setIsCartViewActive(false);
        await fetchProducts();
      } catch (error) {
        Swal.fire(
          'Erro!',
          `Ocorreu um problema: ${error.message}`,
          'error'
        );
      }
    }
  };

  const handleScrollToFilters = () => {
    const element = document.getElementById("filters");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
          cartItemCount={cartItemCount}
          isCartAnimating={isCartAnimating}
          onCartClick={toggleCartView}
          onLogoClick={handleGoHome}
        />
      </div>
    );
  }

  if (isCartViewActive) {
    return (
      <div className="app-wrapper-monochrome">
        <Header
            cartItemCount={cartItemCount}
            isCartAnimating={isCartAnimating}
            onCartClick={toggleCartView}
            onLogoClick={handleGoHome}
        />
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

  return (
    <div className="app-wrapper-monochrome">
      <Header
          cartItemCount={cartItemCount}
          isCartAnimating={isCartAnimating}
          onCartClick={toggleCartView}
          onLogoClick={handleGoHome}
      />

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
                  onClick={handleScrollToFilters}
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

          <section id={"filters"} className="section-mono xiv-collections-mono">
            <div className="section-header-mono">
              <h3>Navegue por...</h3>
            </div>

            <div className="filters-main-container-mono">
              <div className="filter-group-mono">
                <h4>Marca</h4>
                <div className="collection-filters-mono">
                  <a
                    href="#"
                    className={
                      activeBrandFilter === "All" ? "active-filter-mono" : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilterClick("brand", "All");
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
                        handleFilterClick("brand", brand);
                      }}
                    >
                      {brand}
                    </a>
                  ))}
                </div>
              </div>

              <div className="filter-group-mono">
                <h4>Cor</h4>
                <div className="collection-filters-mono">
                  <a
                    href="#"
                    className={
                      activeColorFilter === "All" ? "active-filter-mono" : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilterClick("color", "All");
                    }}
                  >
                    Todas
                  </a>
                  {colors.map((color) => (
                    <a
                      key={color}
                      href="#"
                      className={
                        activeColorFilter === color ? "active-filter-mono" : ""
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilterClick("color", color);
                      }}
                    >
                      {color}
                    </a>
                  ))}
                </div>
              </div>

              <div className="filter-group-mono">
                <h4>Tipo</h4>
                <div className="collection-filters-mono">
                  <a
                    href="#"
                    className={
                      activeTypeFilter === "All" ? "active-filter-mono" : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilterClick("type", "All");
                    }}
                  >
                    Todos
                  </a>
                  {types.map((type) => (
                    <a
                      key={type}
                      href="#"
                      className={
                        activeTypeFilter === type ? "active-filter-mono" : ""
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilterClick("type", type);
                      }}
                    >
                      {type}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="main-product-grid-mono">
              {displayedFilteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
            {displayedCount < filteredProducts.length && (
              <div className="load-more-container-mono">
                <button
                  className="button-mono secondary-button-mono"
                  onClick={handleLoadMore}
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