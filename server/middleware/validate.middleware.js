// Validation middleware for request body
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please provide a valid email');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }
  next();
};

const validateProduct = (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) errors.push('Product name is required');
  if (!description || description.trim().length === 0) errors.push('Description is required');
  if (price === undefined || price < 0) errors.push('Valid price is required');
  if (!category) errors.push('Category is required');
  if (stock === undefined || stock < 0) errors.push('Valid stock is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }
  next();
};

const validateOrder = (req, res, next) => {
  const { shippingAddress } = req.body;
  const errors = [];

  if (!shippingAddress) {
    errors.push('Shipping address is required');
  } else {
    if (!shippingAddress.fullName) errors.push('Full name is required');
    if (!shippingAddress.phone) errors.push('Phone number is required');
    if (!shippingAddress.street) errors.push('Street address is required');
    if (!shippingAddress.city) errors.push('City is required');
    if (!shippingAddress.state) errors.push('State is required');
    if (!shippingAddress.pincode) errors.push('Pincode is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }
  next();
};

module.exports = { validateRegistration, validateProduct, validateOrder };
