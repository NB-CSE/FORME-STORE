import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiStar, HiMinus, HiPlus, HiArrowLeft } from 'react-icons/hi';
import { productAPI } from '../services/api';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import toast from 'react-hot-toast';

const formatPrice = (paise) => '₹' + (paise / 100).toLocaleString('en-IN');

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getProduct(id);
        if (data.success && data.product) {
          setProduct(data.product);
          if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
          if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0].name);
          return;
        }
      } catch {
        // Fallback to mock product
      }

      const found = MOCK_PRODUCTS.find(p => p._id === id);
      if (found) {
        setProduct(found);
        if (found.sizes?.length > 0) setSelectedSize(found.sizes[0]);
        if (found.colors?.length > 0) setSelectedColor(found.colors[0].name);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner text="Loading product..." />;
  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product._id, quantity, selectedSize, selectedColor, product);
  };

  return (
    <div style={{ padding: 'var(--space-2xl) 0 var(--space-4xl)', maxWidth: 'var(--max-width)', margin: '0 auto', paddingLeft: 'var(--space-lg)', paddingRight: 'var(--space-lg)' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2xl)', fontSize: 'var(--font-size-sm)' }}
      >
        <HiArrowLeft /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-3xl)', alignItems: 'start' }}>
        {/* Image Gallery */}
        <div>
          <div style={{ aspectRatio: '3/4', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-white)', marginBottom: 'var(--space-md)' }}>
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x800'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: 80, height: 80, borderRadius: 'var(--border-radius)',
                    overflow: 'hidden', cursor: 'pointer',
                    border: selectedImage === i ? '2px solid var(--color-charcoal)' : '2px solid transparent',
                    opacity: selectedImage === i ? 1 : 0.6,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-sm)' }}>
            {product.category}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-3xl)', fontWeight: 500, marginBottom: 'var(--space-md)', color: 'var(--color-charcoal)' }}>
            {product.name}
          </h1>

          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ display: 'flex', color: 'var(--color-warning)' }}>
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} style={{ opacity: i < Math.round(product.rating) ? 1 : 0.2 }} />
                ))}
              </span>
              <span>{product.rating} ({product.numReviews} reviews)</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
            <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--color-charcoal)' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)', fontWeight: 500 }}>
                  {discount}% off
                </span>
              </>
            )}
          </div>

          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-2xl)', fontWeight: 300 }}>
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 'var(--space-md)' }}>
                Size
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.5rem 1.25rem',
                      border: selectedSize === size ? '2px solid var(--color-charcoal)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--border-radius)',
                      background: selectedSize === size ? 'var(--color-charcoal)' : 'var(--color-white)',
                      color: selectedSize === size ? 'var(--color-white)' : 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 'var(--space-md)' }}>
                Color: {selectedColor}
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      backgroundColor: color.hex,
                      border: selectedColor === color.name ? '3px solid var(--color-charcoal)' : '2px solid var(--color-border)',
                      cursor: 'pointer',
                      outline: selectedColor === color.name ? '2px solid var(--color-white)' : 'none',
                      outlineOffset: '-4px',
                      transition: 'all var(--transition-fast)'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)', overflow: 'hidden'
            }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ padding: '0.75rem 1rem', background: 'var(--color-white)', color: 'var(--color-charcoal)', display: 'flex' }}
              >
                <HiMinus />
              </button>
              <span style={{ padding: '0.75rem 1.5rem', fontWeight: 500, minWidth: 50, textAlign: 'center', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                style={{ padding: '0.75rem 1rem', background: 'var(--color-white)', color: 'var(--color-charcoal)', display: 'flex' }}
              >
                <HiPlus />
              </button>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              style={{ flex: 1, minWidth: 200 }}
            >
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <p style={{ fontSize: 'var(--font-size-sm)', color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
            {product.stock > 0 ? `✓ In stock (${product.stock} available)` : '✕ Out of stock'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

