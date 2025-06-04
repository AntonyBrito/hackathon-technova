import React, { useState } from "react";
import "./Styles/style.css"; // Ou o caminho correto para seu CSS
import ProductDetailPage from "../Product"; // <-- IMPORTAÇÃO DO NOVO ARQUIVO

// --- NOVOS DADOS DOS PRODUTOS (TechNova) ---
const allProductsData = [
  // ... (Seus dados de produtos permanecem aqui) ...
  {
    id: "tech001",
    nome: "Fone com Microfone",
    textoDescritivo:
      "Fone de Ouvido com Microfone, Loop Way, P3, ideal para chamadas e audio com clareza.",
    cor: "Branco",
    fabricante: "Philips",
    preco: 39.99,
    quantidade: 27,
    imagens: [
      "https://i.ibb.co/zhRPrqQS/01.jpg",
      "https://i.ibb.co/Vp0B2h2m/02.jpg",
      "https://i.ibb.co/nqXtTqG4/03.jpg",
    ],
  },
  {
    id: "tech002",
    nome: "Mouse Gamer",
    textoDescritivo:
      "Mouse Gamer Óptico Nitro 7200 DPI, 6 Botões, USB, alta precisão para seus jogos.",
    cor: "Preto",
    fabricante: "Acer",
    preco: 79.99,
    quantidade: 18,
    imagens: [
      "https://i.ibb.co/60gSPfDP/01.jpg",
      "https://i.ibb.co/prfqF9fM/02.jpg",
      "https://i.ibb.co/tTx9zdtd/03.jpg",
    ],
  },
  {
    id: "tech003",
    nome: "HeadSet",
    textoDescritivo:
      "HeadSet Gamer com Microfone Quantum II, P3, imersão sonora e comunicação cristalina.",
    cor: "Preto",
    fabricante: "JBL",
    preco: 119.99,
    quantidade: 19,
    imagens: [
      "https://i.ibb.co/xqz36nXW/01.jpg",
      "https://i.ibb.co/k6zsq6VW/03.jpg",
      "https://i.ibb.co/wNBdSfg5/02.jpg",
    ],
  },
  {
    id: "tech004",
    nome: "Teclado Gamer",
    textoDescritivo:
      "Teclado Mecânico Gamer Phantom, ABNT2, com iluminação RGB e alta durabilidade.",
    cor: "Preto",
    fabricante: "Fortrek",
    preco: 99.99,
    quantidade: 12,
    imagens: [
      "https://i.ibb.co/9zDbk1w/01.jpg",
      "https://i.ibb.co/0j0gTT5H/02.jpg",
      "https://i.ibb.co/DHCSqKsd/03.jpg",
    ],
  },
  {
    id: "tech005",
    nome: "Fone Bluetooth",
    textoDescritivo:
      "Fone de Ouvido Tune Buds, Bluetooth, som de alta qualidade e liberdade sem fios.",
    cor: "Preto",
    fabricante: "JBL",
    preco: 389.9,
    quantidade: 3,
    imagens: [
      "https://i.ibb.co/pB2hLd9R/03.jpg",
      "https://i.ibb.co/3mSRMSgd/02.jpg",
      "https://i.ibb.co/ch0hNMsv/04.jpg",
    ],
  },
  {
    id: "tech006",
    nome: "Teclado Slim",
    textoDescritivo:
      "Teclado Membrana Fortrek K15, ABNT2, USB, design compacto e digitação confortável.",
    cor: "Preto",
    fabricante: "Fortrek",
    preco: 89.99,
    quantidade: 11,
    imagens: [
      "https://i.ibb.co/G4BR1Sds/03.jpg",
      "https://i.ibb.co/wZr6MgWB/02.jpg",
      "https://i.ibb.co/tTYkZ85S/01.jpg",
    ],
  },
  {
    id: "tech007",
    nome: "Mouse HX",
    textoDescritivo:
      "Mouse Pulsefire Haste 2 Mini, 26000dpi, 6 Botões, Wireless, leve e ultra rápido.",
    cor: "Preto",
    fabricante: "Hyperx",
    preco: 379.99,
    quantidade: 5,
    imagens: [
      "https://i.ibb.co/Zp3rKKBQ/01.jpg",
      "https://i.ibb.co/fzhyhJfc/02.jpg",
      "https://i.ibb.co/nskSxbrP/03.jpg",
    ],
  },
  {
    id: "tech008",
    nome: "Fone Wireless",
    textoDescritivo:
      "Fone de Ouvido Tune Flex, Wireless, graves potentes e design ergonômico.",
    cor: "Preto",
    fabricante: "JBL",
    preco: 439.99,
    quantidade: 0,
    imagens: [
      "https://i.ibb.co/JjM8Kn9B/02.jpg",
      "https://i.ibb.co/XrWMYMZj/03.jpg",
      "https://i.ibb.co/ksHzyn0Q/01.jpg",
    ],
  },
  {
    id: "tech009",
    nome: "Teclado Slim Branco",
    textoDescritivo:
      "Teclado Membrana Fortrek K15, ABNT2, USB, elegante na cor branca.",
    cor: "Branco",
    fabricante: "Fortrek",
    preco: 105.99,
    quantidade: 8,
    imagens: [
      "https://i.ibb.co/RGDt1tQG/03.jpg",
      "https://i.ibb.co/wrsf52qB/02.jpg",
      "https://i.ibb.co/XfcFtrCH/01.jpg",
    ],
  },
  {
    id: "tech010",
    nome: "Mouse King Vermelho",
    textoDescritivo:
      "Mouse King Pro Horda World of Warcraft, 26000dpi, 5 Botões, edição especial.",
    cor: "Vermelho",
    fabricante: "Redragon",
    preco: 329.99,
    quantidade: 6,
    imagens: [
      "https://i.ibb.co/NnGDKpRD/04.jpg",
      "https://i.ibb.co/8DJncPDX/02.jpg",
      "https://i.ibb.co/wN0tr7sk/01.jpg",
    ],
  },
  {
    id: "tech011",
    nome: "Fone Pure Bass",
    textoDescritivo:
      "Fone de Ouvido Tune 500 Pure Bass, P2, som lendário JBL com graves profundos.",
    cor: "Branco",
    fabricante: "JBL",
    preco: 139.99,
    quantidade: 12,
    imagens: [
      "https://i.ibb.co/LdwJHxtZ/01.jpg",
      "https://i.ibb.co/GQ4T0xTd/03.jpg",
      "https://i.ibb.co/gFXrgBLk/02.jpg",
    ],
  },
  {
    id: "tech012",
    nome: "Mouse King Azul",
    textoDescritivo:
      "Mouse King Pro Aliança World of Warcraft, 26000dpi, 5 Botões, edição especial.",
    cor: "Azul",
    fabricante: "Redragon",
    preco: 319.99,
    quantidade: 8,
    imagens: [
      "https://i.ibb.co/R47938fc/01.jpg",
      "https://i.ibb.co/fV3CvpfR/02.jpg",
      "https://i.ibb.co/ccdSz1n9/03.jpg",
    ],
  },
];
// --- FIM DOS DADOS SIMULADOS ---

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
