import { useState, useEffect, useMemo, useCallback } from 'react';
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

  // Directly read from URL searchParams
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = Number(searchParams.get('page')) || 1;

  // Helper to update specific URL searchParams cleanly
  const updateParams = useCallback((newParams) => {
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined || (key === 'category' && value === 'All') || (key === 'sort' && value === 'newest') || (key === 'page' && value === 1)) {
          updated.delete(key);
        } else {
          updated.set(key, String(value));
        }
      });
      return updated;
    }, { replace: true });
  }, [setSearchParams]);

  // Client-side fallback filter & sort over MOCK_PRODUCTS
  const filterMockProducts = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
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
    } else {
      // default newest
    }

    const limit = 12;
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return { products: paginated, pagination: { total, page, pages, limit } };
  }, [search, category, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, sort, limit: 12 };
        if (search) params.search = search;
        if (category && category !== 'All') params.category = category;
        if (minPrice) params.minPrice = Number(minPrice) * 100;
        if (maxPrice) params.maxPrice = Number(maxPrice) * 100;

        const { data } = await productAPI.getProducts(params);
        if (isMounted) {
          if (data?.success && data?.products && data.products.length > 0) {
            setProducts(data.products);
            setPagination(data.pagination);
          } else {
            setProducts(filterMockProducts.products);
            setPagination(filterMockProducts.pagination);
          }
        }
      } catch {
        if (isMounted) {
          setProducts(filterMockProducts.products);
          setPagination(filterMockProducts.pagination);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, [search, category, sort, minPrice, maxPrice, page, filterMockProducts]);

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const handleSearchChange = (e) => {
    updateParams({ search: e.target.value, page: 1 });
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
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
            >
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
            placeholder="Search by product name, fabric, or tag..."
            value={search}
            onChange={handleSearchChange}
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
                <label key={cat} className={`filter-option ${category.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="category"
                    checked={category.toLowerCase() === cat.toLowerCase()}
                    onChange={() => {
                      updateParams({ category: cat, page: 1 });
                      setFiltersOpen(false);
                    }}
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
                  onChange={(e) => updateParams({ minPrice: e.target.value, page: 1 })}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParams({ maxPrice: e.target.value, page: 1 })}
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
                <h3>No products found in {category !== 'All' ? category : 'catalog'}</h3>
                <p>Try clearing filters or searching for something else.</p>
                <button className="btn btn-secondary" onClick={clearFilters} style={{ marginTop: 'var(--space-lg)' }}>
                  View All Products
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
                      onClick={() => updateParams({ page: page - 1 })}
                    >
                      Previous
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={page === i + 1 ? 'active' : ''}
                        onClick={() => updateParams({ page: i + 1 })}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page >= pagination.pages}
                      onClick={() => updateParams({ page: page + 1 })}
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
