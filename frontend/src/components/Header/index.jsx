import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/style.css';
import logo from '../../assets/logos/logo_sem_fundo.png';

const Header = ({
  cartItemCount = 0,  
  isCartAnimating = false,
  onCartClick,
  onLogoClick,
}) => {
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    <header className="header-mono">
      <nav className="main-nav-mono">
        <Link to="/">HOME</Link>
        <Link to="/ProductRegistration">CADASTRAR PRODUTO</Link>
        <Link to="/ProductEdit">EDITAR PRODUTO</Link>
      </nav>
      <div
        className="logo-mono central-logo-mono"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      >
        <img src={logo} alt="logo" style={{ width: '100px' }}/>
      </div>
      <div className="header-icons-mono">
        <span
          onClick={handleCartClick}
          className={isCartAnimating ? 'cart-animation' : ''}
          style={{
            cursor: 'pointer',
            fontWeight: cartItemCount > 0 ? 'bold' : 'normal',
          }}
        >
          CARRINHO ({cartItemCount})
        </span>
      </div>
    </header>
  );
};

export default Header;