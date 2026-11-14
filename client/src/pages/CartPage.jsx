import { useNavigate } from 'react-router-dom';
import { HiMinus, HiPlus, HiOutlineTrash, HiArrowLeft } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const formatPrice = (paise) => '₹' + (paise / 100).toLocaleString('en-IN');

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { isAuthenticated } = useAuth();

  if (cart.items.length === 0) {
    return (
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-4xl) var(--space-lg)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)', opacity: 0.3 }}>🛒</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-md)' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>Add some products to get started</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    );
  }

  const shippingCost = cartTotal >= 99900 ? 0 : 9900;
  const tax = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + shippingCost + tax;

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-2xl) var(--space-lg) var(--space-4xl)' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', fontSize: 'var(--font-size-sm)' }}>
        <HiArrowLeft /> Continue Shopping
      </button>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-3xl)', fontWeight: 500, marginBottom: 'var(--space-2xl)' }}>
        Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-3xl)', alignItems: 'start' }}>
        {/* Cart Items */}
        <div>
          {cart.items.map(item => {
            const product = item.product || {};
            return (
              <div key={item._id} style={{
                display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 'var(--space-lg)',
                padding: 'var(--space-lg) 0', borderBottom: '1px solid var(--color-border)', alignItems: 'center'
              }}>
                <div style={{ width: 90, height: 110, borderRadius: 'var(--border-radius)', overflow: 'hidden', backgroundColor: 'var(--color-white)', cursor: 'pointer' }}
                  onClick={() => navigate(`/products/${product._id}`)}>
                  <img src={product.images?.[0] || 'https://via.placeholder.com/100x120'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 500, marginBottom: 'var(--space-xs)', cursor: 'pointer' }}
                    onClick={() => navigate(`/products/${product._id}`)}>
                    {product.name || 'Product'}
                  </h3>
                  {item.size && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', marginBottom: '2px' }}>Size: {item.size}</p>}
                  {item.color && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>Color: {item.color}</p>}
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginTop: 'var(--space-sm)' }}>
                    {formatPrice(product.price || 0)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        style={{ padding: '4px 8px', background: 'none', display: 'flex' }}><HiMinus size={14} /></button>
                      <span style={{ padding: '4px 12px', fontSize: 'var(--font-size-sm)', fontWeight: 500, borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{ padding: '4px 8px', background: 'none', display: 'flex' }}><HiPlus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)}
                      style={{ background: 'none', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-xs)' }}>
                      <HiOutlineTrash size={16} /> Remove
                    </button>
                  </div>
                </div>

                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>
                  {formatPrice((product.price || 0) * item.quantity)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--space-xl)', border: '1px solid var(--color-border)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xl)', fontWeight: 500, marginBottom: 'var(--space-xl)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-border)' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>Tax (18% GST)</span><span>{formatPrice(tax)}</span>
          </div>

          {shippingCost > 0 && (
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', marginBottom: 'var(--space-md)', padding: 'var(--space-sm)', backgroundColor: 'rgba(139,115,85,0.06)', borderRadius: 'var(--border-radius)' }}>
              Add {formatPrice(99900 - cartTotal)} more for free shipping
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)', fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>
            <span>Total</span><span>{formatPrice(grandTotal)}</span>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-xl)' }}
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login?redirect=checkout');
              } else {
                navigate('/checkout');
              }
            }}
          >
            {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

