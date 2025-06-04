import React from 'react';
import './Styles/style.css';

function HomePage() {
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
          <span>&#128269;</span> {/* Search */}
          <span>CONTA</span>
          <span>CARRINHO</span>
        </div>
      </header>

      {/* Produtos em Destaque */}
      <section className="section-mono new-collection-mono"> {/* Mantendo classes para reutilizar estilo */}
        <div className="new-collection-text">
          <h2>Produtos em Destaque</h2>
          {/* <p className="collection-year">Tecnologia / Inovação</p> Removido */}
          <p className="collection-description">
            Confira nossas principais ofertas e os produtos mais procurados pelos nossos clientes.
          </p>
          <div className="collection-actions">
            <button className="button-mono primary-button-mono">VER TODOS</button>
            <div className="nav-arrows-mono">
              <span onClick={handleFeaturedPrev} className={featuredCurrentIndex === 0 ? 'disabled-arrow' : ''}>&lt;</span>
              <span onClick={handleFeaturedNext} className={featuredCurrentIndex >= featuredProductsData.length - FEATURED_PRODUCTS_COUNT ? 'disabled-arrow' : ''}>&gt;</span>
            </div>
          </div>
        </div>
        <div className="new-collection-products-mono">
          {displayedFeaturedProducts.map(product => (
            <ProductCard key={product.id} product={product} showPrice={true} />
          ))}
        </div>
      </section>

      {/* Novidades */}
      <section className="section-mono new-this-week-mono">
        <div className="section-header-mono">
          <h3>Novidades <span className="badge-mono">NEW</span></h3>
          <div className="nav-arrows-mono small-arrows-mono">
            <span onClick={handleNewArrivalsPrev} className={newArrivalsCurrentIndex === 0 ? 'disabled-arrow' : ''}>&lt;</span>
            <span onClick={handleNewArrivalsNext} className={newArrivalsCurrentIndex >= newArrivalsData.length - NEW_ARRIVALS_COUNT ? 'disabled-arrow' : ''}>&gt;</span>
          </div>
        </div>
        <div className="horizontal-product-grid-mono">
          {displayedNewArrivalsProducts.map(product => (
            <ProductCard key={product.id} product={product} size="small" />
          ))}
        </div>
      </section>

      {/* Navegue por Marcas */}
      <section className="section-mono xiv-collections-mono"> {/* Mantendo classes para reutilizar estilo */}
        <div className="section-header-mono">
          <h3>Navegue por Marcas</h3>
          <div className="collection-filters-mono">
            <a
              href="#"
              className={activeBrandFilter === 'All' ? 'active-filter-mono' : ''}
              onClick={(e) => { e.preventDefault(); handleBrandFilterClick('All'); }}
            >
              Todas
            </a>
            {brands.map(brand => (
              <a
                key={brand}
                href="#"
                className={activeBrandFilter === brand ? 'active-filter-mono' : ''}
                onClick={(e) => { e.preventDefault(); handleBrandFilterClick(brand); }}
              >
                {brand}
              </a>
            ))}
          </div>
        </div>
        <div className="main-product-grid-mono">
          {displayedBrandProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {brandDisplayedCount < filteredByBrandProducts.length && (
          <div className="load-more-container-mono">
            <button className="button-mono secondary-button-mono" onClick={handleLoadMoreBrand}>CARREGAR MAIS</button>
          </div>
        )}
      </section>

      {/* Rodapé */}
      <footer className="footer-mono">
        <div className="footer-links-mono">
          <a href="#">SOBRE A TECHNOVA</a>
          <a href="#">CONTATO</a>
          <a href="#">ENTREGAS</a>
          <a href="#">AJUDA</a>
        </div>
        <div className="footer-logo-mono">
          {/* <span className="play-icon-mono">&#9654;</span> Ícone opcional */}
          <div>TechNova</div>
        </div>
        <div className="footer-bottom-text-mono">
          <p>&copy; {new Date().getFullYear()} TechNova Store. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;