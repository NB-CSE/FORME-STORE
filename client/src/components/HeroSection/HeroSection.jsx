import { useNavigate } from 'react-router-dom';
import '../../styles/Hero.css';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <span className="hero-label">New Collection 2024</span>
          <h1 className="hero-title">
            Curated <span>Essentials</span> for Modern Living
          </h1>
          <p className="hero-description">
            Discover our thoughtfully designed collection of premium everyday pieces. 
            Minimal aesthetics. Maximum quality.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
              Shop Now
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/products?category=Clothing')}>
              Explore Collection
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800"
            alt="FORME Collection"
          />
          <div className="hero-image-overlay">
            <div className="stat-number">500+</div>
            <div className="stat-label">Curated Products</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
