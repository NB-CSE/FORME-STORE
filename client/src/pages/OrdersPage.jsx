import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const formatPrice = (paise) => '₹' + (paise / 100).toLocaleString('en-IN');

const statusColor = {
  processing: '#D4A847',
  confirmed: '#4A7C59',
  shipped: '#3B82F6',
  delivered: '#059669',
  cancelled: '#C75050',
  pending: '#D4A847',
  paid: '#4A7C59',
  demo: '#8B7355',
  failed: '#C75050'
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        if (data.success && data.orders?.length > 0) {
          setOrders(data.orders);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local stored orders
      }
      const localOrders = JSON.parse(localStorage.getItem('forme_orders') || '[]');
      setOrders(localOrders);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-2xl) var(--space-lg) var(--space-4xl)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-3xl)', fontWeight: 500, marginBottom: 'var(--space-2xl)' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-4xl)', color: 'var(--color-text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', opacity: 0.3 }}>📦</div>
          <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-sm)', color: 'var(--color-charcoal)' }}>No orders yet</h3>
          <p style={{ marginBottom: 'var(--space-xl)' }}>Start shopping to see your orders here</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {orders.map(order => (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              style={{
                backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-lg)',
                border: '1px solid var(--color-border)', padding: 'var(--space-xl)', cursor: 'pointer',
                transition: 'all var(--transition-base)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <span style={{
                    fontSize: 'var(--font-size-xs)', fontWeight: 500, padding: '4px 12px',
                    borderRadius: 'var(--border-radius)', textTransform: 'uppercase', letterSpacing: '0.5px',
                    backgroundColor: `${statusColor[order.orderStatus] || '#888'}15`,
                    color: statusColor[order.orderStatus] || '#888'
                  }}>
                    {order.orderStatus}
                  </span>
                  <span style={{
                    fontSize: 'var(--font-size-xs)', fontWeight: 500, padding: '4px 12px',
                    borderRadius: 'var(--border-radius)', textTransform: 'uppercase', letterSpacing: '0.5px',
                    backgroundColor: `${statusColor[order.paymentStatus] || '#888'}15`,
                    color: statusColor[order.paymentStatus] || '#888'
                  }}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                {order.items.slice(0, 4).map((item, i) => (
                  <div key={i} style={{ width: 50, height: 50, borderRadius: 'var(--border-radius)', overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}>
                    <img src={item.image || 'https://via.placeholder.com/50'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div style={{ width: 50, height: 50, borderRadius: 'var(--border-radius)', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </span>
                <span style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

