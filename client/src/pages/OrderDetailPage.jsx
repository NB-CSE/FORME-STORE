import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { HiArrowLeft } from 'react-icons/hi';

const formatPrice = (paise) => '₹' + (paise / 100).toLocaleString('en-IN');

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getOrder(id);
        if (data.success && data.order) {
          setOrder(data.order);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local stored order
      }
      const localOrders = JSON.parse(localStorage.getItem('forme_orders') || '[]');
      const found = localOrders.find(o => o._id === id);
      if (found) {
        setOrder(found);
      } else {
        navigate('/orders');
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner text="Loading order..." />;
  if (!order) return null;

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-2xl) var(--space-lg) var(--space-4xl)' }}>
      <button onClick={() => navigate('/orders')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2xl)', fontSize: 'var(--font-size-sm)' }}>
        <HiArrowLeft /> Back to Orders
      </button>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 500, marginBottom: 'var(--space-xs)' }}>
        Order #{order._id.slice(-8).toUpperCase()}
      </h1>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-2xl)' }}>
        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
        <div>
          {/* Order Items */}
          <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Items</h2>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-md)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-md)', borderBottom: i < order.items.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <img src={item.image || 'https://via.placeholder.com/70'} alt="" style={{ width: 70, height: 85, objectFit: 'cover', borderRadius: 'var(--border-radius)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500 }}>{item.name}</p>
                  {item.size && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>Size: {item.size}</p>}
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Shipping Address</h2>
            <p style={{ lineHeight: 1.7, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
              {order.shippingAddress.country}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Summary</h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>Tax</span><span>{formatPrice(order.tax)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)', fontWeight: 600, fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-xl)' }}>
            <span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)' }}>Order Status</p>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, textTransform: 'capitalize', color: 'var(--color-charcoal)' }}>
              {order.orderStatus}
            </span>
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)' }}>Payment</p>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, textTransform: 'capitalize', color: 'var(--color-charcoal)' }}>
              {order.paymentStatus} ({order.paymentMethod})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

