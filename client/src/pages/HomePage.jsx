import HeroSection from '../components/HeroSection/HeroSection';
import CategorySection from '../components/CategorySection/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts/FeaturedProducts';
import { HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh, HiOutlineSparkles } from 'react-icons/hi';

const HomePage = () => {
  const brandPillars = [
    {
      icon: <HiOutlineTruck size={28} />,
      title: 'Complimentary Shipping',
      description: 'Free express delivery across India on all orders above ₹999'
    },
    {
      icon: <HiOutlineSparkles size={28} />,
      title: 'Mindful Craftsmanship',
      description: 'Responsibly sourced organic fibers, certified silks, and refined metals'
    },
    {
      icon: <HiOutlineRefresh size={28} />,
      title: 'Effortless Returns',
      description: 'Straightforward 10-day exchange and return policy on unworn items'
    },
    {
      icon: <HiOutlineShieldCheck size={28} />,
      title: 'Secure Transactions',
      description: '256-bit encrypted payments with Razorpay, UPI, cards, and net banking'
    }
  ];

  return (
    <div>
      <HeroSection />

      {/* Brand Value Pillars */}
      <section style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-white)',
        padding: 'var(--space-2xl) 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-xl)',
            alignItems: 'start'
          }}>
            {brandPillars.map((pillar, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: 'var(--space-md)'
              }}>
                <div style={{
                  color: 'var(--color-charcoal)',
                  marginBottom: 'var(--space-sm)'
                }}>
                  {pillar.icon}
                </div>
                <h4 style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--space-xs)',
                  color: 'var(--color-charcoal)'
                }}>
                  {pillar.title}
                </h4>
                <p style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  maxWidth: 240
                }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategorySection />
      <FeaturedProducts />

      {/* Editorial Quote / Aesthetic Banner */}
      <section style={{
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-bg)',
        padding: 'var(--space-4xl) var(--space-lg)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <span style={{
            fontSize: 'var(--font-size-xs)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--color-warm-gray)',
            display: 'block',
            marginBottom: 'var(--space-md)'
          }}>
            The FORME Ethos
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 400,
            lineHeight: 1.3,
            marginBottom: 'var(--space-lg)'
          }}>
            “Simplicity is not about having less. It is about creating space for what truly matters.”
          </h2>
          <p style={{
            color: 'var(--color-warm-gray)',
            fontSize: 'var(--font-size-sm)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Designed in New Delhi — Made to endure
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
