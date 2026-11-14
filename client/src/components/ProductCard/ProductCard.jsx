import { useNavigate } from 'react-router-dom';
import { HiStar } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import '../../styles/ProductCard.css';

const formatPrice = (paise) => {
  return '₹' + (paise / 100).toLocaleString('en-IN');
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product._id, 1, product.sizes?.[0], product.colors?.[0]?.name, product);
  };

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="product-card-image">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.name}
          loading="lazy"
        />

        {discount > 0 && <span className="product-card-badge">{discount}% Off</span>}

        {product.stock <= 0 && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}

        {product.stock > 0 && (
          <div className="product-card-actions">
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        )}
      </div>

      <div className="product-card-info">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
          {discount > 0 && <span className="discount">{discount}% off</span>}
        </div>
        {product.rating > 0 && (
          <div className="product-card-rating">
            <span className="stars">
              {[...Array(5)].map((_, i) => (
                <HiStar key={i} style={{ opacity: i < Math.round(product.rating) ? 1 : 0.2 }} />
              ))}
            </span>
            <span>({product.numReviews})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
