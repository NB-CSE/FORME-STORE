import { useNavigate } from 'react-router-dom';
import '../../styles/Categories.css';

const categories = [
  {
    name: 'Clothing',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600',
    count: 'New Arrivals'
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600',
    count: 'Trending'
  },
  {
    name: 'Footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
    count: 'Best Sellers'
  },
  {
    name: 'Bags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    count: 'Premium'
  },
  {
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
    count: 'Organic'
  },
  {
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600',
    count: 'Curated'
  }
];

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="categories-section section">
      <div className="container">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Find what suits your style</p>
      </div>
      <div className="categories-grid">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="category-card"
            onClick={() => navigate(`/products?category=${cat.name}`)}
          >
            <img src={cat.image} alt={cat.name} loading="lazy" />
            <div className="category-card-overlay">
              <h3>{cat.name}</h3>
              <p>{cat.count}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
