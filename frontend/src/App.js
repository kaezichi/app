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
  // Main App State
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Customer App State
  const [currentSection, setCurrentSection] = useState('home');
  const [previousSection, setPreviousSection] = useState('home');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderStep, setOrderStep] = useState('cart');
  const [orderData, setOrderData] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: '',
    notes: ''
  });

  // Management State
  const [managementSection, setManagementSection] = useState('dashboard');
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');

  // Valid management credentials
  const validCredentials = [
    { id: 'OWNER 1', password: 'GT2025', role: 'Owner' },
    { id: 'OWNER 2', password: 'GT2025', role: 'Owner' },
    { id: 'OWNER 3', password: 'GT2025', role: 'Owner' },
    { id: 'OWNER 4', password: 'GT2025', role: 'Owner' },
    { id: 'MANAGER', password: 'GT2025', role: 'Manager' }
  ];

  // Check URL for management access
  useEffect(() => {
    if (window.location.hostname.includes('gemsteahouse.management') || 
        window.location.search.includes('admin') ||
        window.location.hash.includes('management')) {
      setIsManagementMode(true);
    }
  }, []);

  // Sample orders for demo
  useEffect(() => {
    if (isManagementMode) {
      setAllOrders([
        {
          id: 'GT1703123456789',
          customer: { name: 'Maria Santos', phone: '09123456789', address: 'Block 10, Lot 5, Imus Cavite', paymentMethod: 'online' },
          items: [
            { name: 'Ube Cheesecake', quantity: 2, price: 135 },
            { name: 'Yang Chow Chao Fan + Siomai', quantity: 1, price: 180 }
          ],
          total: 450,
          status: 'confirmed',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          needsChat: true
        },
        {
          id: 'GT1703123456790',
          customer: { name: 'Juan Dela Cruz', phone: '09987654321', address: 'Phase 2, Bacoor Cavite', paymentMethod: 'cod' },
          items: [
            { name: 'Buffalo Wings', quantity: 1, price: 220 },
            { name: 'Brown Sugar Milk Tea', quantity: 2, price: 100 }
          ],
          total: 420,
          status: 'preparing',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          needsChat: false
        },
        {
          id: 'GT1703123456791',
          customer: { name: 'Sarah Kim', phone: '09555666777', address: 'GMA Cavite', paymentMethod: 'cod' },
          items: [
            { name: 'Red Velvet Cheesecake', quantity: 1, price: 145 },
            { name: 'Crispy Fries', quantity: 1, price: 80 }
          ],
          total: 225,
          status: 'out_for_delivery',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          needsChat: false
        }
      ]);

      // Initialize chat messages
      setChatMessages({
        'GT1703123456789': [
          { sender: 'customer', message: 'Hi! I chose online payment. How do I pay?', timestamp: new Date(Date.now() - 3000000).toISOString() },
          { sender: 'admin', message: 'Hello! You can pay via GCash at 09123456789 or PayPal at gems.teahouse@gmail.com. Please send us the screenshot when done.', timestamp: new Date(Date.now() - 2700000).toISOString() }
        ]
      });
    }
  }, [isManagementMode]);

  // Authentication
  const handleLogin = (employeeId, password) => {
    const user = validCredentials.find(cred => cred.id === employeeId && cred.password === password);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setManagementSection('dashboard');
  };

  // Expanded Menu Data with extraordinary flavors
  const menuData = {
    milktea: {
      cheesecake: [
        // Original flavors
        { name: 'Cheesecake Matcha', price: 120, description: 'Creamy cheesecake with premium matcha' },
        { name: 'Cheesecake Chocolate', price: 120, description: 'Rich chocolate cheesecake blend' },
        { name: 'Cheesecake Strawberry', price: 120, description: 'Sweet strawberry cheesecake delight' },
        { name: 'Cheesecake Taro', price: 120, description: 'Purple taro with smooth cheesecake' },
        { name: 'Cheesecake Original', price: 110, description: 'Classic cheesecake flavor' },
        // Extraordinary flavors
        { name: 'Ube Cheesecake', price: 135, description: 'Filipino purple yam with rich cheesecake' },
        { name: 'Salted Caramel Cheesecake', price: 140, description: 'Perfect balance of sweet and salty' },
        { name: 'Red Velvet Cheesecake', price: 145, description: 'Luxurious red velvet meets cheesecake' },
        { name: 'Cookies & Cream Cheesecake', price: 135, description: 'Oreo cookies blended with cheesecake' },
        { name: 'Mango Cheesecake', price: 130, description: 'Tropical mango with creamy cheesecake' },
        { name: 'Blueberry Cheesecake', price: 135, description: 'Fresh blueberry burst in every sip' },
        { name: 'Coffee Cheesecake', price: 125, description: 'Rich espresso meets smooth cheesecake' },
        { name: 'Lemon Cheesecake', price: 130, description: 'Zesty lemon with velvety cheesecake' },
        { name: 'Nutella Cheesecake', price: 150, description: 'Decadent Nutella hazelnut cheesecake' }
      ],
      regular: [
        // Original flavors
        { name: 'Classic Matcha', price: 90, description: 'Premium Japanese matcha tea' },
        { name: 'Chocolate Milk Tea', price: 85, description: 'Rich chocolate blend' },
        { name: 'Strawberry Milk Tea', price: 85, description: 'Fresh strawberry flavor' },
        { name: 'Wintermelon Milk Tea', price: 80, description: 'Refreshing wintermelon' },
        { name: 'Taro Milk Tea', price: 90, description: 'Creamy purple taro' },
        { name: 'Thai Milk Tea', price: 85, description: 'Traditional Thai blend' },
        { name: 'Honeydew Milk Tea', price: 85, description: 'Sweet honeydew melon' },
        { name: 'Caramel Milk Tea', price: 95, description: 'Rich caramel sweetness' },
        // Extraordinary flavors
        { name: 'Brown Sugar Milk Tea', price: 100, description: 'Trendy brown sugar with fresh milk' },
        { name: 'Hokkaido Milk Tea', price: 105, description: 'Premium Hokkaido milk blend' },
        { name: 'Earl Grey Milk Tea', price: 95, description: 'Classic Earl Grey with bergamot' },
        { name: 'Jasmine Milk Tea', price: 90, description: 'Fragrant jasmine tea base' },
        { name: 'Passion Fruit Milk Tea', price: 100, description: 'Tropical passion fruit explosion' },
        { name: 'Lychee Milk Tea', price: 95, description: 'Sweet and floral lychee flavor' },
        { name: 'Coconut Milk Tea', price: 90, description: 'Creamy coconut paradise' },
        { name: 'Rose Milk Tea', price: 105, description: 'Delicate rose petals infusion' },
        { name: 'Lavender Milk Tea', price: 100, description: 'Calming lavender aromatics' },
        { name: 'Vanilla Bean Milk Tea', price: 95, description: 'Rich Madagascar vanilla beans' }
      ]
    },
    combos: [
      { name: 'Yang Chow Chao Fan + Siomai', price: 180, description: 'Classic fried rice with pork siomai (6pcs)' },
      { name: 'Beef Chao Fan + Hotdog', price: 170, description: 'Beef fried rice with Filipino hotdog' },
      { name: 'Chicken Chao Fan + Sausage', price: 175, description: 'Chicken fried rice with longganisa' },
      { name: 'Shrimp Chao Fan + Lumpia', price: 190, description: 'Shrimp fried rice with fresh lumpia (2pcs)' },
      { name: 'Special Chao Fan + Tocino', price: 185, description: 'Mixed fried rice with sweet tocino' },
      { name: 'Vegetable Chao Fan + Egg', price: 150, description: 'Veggie fried rice with fried egg' },
      { name: 'Spam Chao Fan + Corned Beef', price: 195, description: 'Spam fried rice with corned beef' },
      { name: 'Sisig Chao Fan + Bangus', price: 200, description: 'Sisig-style fried rice with fried bangus' }
    ],
    wings: [
      { name: 'Buffalo Wings', price: 220, description: 'Classic spicy buffalo sauce (8pcs)' },
      { name: 'Honey Garlic Wings', price: 230, description: 'Sweet honey with garlic glaze (8pcs)' },
      { name: 'Korean BBQ Wings', price: 250, description: 'Korean-style marinade (8pcs)' },
      { name: 'Teriyaki Wings', price: 240, description: 'Japanese teriyaki glaze (8pcs)' },
      { name: 'Salted Egg Wings', price: 260, description: 'Creamy salted egg coating (8pcs)' },
      { name: 'Adobo Wings', price: 240, description: 'Filipino adobo flavor (8pcs)' },
      { name: 'Sriracha Wings', price: 230, description: 'Spicy sriracha kick (8pcs)' },
      { name: 'Unlimited Wings Special', price: 350, description: 'All-you-can-eat wings (2 hours)' },
      { name: 'Parmesan Wings', price: 245, description: 'Savory parmesan cheese coating (8pcs)' },
      { name: 'Mango Habanero Wings', price: 255, description: 'Sweet mango with spicy habanero (8pcs)' }
    ],
    snacks: [
      { name: 'Crispy Fries', price: 80, description: 'Golden crispy potato fries' },
      { name: 'Loaded Nachos', price: 150, description: 'Tortilla chips with cheese and toppings' },
      { name: 'Takoyaki (6pcs)', price: 120, description: 'Japanese octopus balls with sauce' },
      { name: 'Mozzarella Sticks', price: 140, description: 'Breaded mozzarella with marinara' },
      { name: 'Chicken Nuggets', price: 130, description: 'Crispy chicken nuggets (10pcs)' },
      { name: 'Onion Rings', price: 100, description: 'Crispy beer-battered onion rings' },
      { name: 'Fish Balls', price: 90, description: 'Filipino-style fish balls (10pcs)' },
      { name: 'Kwek-kwek', price: 95, description: 'Orange-coated quail eggs (12pcs)' },
      { name: 'Cheese Fries', price: 120, description: 'Crispy fries topped with melted cheese' },
      { name: 'Buffalo Cauliflower', price: 135, description: 'Crispy cauliflower in buffalo sauce' }
    ]
  };

  const reviews = [
    { name: 'Maria S.', rating: 5, comment: 'Best milk tea in Imus! Love the cheesecake series!' },
    { name: 'Juan D.', rating: 5, comment: 'The unlimited wings are amazing! Great value for money.' },
    { name: 'Sarah L.', rating: 4, comment: 'Cozy place, authentic Filipino combos. Will definitely come back!' },
    { name: 'Mike R.', rating: 5, comment: 'Perfect spot for hanging out. The chao fan combos are delicious!' }
  ];

  // Customer App Functions
  const navigateTo = (section) => {
    setPreviousSection(currentSection);
    setCurrentSection(section);
  };

  const goBack = () => {
    setCurrentSection(previousSection);
  };

  const openQuantityModal = (item, category) => {
    setSelectedItem({ ...item, category });
    setQuantity(1);
    setShowQuantityModal(true);
  };

  const addToCart = () => {
    if (selectedItem) {
      for (let i = 0; i < quantity; i++) {
        setCart(prev => [...prev, { 
          ...selectedItem, 
          id: Date.now() + i,
          quantity: 1 
        }]);
      }
      setShowQuantityModal(false);
      setSelectedItem(null);
      setQuantity(1);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const getUniqueItems = () => {
    const itemMap = {};
    cart.forEach(item => {
      const key = `${item.name}-${item.category}`;
      if (itemMap[key]) {
        itemMap[key].quantity += 1;
      } else {
        itemMap[key] = { ...item, quantity: 1 };
      }
    });
    return Object.values(itemMap);
  };

  const proceedToDetails = () => {
    if (cart.length === 0) return;
    setOrderStep('details');
  };

  const proceedToPayment = () => {
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      alert('Please fill in all required fields');
      return;
    }
    setOrderStep('payment');
  };

  const placeOrder = async (paymentMethod) => {
    const newOrderData = {
      id: 'GT' + Date.now(),
      items: getUniqueItems(),
      customer: { ...orderForm, paymentMethod },
      total: getTotalPrice(),
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      needsChat: paymentMethod === 'online'
    };

    try {
      // Add to management orders
      setAllOrders(prev => [newOrderData, ...prev]);
      
      setOrderData(newOrderData);
      setOrderStep('tracking');
      setCart([]);
      setOrderForm({ name: '', phone: '', address: '', paymentMethod: '', notes: '' });
      
      // Simulate order status updates
      setTimeout(() => {
        setOrderData(prev => ({ ...prev, status: 'preparing' }));
        setAllOrders(prev => prev.map(order => 
          order.id === newOrderData.id ? { ...order, status: 'preparing' } : order
        ));
      }, 3000);
      
      setTimeout(() => {
        setOrderData(prev => ({ ...prev, status: 'out_for_delivery' }));
        setAllOrders(prev => prev.map(order => 
          order.id === newOrderData.id ? { ...order, status: 'out_for_delivery' } : order
        ));
      }, 8000);
      
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    }
  };

  const confirmDelivery = () => {
    setOrderData(prev => ({ ...prev, status: 'delivered' }));
    setAllOrders(prev => prev.map(order => 
      order.id === orderData.id ? { ...order, status: 'delivered' } : order
    ));
    setShowRating(true);
  };

  const submitRating = (rating, comment) => {
    console.log('Rating submitted:', { rating, comment, orderId: orderData.id });
    setShowRating(false);
    setOrderStep('cart');
    setOrderData(null);
    alert('Thank you for your feedback!');
  };

  const getStatusDisplay = (status) => {
    const statuses = {
      confirmed: { text: 'Order Confirmed', color: 'bg-blue-500', step: 1 },
      preparing: { text: 'Preparing Your Order', color: 'bg-yellow-500', step: 2 },
      out_for_delivery: { text: 'Out for Delivery', color: 'bg-orange-500', step: 3 },
      delivered: { text: 'Delivered', color: 'bg-green-500', step: 4 }
    };
    return statuses[status] || statuses.confirmed;
  };

  // Management Functions
  const updateOrderStatus = (orderId, newStatus) => {
    setAllOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    // Update customer's order data if they're tracking the same order
    if (orderData && orderData.id === orderId) {
      setOrderData(prev => ({ ...prev, status: newStatus }));
    }
  };

  const sendMessage = (orderId, message) => {
    if (!message.trim()) return;
    
    const newMessage = {
      sender: 'admin',
      message: message,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), newMessage]
    }));
    
    setNewMessage('');
  };

  const shareLocation = (orderId) => {
    const locationMessage = "📍 Your delivery is nearby! Our rider is at the corner of Gumamela St. and will arrive in 2-3 minutes.";
    sendMessage(orderId, locationMessage);
  };

  // MANAGEMENT COMPONENTS
  const ManagementLogin = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (handleLogin(employeeId, password)) {
        setError('');
      } else {
        setError('Invalid credentials. Please check your Employee ID and password.');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <Logo />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Management Portal</h2>
            <p className="text-gray-600">gemsteahouse.management</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              >
                <option value="">Select Employee ID</option>
                <option value="OWNER 1">OWNER 1</option>
                <option value="OWNER 2">OWNER 2</option>
                <option value="OWNER 3">OWNER 3</option>
                <option value="OWNER 4">OWNER 4</option>
                <option value="MANAGER">MANAGER</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Enter password"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-rose-400 text-white py-3 rounded-lg font-semibold hover:bg-rose-500 transition-colors"
            >
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsManagementMode(false)}
              className="text-rose-400 hover:text-rose-500 text-sm"
            >
              ← Back to Customer Site
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ManagementDashboard = () => {
    const getOrderStats = () => {
      const stats = {
        total: allOrders.length,
        confirmed: allOrders.filter(o => o.status === 'confirmed').length,
        preparing: allOrders.filter(o => o.status === 'preparing').length,
        out_for_delivery: allOrders.filter(o => o.status === 'out_for_delivery').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0),
        needsChat: allOrders.filter(o => o.needsChat && o.status !== 'delivered').length
      };
      return stats;
    };

    const stats = getOrderStats();

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Management Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser.role} {currentUser.id}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.confirmed + stats.preparing}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Out for Delivery</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.out_for_delivery}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">₱{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4 mb-6">
          {['dashboard', 'orders', 'messages'].map((section) => (
            <button
              key={section}
              onClick={() => setManagementSection(section)}
              className={`px-6 py-3 rounded-lg font-medium capitalize transition-colors ${
                managementSection === section 
                  ? 'bg-rose-400 text-white' 
                  : 'bg-white text-gray-700 hover:bg-rose-50'
              }`}
            >
              {section}
              {section === 'messages' && stats.needsChat > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.needsChat}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₱{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setManagementSection('orders');
                        }}
                        className="text-rose-400 hover:text-rose-600 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const ManagementOrders = () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>
        
        <div className="grid gap-6">
          {allOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                  <p className="text-gray-600">{new Date(order.timestamp).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p><strong>Name:</strong> {order.customer.name}</p>
                  <p><strong>Phone:</strong> {order.customer.phone}</p>
                  <p><strong>Address:</strong> {order.customer.address}</p>
                  <p><strong>Payment:</strong> {order.customer.paymentMethod}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm mb-1">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>₱{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₱{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                  >
                    Out for Delivery
                  </button>
                )}
                {order.status === 'out_for_delivery' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Mark as Delivered
                    </button>
                    <button
                      onClick={() => shareLocation(order.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      📍 Share Location
                    </button>
                  </>
                )}
                {order.needsChat && (
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setManagementSection('messages');
                    }}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                  >
                    💬 Chat with Customer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ManagementMessages = () => {
    const ordersNeedingChat = allOrders.filter(order => order.needsChat && order.status !== 'delivered');
    
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Messages</h2>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800">Orders Needing Attention</h3>
            </div>
            <div className="space-y-2 p-4">
              {ordersNeedingChat.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedOrder?.id === order.id 
                      ? 'bg-rose-100 border-l-4 border-rose-400' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">#{order.id}</p>
                      <p className="text-xs text-gray-500">₱{order.total} - {order.customer.paymentMethod}</p>
                    </div>
                    {chatMessages[order.id] && chatMessages[order.id].length > 0 && (
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            {selectedOrder ? (
              <>
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800">
                    Chat with {selectedOrder.customer.name}
                  </h3>
                  <p className="text-sm text-gray-600">Order #{selectedOrder.id}</p>
                </div>
                
                <div className="h-96 overflow-y-auto p-4 space-y-3">
                  {(chatMessages[selectedOrder.id] || []).map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'admin'
                            ? 'bg-rose-400 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage(selectedOrder.id, newMessage);
                        }
                      }}
                    />
                    <button
                      onClick={() => sendMessage(selectedOrder.id, newMessage)}
                      className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                  
                  {/* Quick Messages */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => sendMessage(selectedOrder.id, "Hello! For GCash payment, please send to 09123456789 (John Santos). Send screenshot when done.")}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200"
                    >
                      GCash Instructions
                    </button>
                    <button
                      onClick={() => sendMessage(selectedOrder.id, "For PayPal payment, send to gems.teahouse@gmail.com. Please include your order number in the notes.")}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200"
                    >
                      PayPal Instructions
                    </button>
                    <button
                      onClick={() => shareLocation(selectedOrder.id)}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm hover:bg-purple-200"
                    >
                      📍 Share Location
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Select an order to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // CUSTOMER APP COMPONENTS (keeping existing ones)
  const Navigation = () => (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {currentSection !== 'home' && (
              <button
                onClick={goBack}
                className="flex items-center text-gray-600 hover:text-rose-400 transition-colors"
              >
                <span className="mr-2">←</span>
                Back
              </button>
            )}
            <Logo />
          </div>
          <div className="hidden md:flex space-x-8">
            {['home', 'menu', 'about', 'gallery', 'reviews', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => navigateTo(section)}
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCart(true)}
              className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors relative"
            >
              Cart ({cart.length})
            </button>
            <button
              onClick={() => setIsManagementMode(true)}
              className="text-gray-600 hover:text-rose-400 text-sm"
            >
              Staff Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Quantity Modal Component
  const QuantityModal = () => {
    if (!showQuantityModal || !selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">{selectedItem.name}</h3>
          <p className="text-gray-600 mb-4">{selectedItem.description}</p>
          <p className="text-2xl font-bold text-rose-500 mb-6">₱{selectedItem.price}</p>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full hover:bg-gray-300 transition-colors"
            >
              -
            </button>
            <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full hover:bg-gray-300 transition-colors"
            >
              +
            </button>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowQuantityModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addToCart}
              className="flex-1 bg-rose-400 text-white py-3 rounded-lg hover:bg-rose-500 transition-colors"
            >
              Add to Cart (₱{selectedItem.price * quantity})
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Rating Modal Component
  const RatingModal = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    if (!showRating) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Rate Your Experience</h3>
          <p className="text-gray-600 mb-4">How was your order from Gem's Teahouse?</p>
          
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
              >
                ⭐
              </button>
            ))}
          </div>
          
          <textarea
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4"
            rows="3"
          />
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowRating(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => submitRating(rating, comment)}
              disabled={rating === 0}
              className="flex-1 bg-rose-400 text-white py-3 rounded-lg hover:bg-rose-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Rating
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Chat Component with real functionality
  const ChatModal = () => {
    if (!showChat || !orderData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full h-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Chat with Gem's Teahouse</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="border-t border-b flex-1 p-4 h-64 overflow-y-auto mb-4 space-y-3">
            {(chatMessages[orderData.id] || []).map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'customer'
                      ? 'bg-blue-400 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button className="bg-rose-400 text-white px-4 py-2 rounded-lg">Send</button>
          </div>
        </div>
      </div>
    );
  };

  // Keep all existing customer components (Hero, MenuSection, About, Gallery, Reviews, Contact, Cart)
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
          onClick={() => navigateTo('menu')}
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
                      onClick={() => openQuantityModal(item, 'milktea')}
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
                      onClick={() => openQuantityModal(item, 'milktea')}
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
                    onClick={() => openQuantityModal(item, 'combo')}
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
                    onClick={() => openQuantityModal(item, 'wings')}
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
                    onClick={() => openQuantityModal(item, 'snacks')}
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

  // Enhanced Cart Component with multi-step order process
  const Cart = () => {
    if (!showCart) return null;

    const CartStep = () => (
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Order</h3>
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {getUniqueItems().map((item) => (
                <div key={`${item.name}-${item.category}`} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-rose-500">₱{item.price * item.quantity}</span>
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
            <button
              onClick={proceedToDetails}
              className="w-full bg-rose-400 text-white py-3 rounded-lg font-semibold hover:bg-rose-500 transition-colors"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    );

    const DetailsStep = () => (
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Delivery Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name *"
              value={orderForm.name}
              onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
              className="p-3 border rounded-lg"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={orderForm.phone}
              onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
              className="p-3 border rounded-lg"
              required
            />
          </div>
          <textarea
            placeholder="Delivery Address *"
            value={orderForm.address}
            onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
            className="w-full p-3 border rounded-lg"
            rows="3"
            required
          />
          <textarea
            placeholder="Special Instructions (Optional)"
            value={orderForm.notes}
            onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
            className="w-full p-3 border rounded-lg"
            rows="2"
          />
          <div className="flex space-x-4">
            <button
              onClick={() => setOrderStep('cart')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Cart
            </button>
            <button
              onClick={proceedToPayment}
              className="flex-1 bg-rose-400 text-white py-3 rounded-lg font-semibold hover:bg-rose-500 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );

    const PaymentStep = () => (
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h3>
        <div className="space-y-4">
          <div className="border p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Order Summary</h4>
            <p>Total: ₱{getTotalPrice()}</p>
            <p className="text-sm text-gray-600">Delivery to: {orderForm.address}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => placeOrder('cod')}
              className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              💵 Cash on Delivery
            </button>
            <button
              onClick={() => placeOrder('online')}
              className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              💳 Online Payment (GCash/PayPal)
            </button>
          </div>
          
          <button
            onClick={() => setOrderStep('details')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Details
          </button>
        </div>
      </div>
    );

    const TrackingStep = () => {
      if (!orderData) return null;
      
      const status = getStatusDisplay(orderData.status);
      
      return (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Tracking</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Order #{orderData.id}</h4>
            <p className="text-sm text-gray-600">Placed: {new Date(orderData.timestamp).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total: ₱{orderData.total}</p>
          </div>

          <div className="mb-6">
            <div className={`${status.color} text-white p-4 rounded-lg text-center font-semibold`}>
              {status.text}
            </div>
            
            <div className="mt-4 flex justify-between text-sm">
              {['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, index) => (
                <div key={step} className={`text-center ${index < status.step ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${index < status.step ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {orderData.needsChat && orderData.status === 'confirmed' && (
            <button
              onClick={() => setShowChat(true)}
              className="w-full bg-blue-500 text-white py-3 rounded-lg mb-4 hover:bg-blue-600 transition-colors"
            >
              💬 Chat for Payment Details
            </button>
          )}

          {orderData.status === 'out_for_delivery' && (
            <button
              onClick={confirmDelivery}
              className="w-full bg-green-500 text-white py-3 rounded-lg mb-4 hover:bg-green-600 transition-colors"
            >
              ✅ Order Received
            </button>
          )}

          <div className="space-y-2">
            <h5 className="font-semibold">Order Items:</h5>
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span>{item.name} (x{item.quantity})</span>
                <span>₱{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                {orderStep !== 'tracking' && (
                  <div className="flex space-x-2">
                    <div className={`w-3 h-3 rounded-full ${orderStep === 'cart' ? 'bg-rose-400' : 'bg-gray-300'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${orderStep === 'details' ? 'bg-rose-400' : 'bg-gray-300'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${orderStep === 'payment' ? 'bg-rose-400' : 'bg-gray-300'}`}></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setShowCart(false);
                  setOrderStep('cart');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {orderStep === 'cart' && <CartStep />}
            {orderStep === 'details' && <DetailsStep />}
            {orderStep === 'payment' && <PaymentStep />}
            {orderStep === 'tracking' && <TrackingStep />}
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

  // MAIN APP RENDER
  if (isManagementMode) {
    if (!isAuthenticated) {
      return <ManagementLogin />;
    }

    return (
      <div className="min-h-screen bg-gray-100">
        {managementSection === 'dashboard' && <ManagementDashboard />}
        {managementSection === 'orders' && <ManagementOrders />}
        {managementSection === 'messages' && <ManagementMessages />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {renderSection()}
      <Cart />
      <QuantityModal />
      <ChatModal />
      <RatingModal />
      
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