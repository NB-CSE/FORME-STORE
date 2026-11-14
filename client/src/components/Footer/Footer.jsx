import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">FORME</div>
          <p>Curated essentials for the modern individual. Timeless design meets everyday functionality.</p>
        </div>

        <div className="footer-column">
          <h4>Shop</h4>
          <Link to="/products?category=Clothing">Clothing</Link>
          <Link to="/products?category=Accessories">Accessories</Link>
          <Link to="/products?category=Footwear">Footwear</Link>
          <Link to="/products?category=Bags">Bags</Link>
          <Link to="/products?category=Beauty">Beauty</Link>
          <Link to="/products?category=Home">Home</Link>
        </div>

        <div className="footer-column">
          <h4>Help</h4>
          <Link to="/products">Browse Products</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/orders">Track Order</Link>
          <Link to="/account">My Account</Link>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <a href="mailto:hello@forme.com">hello@forme.com</a>
          <a href="tel:+919999999999">+91 99999 99999</a>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Mon — Sat, 10am — 7pm IST</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FORME. All rights reserved.</p>
        <div className="footer-socials">
          <HiOutlineMail style={{ fontSize: '1.25rem' }} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
