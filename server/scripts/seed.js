const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product.model');
const User = require('../models/User.model');

const sampleProducts = [
  {
    name: 'Minimal Linen Blazer',
    description: 'A beautifully tailored linen blazer with a relaxed fit. Perfect for layering over casual or semi-formal outfits. Breathable fabric ideal for warm weather.',
    price: 459900,
    originalPrice: 599900,
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ],
    stock: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Sand', hex: '#C2B280' }, { name: 'Charcoal', hex: '#343434' }],
    tags: ['blazer', 'linen', 'formal', 'minimal'],
    featured: true,
    rating: 4.5,
    numReviews: 42
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Ultra-soft organic cotton crew-neck tee. Relaxed fit with a clean silhouette. A wardrobe essential crafted for everyday comfort.',
    price: 149900,
    originalPrice: 199900,
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
    ],
    stock: 100,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }, { name: 'Sage', hex: '#B2AC88' }],
    tags: ['t-shirt', 'cotton', 'basics', 'organic'],
    featured: true,
    rating: 4.8,
    numReviews: 156
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Hand-stitched genuine leather crossbody bag with adjustable strap. Compact design with multiple compartments. Timeless and functional.',
    price: 349900,
    originalPrice: 449900,
    category: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'
    ],
    stock: 30,
    sizes: ['Free Size'],
    colors: [{ name: 'Tan', hex: '#D2B48C' }, { name: 'Black', hex: '#000000' }],
    tags: ['bag', 'leather', 'crossbody', 'accessories'],
    featured: true,
    rating: 4.6,
    numReviews: 89
  },
  {
    name: 'Classic Leather Watch',
    description: 'Minimalist analog watch with a genuine leather strap and stainless steel case. Japanese quartz movement. Water resistant up to 30m.',
    price: 279900,
    originalPrice: 399900,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800'
    ],
    stock: 50,
    sizes: ['Free Size'],
    colors: [{ name: 'Brown', hex: '#8B4513' }, { name: 'Black', hex: '#000000' }],
    tags: ['watch', 'leather', 'minimal', 'accessories'],
    featured: true,
    rating: 4.7,
    numReviews: 203
  },
  {
    name: 'Suede Chelsea Boots',
    description: 'Premium suede Chelsea boots with elastic side panels and pull tab. Cushioned insole for all-day comfort. Versatile style for any occasion.',
    price: 549900,
    originalPrice: 699900,
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800'
    ],
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Taupe', hex: '#483C32' }, { name: 'Black', hex: '#000000' }],
    tags: ['boots', 'chelsea', 'suede', 'footwear'],
    featured: true,
    rating: 4.4,
    numReviews: 67
  },
  {
    name: 'Ceramic Diffuser Set',
    description: 'Handcrafted ceramic reed diffuser with essential oil blend. Long-lasting fragrance for your living space. Comes with natural rattan reeds.',
    price: 189900,
    originalPrice: 249900,
    category: 'Home',
    images: [
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800',
      'https://images.unsplash.com/photo-1600612253971-422e4e9a1260?w=800'
    ],
    stock: 40,
    sizes: ['Free Size'],
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Stone', hex: '#928E85' }],
    tags: ['home', 'diffuser', 'ceramic', 'fragrance'],
    featured: true,
    rating: 4.3,
    numReviews: 34
  },
  {
    name: 'Silk Scarf',
    description: 'Luxurious pure silk scarf with hand-rolled edges. Versatile accessory that can be worn as a necktie, headband, or bag accent.',
    price: 219900,
    originalPrice: 299900,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc64?w=800',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'
    ],
    stock: 35,
    sizes: ['Free Size'],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Blush', hex: '#DE5D83' }],
    tags: ['scarf', 'silk', 'accessories', 'luxury'],
    featured: false,
    rating: 4.6,
    numReviews: 45
  },
  {
    name: 'Natural Lip Balm Set',
    description: 'Set of 3 organic lip balms with shea butter, beeswax, and vitamin E. Hydrating formula with subtle natural tints. Cruelty-free and paraben-free.',
    price: 79900,
    originalPrice: 99900,
    category: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'
    ],
    stock: 80,
    sizes: ['Free Size'],
    colors: [],
    tags: ['beauty', 'lip balm', 'organic', 'skincare'],
    featured: true,
    rating: 4.9,
    numReviews: 312
  },
  {
    name: 'Canvas Tote Bag',
    description: 'Heavy-duty organic canvas tote with reinforced handles. Spacious interior with inner pocket. Perfect for daily errands or beach days.',
    price: 129900,
    originalPrice: 159900,
    category: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
      'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=800'
    ],
    stock: 60,
    sizes: ['Free Size'],
    colors: [{ name: 'Natural', hex: '#F5F5DC' }, { name: 'Navy', hex: '#000080' }],
    tags: ['bag', 'canvas', 'tote', 'everyday'],
    featured: false,
    rating: 4.5,
    numReviews: 78
  },
  {
    name: 'Merino Wool Cardigan',
    description: 'Lightweight merino wool cardigan with mother-of-pearl buttons. Breathable and temperature-regulating. Perfect transitional layering piece.',
    price: 389900,
    originalPrice: 499900,
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cda3a56?w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'
    ],
    stock: 18,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Oatmeal', hex: '#D3C5A0' }, { name: 'Charcoal', hex: '#343434' }],
    tags: ['cardigan', 'wool', 'merino', 'knitwear'],
    featured: false,
    rating: 4.7,
    numReviews: 56
  },
  {
    name: 'Leather Sneakers',
    description: 'Clean-cut leather sneakers with a minimalist design. Cushioned sole for comfort. Goes with everything from jeans to chinos.',
    price: 449900,
    originalPrice: 599900,
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800'
    ],
    stock: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }],
    tags: ['sneakers', 'leather', 'minimal', 'footwear'],
    featured: true,
    rating: 4.6,
    numReviews: 134
  },
  {
    name: 'Linen Throw Blanket',
    description: 'Stonewashed linen throw blanket with fringed edges. Naturally breathable and gets softer with every wash. Perfect for the sofa or bedroom.',
    price: 299900,
    originalPrice: 399900,
    category: 'Home',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=800'
    ],
    stock: 22,
    sizes: ['Free Size'],
    colors: [{ name: 'Natural', hex: '#F5F5DC' }, { name: 'Sage', hex: '#B2AC88' }],
    tags: ['home', 'blanket', 'linen', 'decor'],
    featured: false,
    rating: 4.8,
    numReviews: 41
  }
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not set in .env file');
      console.log('   Please add your MongoDB Atlas connection string first.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${sampleProducts.length} sample products`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@forme.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@forme.com',
        password: 'Admin@123',
        role: 'admin'
      });
      console.log('✅ Created admin user (admin@forme.com / Admin@123)');
    } else {
      console.log('Admin user already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
