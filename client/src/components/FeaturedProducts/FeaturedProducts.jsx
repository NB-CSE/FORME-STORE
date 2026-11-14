import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';

const FALLBACK_PRODUCTS = [
  {
    _id: 'prod_1',
    name: 'Minimal Linen Blazer',
    description: 'A beautifully tailored linen blazer with a relaxed fit. Perfect for layering over casual or semi-formal outfits.',
    price: 459900,
    originalPrice: 599900,
    category: 'Clothing',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
    stock: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    numReviews: 42
  },
  {
    _id: 'prod_2',
    name: 'Organic Cotton Crewneck',
    description: 'Ultra-soft organic cotton crew-neck tee. Relaxed fit with a clean silhouette.',
    price: 149900,
    originalPrice: 199900,
    category: 'Clothing',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    stock: 100,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.9,
    numReviews: 156
  },
  {
    _id: 'prod_3',
    name: 'Handcrafted Leather Bag',
    description: 'Hand-stitched genuine leather crossbody bag with adjustable strap. Compact and functional.',
    price: 349900,
    originalPrice: 449900,
    category: 'Bags',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
    stock: 30,
    sizes: ['Free Size'],
    rating: 4.7,
    numReviews: 89
  },
  {
    _id: 'prod_4',
    name: 'Classic Minimalist Watch',
    description: 'Minimalist analog watch with genuine leather strap and stainless steel case.',
    price: 279900,
    originalPrice: 399900,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
    stock: 50,
    sizes: ['Free Size'],
    rating: 4.7,
    numReviews: 203
  }
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productAPI.getFeatured();
        if (data.success && data.products?.length > 0) {
          setProducts(data.products);
        }
      } catch {
        // Keeps fallback products seamlessly if backend/db is not yet seeded
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Featured Essentials</h2>
        <p className="section-subtitle">Handpicked pieces defining modern simplicity</p>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading featured pieces...</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'var(--space-xl)'
            }}>
              {products.slice(0, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/products')}>
                Explore Entire Catalog
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
