import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import toast from 'react-hot-toast';

const formatPrice = (paise) => '₹' + (paise / 100).toLocaleString('en-IN');

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Clothing',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true
  });

  const fetchStatsAndOrders = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllOrders({ limit: 50 })
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await adminAPI.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (data.success) {
        toast.success(`Order updated to ${newStatus}`);
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price) * 100,
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) * 100 : undefined,
        stock: Number(newProduct.stock)
      };
      const { data } = await adminAPI.createProduct(payload);
      if (data.success) {
        toast.success('Product created successfully!');
        setNewProduct({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          category: 'Clothing',
          stock: 10,
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
          sizes: ['S', 'M', 'L', 'XL'],
          featured: true
        });
        fetchStatsAndOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

  const tabButtonStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--border-radius)',
    background: isActive ? 'var(--color-charcoal)' : 'var(--color-white)',
    color: isActive ? 'var(--color-white)' : 'var(--color-charcoal)',
    border: '1px solid var(--color-border)',
    fontWeight: 500,
    fontSize: 'var(--font-size-sm)',
    cursor: 'pointer'
  });

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-2xl) var(--space-lg) var(--space-4xl)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-3xl)', fontWeight: 500, marginBottom: 'var(--space-sm)' }}>
        Admin Dashboard
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2xl)' }}>
        Manage products, orders, and view sales overview
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)' }}>
        <button style={tabButtonStyle(activeTab === 'stats')} onClick={() => setActiveTab('stats')}>Overview</button>
        <button style={tabButtonStyle(activeTab === 'orders')} onClick={() => setActiveTab('orders')}>Orders ({orders.length})</button>
        <button style={tabButtonStyle(activeTab === 'addProduct')} onClick={() => setActiveTab('addProduct')}>+ Add Product</button>
      </div>

      {activeTab === 'stats' && stats && (
        <div>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-3xl)' }}>
            <div style={{ backgroundColor: 'var(--color-white)', padding: 'var(--space-xl)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xs)' }}>Total Revenue</p>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--color-charcoal)' }}>{formatPrice(stats.totalRevenue)}</h2>
            </div>
            <div style={{ backgroundColor: 'var(--color-white)', padding: 'var(--space-xl)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xs)' }}>Total Orders</p>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--color-charcoal)' }}>{stats.totalOrders}</h2>
            </div>
            <div style={{ backgroundColor: 'var(--color-white)', padding: 'var(--space-xl)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xs)' }}>Products Active</p>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--color-charcoal)' }}>{stats.totalProducts}</h2>
            </div>
            <div style={{ backgroundColor: 'var(--color-white)', padding: 'var(--space-xl)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xs)' }}>Customers</p>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--color-charcoal)' }}>{stats.totalUsers}</h2>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                <th style={{ padding: 'var(--space-md)' }}>Order ID</th>
                <th style={{ padding: 'var(--space-md)' }}>Customer</th>
                <th style={{ padding: 'var(--space-md)' }}>Amount</th>
                <th style={{ padding: 'var(--space-md)' }}>Payment</th>
                <th style={{ padding: 'var(--space-md)' }}>Status</th>
                <th style={{ padding: 'var(--space-md)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-md)', fontWeight: 500 }}>#{order._id.slice(-6).toUpperCase()}</td>
                  <td style={{ padding: 'var(--space-md)' }}>
                    <div>{order.user?.name || order.shippingAddress?.fullName}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ padding: 'var(--space-md)', fontWeight: 600 }}>{formatPrice(order.totalAmount)}</td>
                  <td style={{ padding: 'var(--space-md)' }}>
                    <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, background: '#eee' }}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-md)' }}>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ padding: '4px 8px', fontSize: 'var(--font-size-xs)', width: 'auto' }}
                    >
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: 'var(--space-md)' }}>
                    <a href={`/orders/${order._id}`} style={{ textDecoration: 'underline', color: 'var(--color-charcoal)' }}>View Details</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'addProduct' && (
        <div style={{ maxWidth: 640, backgroundColor: 'var(--color-white)', padding: 'var(--space-2xl)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Add New Product</h2>
          <form onSubmit={handleCreateProduct}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 4 }}>Product Name</label>
              <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 4 }}>Description</label>
              <textarea rows={3} value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 4 }}>Price (₹)</label>
                <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 4 }}>Original Price (₹)</label>
                <input type="number" value={newProduct.originalPrice} onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 4 }}>Category</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Bags">Bags</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 4 }}>Stock Units</label>
                <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 4 }}>Image URL</label>
              <input type="url" value={newProduct.images[0]} onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Product</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

