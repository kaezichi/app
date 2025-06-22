import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo component (inline SVG based on the description)
const Logo = () => (
  <div className="flex items-center justify-center">
    <img 
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDM1MCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGNUY1Ii8+Cjx0ZXh0IHg9IjE3NSIgeT0iMzUiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNFQjk0OTEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdlbSdzIFRlYWhvdXNlPC90ZXh0Pgo8dGV4dCB4PSIxNzUiIHk9IjU1IiBmb250LWZhbWlseT0ic2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNFQjk0OTEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1JTEtURUEg4oCiIENPTUJPIE1FQUxTIOKAoiBVTkxJTUlURUQgV0lOR1Mg4oCiIFNOQUNLUzwvdGV4dD4KPHR1ZXh0IHg9IjE3NSIgeT0iNzAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iI0VCOTQ5MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RVNULiAyMDI1PC90ZXh0Pgo8L3N2Zz4K" 
      alt="Gem's Teahouse Logo" 
      className="h-20 w-auto"
    />
  </div>
);

const App = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Menu Data
  const menuData = {
    milktea: {
      cheesecake: [
        { name: 'Cheesecake Matcha', price: 120, description: 'Creamy cheesecake with premium matcha' },
        { name: 'Cheesecake Chocolate', price: 120, description: 'Rich chocolate cheesecake blend' },
        { name: 'Cheesecake Strawberry', price: 120, description: 'Sweet strawberry cheesecake delight' },
        { name: 'Cheesecake Taro', price: 120, description: 'Purple taro with smooth cheesecake' },
        { name: 'Cheesecake Original', price: 110, description: 'Classic cheesecake flavor' }
      ],
      regular: [
        { name: 'Classic Matcha', price: 90, description: 'Premium Japanese matcha tea' },
        { name: 'Chocolate Milk Tea', price: 85, description: 'Rich chocolate blend' },
        { name: 'Strawberry Milk Tea', price: 85, description: 'Fresh strawberry flavor' },
        { name: 'Wintermelon Milk Tea', price: 80, description: 'Refreshing wintermelon' },
        { name: 'Taro Milk Tea', price: 90, description: 'Creamy purple taro' },
        { name: 'Thai Milk Tea', price: 85, description: 'Traditional Thai blend' },
        { name: 'Honeydew Milk Tea', price: 85, description: 'Sweet honeydew melon' },
        { name: 'Caramel Milk Tea', price: 95, description: 'Rich caramel sweetness' }
      ]
    },
    combos: [
      { name: 'Yang Chow Chao Fan + Siomai', price: 180, description: 'Classic fried rice with pork siomai (6pcs)' },
      { name: 'Beef Chao Fan + Hotdog', price: 170, description: 'Beef fried rice with Filipino hotdog' },
      { name: 'Chicken Chao Fan + Sausage', price: 175, description: 'Chicken fried rice with longganisa' },
      { name: 'Shrimp Chao Fan + Lumpia', price: 190, description: 'Shrimp fried rice with fresh lumpia (2pcs)' },
      { name: 'Special Chao Fan + Tocino', price: 185, description: 'Mixed fried rice with sweet tocino' },
      { name: 'Vegetable Chao Fan + Egg', price: 150, description: 'Veggie fried rice with fried egg' }
    ],
    wings: [
      { name: 'Buffalo Wings', price: 220, description: 'Classic spicy buffalo sauce (8pcs)' },
      { name: 'Honey Garlic Wings', price: 230, description: 'Sweet honey with garlic glaze (8pcs)' },
      { name: 'Korean BBQ Wings', price: 250, description: 'Korean-style marinade (8pcs)' },
      { name: 'Teriyaki Wings', price: 240, description: 'Japanese teriyaki glaze (8pcs)' },
      { name: 'Salted Egg Wings', price: 260, description: 'Creamy salted egg coating (8pcs)' },
      { name: 'Adobo Wings', price: 240, description: 'Filipino adobo flavor (8pcs)' },
      { name: 'Sriracha Wings', price: 230, description: 'Spicy sriracha kick (8pcs)' },
      { name: 'Unlimited Wings Special', price: 350, description: 'All-you-can-eat wings (2 hours)' }
    ],
    snacks: [
      { name: 'Crispy Fries', price: 80, description: 'Golden crispy potato fries' },
      { name: 'Loaded Nachos', price: 150, description: 'Tortilla chips with cheese and toppings' },
      { name: 'Takoyaki (6pcs)', price: 120, description: 'Japanese octopus balls with sauce' },
      { name: 'Mozzarella Sticks', price: 140, description: 'Breaded mozzarella with marinara' },
      { name: 'Chicken Nuggets', price: 130, description: 'Crispy chicken nuggets (10pcs)' },
      { name: 'Onion Rings', price: 100, description: 'Crispy beer-battered onion rings' },
      { name: 'Fish Balls', price: 90, description: 'Filipino-style fish balls (10pcs)' },
      { name: 'Kwek-kwek', price: 95, description: 'Orange-coated quail eggs (12pcs)' }
    ]
  };

  const reviews = [
    { name: 'Maria S.', rating: 5, comment: 'Best milk tea in Imus! Love the cheesecake series!' },
    { name: 'Juan D.', rating: 5, comment: 'The unlimited wings are amazing! Great value for money.' },
    { name: 'Sarah L.', rating: 4, comment: 'Cozy place, authentic Filipino combos. Will definitely come back!' },
    { name: 'Mike R.', rating: 5, comment: 'Perfect spot for hanging out. The chao fan combos are delicious!' }
  ];

  const addToCart = (item, category) => {
    setCart([...cart, { ...item, category, id: Date.now() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleOrder = async () => {
    if (cart.length === 0) return;
    
    const orderData = {
      items: cart,
      customer: orderForm,
      total: getTotalPrice(),
      timestamp: new Date().toISOString()
    };

    try {
      // In a real app, this would send to backend
      console.log('Order placed:', orderData);
      alert('Order placed successfully! We will contact you shortly.');
      setCart([]);
      setOrderForm({ name: '', phone: '', address: '', notes: '' });
      setShowCart(false);
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    }
  };

  const Navigation = () => (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Logo />
          <div className="hidden md:flex space-x-8">
            {['home', 'menu', 'about', 'gallery', 'reviews', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`capitalize font-medium transition-colors ${
                  currentSection === section 
                    ? 'text-rose-400 border-b-2 border-rose-400' 
                    : 'text-gray-700 hover:text-rose-400'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors relative"
          >
            Cart ({cart.length})
          </button>
        </div>
      </div>
    </nav>
  );

  const Hero = () => (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-200">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1708461646032-5743c250ac77)' }}
      />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-rose-500 mb-6">
          Welcome to Gem's Teahouse
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          Where every sip feels like home. Authentic Filipino flavors meets premium milk tea.
        </p>
        <button
          onClick={() => setCurrentSection('menu')}
          className="bg-rose-400 text-white px-8 py-4 text-lg rounded-full hover:bg-rose-500 transition-all transform hover:scale-105 shadow-lg"
        >
          Explore Our Menu
        </button>
      </div>
    </section>
  );

  const MenuSection = () => (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Our Menu</h2>
        
        {/* Milk Tea Section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <img 
              src="https://images.pexels.com/photos/12940112/pexels-photo-12940112.jpeg" 
              alt="Milk Tea"
              className="w-24 h-24 rounded-full object-cover mr-4"
            />
            <h3 className="text-3xl font-bold text-rose-500">Milk Tea Collection</h3>
          </div>
          
          <div className="mb-8">
            <h4 className="text-2xl font-semibold text-gray-700 mb-4">Cheesecake Series</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuData.milktea.cheesecake.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h5 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h5>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-rose-500">₱{item.price}</span>
                    <button
                      onClick={() => addToCart(item, 'milktea')}
                      className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-semibold text-gray-700 mb-4">Classic Flavors</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuData.milktea.regular.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h5 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h5>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-rose-500">₱{item.price}</span>
                    <button
                      onClick={() => addToCart(item, 'milktea')}
                      className="bg-rose-400 text-white px-3 py-1 text-sm rounded hover:bg-rose-500 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Combo Meals Section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <img 
              src="https://images.unsplash.com/photo-1625477811233-044633d10dd1" 
              alt="Combo Meals"
              className="w-24 h-24 rounded-full object-cover mr-4"
            />
            <h3 className="text-3xl font-bold text-rose-500">Combo Meals</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuData.combos.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h5 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h5>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-rose-500">₱{item.price}</span>
                  <button
                    onClick={() => addToCart(item, 'combo')}
                    className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wings Section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <img 
              src="https://images.unsplash.com/photo-1608039755401-742074f0548d" 
              alt="Wings"
              className="w-24 h-24 rounded-full object-cover mr-4"
            />
            <h3 className="text-3xl font-bold text-rose-500">Unlimited Wings & More</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuData.wings.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h5 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h5>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-rose-500">₱{item.price}</span>
                  <button
                    onClick={() => addToCart(item, 'wings')}
                    className="bg-rose-400 text-white px-3 py-1 text-sm rounded hover:bg-rose-500 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Snacks Section */}
        <div>
          <div className="flex items-center mb-8">
            <img 
              src="https://images.pexels.com/photos/8625452/pexels-photo-8625452.jpeg" 
              alt="Snacks"
              className="w-24 h-24 rounded-full object-cover mr-4"
            />
            <h3 className="text-3xl font-bold text-rose-500">Café Snacks</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuData.snacks.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h5 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h5>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-rose-500">₱{item.price}</span>
                  <button
                    onClick={() => addToCart(item, 'snacks')}
                    className="bg-rose-400 text-white px-3 py-1 text-sm rounded hover:bg-rose-500 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const About = () => (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">About Gem's Teahouse</h2>
        <div className="prose prose-lg mx-auto text-gray-700">
          <p className="text-xl mb-6">
            Established in 2025, Gem's Teahouse brings you the perfect blend of premium milk tea 
            and authentic Filipino comfort food in the heart of Imus, Cavite.
          </p>
          <p className="mb-6">
            Our story began with a simple vision: to create a cozy space where friends and families 
            can gather over delicious drinks and hearty meals. We pride ourselves on using quality 
            ingredients and traditional Filipino recipes passed down through generations.
          </p>
          <p className="mb-6">
            From our signature Cheesecake Milk Tea series to our unlimited wings special, 
            every item on our menu is crafted with love and attention to detail. 
            Whether you're craving a refreshing milk tea or a satisfying chao fan combo, 
            Gem's Teahouse is your home away from home.
          </p>
        </div>
      </div>
    </section>
  );

  const Gallery = () => (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Gallery</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'https://images.unsplash.com/photo-1708461646032-5743c250ac77',
            'https://images.pexels.com/photos/12940112/pexels-photo-12940112.jpeg',
            'https://images.unsplash.com/photo-1625477811233-044633d10dd1',
            'https://images.unsplash.com/photo-1608039755401-742074f0548d',
            'https://images.pexels.com/photos/8625452/pexels-photo-8625452.jpeg',
            'https://images.unsplash.com/photo-1691067987421-ce180bfcb90c'
          ].map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={image} 
                alt={`Gallery ${index + 1}`}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Reviews = () => (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-rose-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
              <p className="font-semibold text-gray-800">- {review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Contact = () => (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Visit Us</h2>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Location & Hours</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-lg">Address:</h4>
                <p>Blk 5, Lot 1, Phase 6, Gumamela St.,<br />
                ACM Woodstock Homes, Carsadang Bago II,<br />
                Imus, Cavite</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Hours:</h4>
                <p>Weekdays: 12:00 PM - 9:00 PM<br />
                Weekends: 10:00 AM - 9:30 PM</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Contact:</h4>
                <p>Facebook/Messenger: Gem's Teahouse</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4727193584544!2d120.94665631529554!3d14.398654689898985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d1d7df0a6ffd%3A0x1234567890123456!2sImus%2C%20Cavite!5e0!3m2!1sen!2sph!4v1234567890123"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gem's Teahouse Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );

  const Cart = () => {
    if (!showCart) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Your Order</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-rose-500">₱{item.price}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total: ₱{getTotalPrice()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Delivery Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                      className="p-3 border rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                      className="p-3 border rounded-lg"
                    />
                  </div>
                  <textarea
                    placeholder="Delivery Address"
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    rows="3"
                  />
                  <textarea
                    placeholder="Special Instructions (Optional)"
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    rows="2"
                  />
                  <button
                    onClick={handleOrder}
                    disabled={!orderForm.name || !orderForm.phone || !orderForm.address}
                    className="w-full bg-rose-400 text-white py-3 rounded-lg font-semibold hover:bg-rose-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home': return <Hero />;
      case 'menu': return <MenuSection />;
      case 'about': return <About />;
      case 'gallery': return <Gallery />;
      case 'reviews': return <Reviews />;
      case 'contact': return <Contact />;
      default: return <Hero />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {renderSection()}
      <Cart />
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Logo />
          <p className="mt-4 text-gray-400">
            © 2025 Gem's Teahouse. All rights reserved.
          </p>
          <p className="text-gray-400">
            Blk 5, Lot 1, Phase 6, Gumamela St., ACM Woodstock Homes, Carsadang Bago II, Imus, Cavite
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;