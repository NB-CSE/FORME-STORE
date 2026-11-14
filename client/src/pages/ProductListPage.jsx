import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';
import { productAPI } from '../services/api';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import ProductCard from '../components/ProductCard/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import '../styles/ProductList.css';

const CATEGORIES = ['All', 'Clothing', 'Accessories', 'Footwear', 'Bags', 'Beauty', 'Home'];

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Helper for mock fallback filtering & sorting
  const filterMockProducts = () => {
    let list = [...MOCK_PRODUCTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q)));
    }

    if (category && category !== 'All') {
      list = list.filter(p => p.category === category);
    }

    if (minPrice) {
      list = list.filter(p => p.price >= Number(minPrice) * 100);
    }

    if (maxPrice) {
      list = list.filter(p => p.price <= Number(maxPrice) * 100);
    }

    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'popular') {
      list.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const limit = 12;
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return { products: paginated, pagination: { total, page, pages, limit } };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, sort, limit: 12 };
        if (search) params.search = search;
        if (category && category !== 'All') params.category = category;
        if (minPrice) params.minPrice = Number(minPrice) * 100;
        if (maxPrice) params.maxPrice = Number(maxPrice) * 100;

        const { data } = await productAPI.getProducts(params);
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
          setPagination(data.pagination);
        } else {
          // Fallback to local catalog
          const fallback = filterMockProducts();
          setProducts(fallback.products);
          setPagination(fallback.pagination);
        }
      } catch {
        // API offline or not seeded yet -> graceful fallback
        const fallback = filterMockProducts();
        setProducts(fallback.products);
        setPagination(fallback.pagination);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (sort !== 'newest') params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [search, category, sort, minPrice, maxPrice, page, setSearchParams]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="product-list-page">
      <div className="product-list-container">
        <div className="product-list-header">
          <div>
            <h1 className="product-list-title">
              {category !== 'All' ? category : 'All Products'}
            </h1>
            <p className="product-list-count">{pagination.total} products available</p>
          </div>
          <div className="product-list-controls">
            <select className="sort-select" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
            <button className="filter-toggle" onClick={() => setFiltersOpen(true)}>
              <HiOutlineAdjustments /> Filters
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="search-bar">
          <HiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by product name, fabric, or category..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="product-list-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
            {filtersOpen && (
              <div className="close-filters">
                <h2>Filters</h2>
                <button onClick={() => setFiltersOpen(false)}><HiOutlineX /></button>
              </div>
            )}

            <div className="filter-group">
              <h3>Category</h3>
              {CATEGORIES.map(cat => (
                <label key={cat} className={`filter-option ${category === cat ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat}
                    onChange={() => { setCategory(cat); setPage(1); }}
                    style={{ display: 'none' }}
                  />
                  {cat}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h3>Price Range (₹)</h3>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            <button className="clear-filters" onClick={clearFilters}>Clear all filters</button>

            {filtersOpen && (
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 'var(--space-xl)' }}
                onClick={() => setFiltersOpen(false)}
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <div>
            {loading ? (
              <LoadingSpinner text="Refining catalogue..." />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No matching products</h3>
                <p>We couldn't find items matching your criteria.</p>
                <button className="btn btn-secondary" onClick={clearFilters} style={{ marginTop: 'var(--space-lg)' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      Previous
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={page === i + 1 ? 'active' : ''}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page >= pagination.pages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
