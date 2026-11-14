import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../services/api';
import toast from 'react-hot-toast';

const formatPrice = (paise) => '₹' + (paise / 100).toLocaleString('en-IN');

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India'
  });

  const shippingCost = cartTotal >= 99900 ? 0 : 9900;
  const tax = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + shippingCost + tax;

  if (cart.items.length === 0) {
    return (
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-4xl) var(--space-lg)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-md)' }}>Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    for (const [key, value] of Object.entries(address)) {
      if (key !== 'country' && !String(value).trim()) {
        toast.error('Please fill in all shipping details');
        return;
      }
    }

    setLoading(true);
    try {
      let order = null;
      try {
        // 1. Try real server API order creation
        const { data: orderData } = await orderAPI.createOrder({ shippingAddress: address });
        if (orderData.success) {
          order = orderData.order;
        }
      } catch {
        // Fallback demo order when DB is offline
        const orderItems = cart.items.map(item => ({
          product: item.product?._id || 'demo_prod',
          name: item.product?.name || 'Selected Item',
          image: item.product?.images?.[0] || '',
          price: item.product?.price || 0,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }));

        order = {
          _id: 'ord_' + Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
          items: orderItems,
          shippingAddress: address,
          subtotal: cartTotal,
          shippingCost,
          tax,
          totalAmount: grandTotal,
          orderStatus: 'confirmed',
          paymentStatus: 'demo',
          paymentMethod: 'demo'
        };

        const existingOrders = JSON.parse(localStorage.getItem('forme_orders') || '[]');
        localStorage.setItem('forme_orders', JSON.stringify([order, ...existingOrders]));
        await clearCart();
        toast.success('Order placed successfully! (Demo Mode)');
        navigate(`/orders/${order._id}`);
        return;
      }

      // 2. Create payment if order was created on server
      const { data: paymentData } = await paymentAPI.createRazorpayOrder({ orderId: order._id });

      if (paymentData.demoMode) {
        const { data: demoResult } = await paymentAPI.demoPayment({ orderId: order._id });
        if (demoResult.success) {
          await clearCart();
          toast.success('Order placed successfully! (Demo Mode)');
          navigate(`/orders/${order._id}`);
        }
      } else {
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || paymentData.key;
        const options = {
          key: razorpayKey,
          amount: paymentData.order.amount,
          currency: paymentData.order.currency,
          name: 'FORME',
          description: `Order #${order._id.slice(-8).toUpperCase()}`,
          order_id: paymentData.order.id,
          handler: async (response) => {
            try {
              const { data: verifyData } = await paymentAPI.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id
              });
              if (verifyData.success) {
                await clearCart();
                toast.success('Payment successful!');
                navigate(`/orders/${order._id}`);
              }
            } catch {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: address.fullName,
            email: user?.email,
            contact: address.phone
          },
          theme: { color: '#343434' }
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          toast.error('Razorpay SDK not loaded. Trying demo mode...');
          const { data: demoResult } = await paymentAPI.demoPayment({ orderId: order._id });
          if (demoResult.success) {
            await clearCart();
            toast.success('Order placed! (Demo Mode)');
            navigate(`/orders/${order._id}`);
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { marginBottom: 'var(--space-md)' };
  const labelStyle = { display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xs)', color: 'var(--color-text-secondary)' };

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-2xl) var(--space-lg) var(--space-4xl)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-3xl)', fontWeight: 500, marginBottom: 'var(--space-2xl)' }}>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-3xl)', alignItems: 'start' }}>
          {/* Shipping Form */}
          <div style={{ backgroundColor: 'var(--color-white)', padding: 'var(--space-xl)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-xl)' }}>Shipping Address</h2>

            <div style={inputStyle}><label style={labelStyle}>Full Name</label>
              <input type="text" value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} required /></div>
            <div style={inputStyle}><label style={labelStyle}>Phone Number</label>
              <input type="tel" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} required /></div>
            <div style={inputStyle}><label style={labelStyle}>Street Address</label>
              <input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div style={inputStyle}><label style={labelStyle}>City</label>
                <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} required /></div>
              <div style={inputStyle}><label style={labelStyle}>State</label>
                <input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} required /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div style={inputStyle}><label style={labelStyle}>Pincode</label>
                <input type="text" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} required /></div>
              <div style={inputStyle}><label style={labelStyle}>Country</label>
                <input type="text" value={address.country} disabled style={{ backgroundColor: 'var(--color-bg)' }} /></div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ backgroundColor: 'var(--color-white)', padding: 'var(--space-xl)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>Order Summary</h2>

            {cart.items.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-border)' }}>
                <img src={item.product?.images?.[0] || ''} alt="" style={{ width: 50, height: 60, objectFit: 'cover', borderRadius: 'var(--border-radius)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{item.product?.name}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{formatPrice((item.product?.price || 0) * item.quantity)}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              <span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              <span>Tax (18% GST)</span><span>{formatPrice(tax)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)', fontWeight: 600, fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-xl)' }}>
              <span>Total</span><span>{formatPrice(grandTotal)}</span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Processing...' : 'Place Order & Pay'}
            </button>

            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', textAlign: 'center', marginTop: 'var(--space-md)' }}>
              Secure checkout powered by Razorpay
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

