import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">FORME</Link>

        <div className="navbar-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/products?category=Clothing">Clothing</NavLink>
          <NavLink to="/products?category=Accessories">Accessories</NavLink>
        </div>

        <div className="navbar-icons">
          <button className="navbar-icon" onClick={() => navigate('/products')} title="Search">
            <HiOutlineSearch />
          </button>

          <button className="navbar-icon" onClick={() => navigate('/cart')} title="Cart">
            <HiOutlineShoppingBag />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="navbar-icon" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <HiOutlineUser />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-name">{user?.name}</div>
                  <Link to="/account" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                  <Link to="/orders" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                  {isAdmin && (
                    <>
                      <div className="dropdown-divider" />
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}>Admin Dashboard</Link>
                    </>
                  )}
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar-icon" onClick={() => navigate('/login')} title="Login">
              <HiOutlineUser />
            </button>
          )}

          <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
        <NavLink to="/products" onClick={() => setMobileOpen(false)}>Shop</NavLink>
        <NavLink to="/products?category=Clothing" onClick={() => setMobileOpen(false)}>Clothing</NavLink>
        <NavLink to="/products?category=Accessories" onClick={() => setMobileOpen(false)}>Accessories</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/account" onClick={() => setMobileOpen(false)}>My Account</NavLink>
            <NavLink to="/orders" onClick={() => setMobileOpen(false)}>My Orders</NavLink>
            {isAdmin && <NavLink to="/admin" onClick={() => setMobileOpen(false)}>Admin</NavLink>}
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ textAlign: 'left', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--color-border)' }}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={() => setMobileOpen(false)}>Login</NavLink>
            <NavLink to="/register" onClick={() => setMobileOpen(false)}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
