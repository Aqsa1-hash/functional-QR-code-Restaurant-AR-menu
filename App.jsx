import React, { useState } from 'react';
import '@google/model-viewer';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Saari 11 files ke sath mukammal menu list
  const menuItems = [
    {
      id: 1,
      name: 'Delicious Pizza',
      price: 12.99,
      modelPath: '/models/3d_pizza.glb',
    },
    {
      id: 2,
      name: 'Large Iced Drink',
      price: 4.99,
      modelPath: '/models/a_large_iced_drink.glb',
    },
    {
      id: 3,
      name: 'Chicken Duck',
      price: 14.99,
      modelPath: '/models/chicken_duck.glb',
    },
    {
      id: 4,
      name: 'Chicken Sandwich',
      price: 6.99,
      modelPath: '/models/chicken_sandwich.glb',
    },
    {
      id: 5,
      name: 'Noodles with Soybean Paste',
      price: 9.99,
      modelPath: '/models/noodles_with_soybean_paste_scaniverse.glb',
    },
    {
      id: 6,
      name: 'Seafood Platter',
      price: 19.99,
      modelPath: '/models/seafood_platter_scaniverse.glb',
    },
    {
      id: 7,
      name: 'Steak and Rice',
      price: 16.99,
      modelPath: '/models/steak_and_rice_scaniverse.glb',
    },
    {
      id: 8,
      name: 'Steak Sandwich',
      price: 11.99,
      modelPath: '/models/steak_sandwich_scaniverse_lidar.glb',
    },
    {
      id: 9,
      name: 'Summer Drink',
      price: 5.49,
      modelPath: '/models/summer_drink.glb',
    },
    {
      id: 10,
      name: 'Vegan Fusion Satay',
      price: 10.99,
      modelPath: '/models/vegan_fusion_satay__masak_merah_scaniverse.glb',
    },
    {
      id: 11,
      name: 'Vegan Hainanese Chicken Rice',
      price: 12.49,
      modelPath: '/models/vegan_hainanese_chicken_rice_scaniverse.glb',
    }
  ];

  // Add to cart function
  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} added to cart!`);
  };

  // Submit feedback to backend with your IP address
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://192.168.1.82:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment: feedbackText })
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to connect to backend server.');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🍽️ AR Restaurant Menu</h1>
        <p>Scan the QR code to open on mobile, view food in AR, and order directly!</p>

        {/* QR Code Section with Updated IP Address */}
        <div className="qr-container">
          <div className="qr-box">
            <QRCodeSVG value="http://192.168.1.82:5173" size={110} />
            <p>Scan to test on mobile</p>
          </div>
        </div>
      </header>

      {/* Menu Section */}
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="food-card">
            <h2>{item.name}</h2>
            <p className="price">${item.price}</p>

            {/* Google Model Viewer for Web AR */}
            <div className="model-container">
              <model-viewer
                src={item.modelPath}
                alt={item.name}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                style={{ width: '100%', height: '250px' }}
              >
                <button slot="ar-button" className="ar-btn">
                  View in AR
                </button>
              </model-viewer>
            </div>

            <button className="cart-btn" onClick={() => addToCart(item)}>
              Add to Cart ({cart.filter(c => c.id === item.id).length})
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary Section */}
      <div className="cart-section">
        <h2>🛒 Your Cart Summary</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price}
                </li>
              ))}
            </ul>
            <h3>Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</h3>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="feedback-section">
        <h2>⭐ Rate Your Experience</h2>
        {submitted ? (
          <p className="thank-you">Thank you for your valuable feedback!</p>
        ) : (
          <form onSubmit={handleFeedbackSubmit}>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? 'selected' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Write your feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="submit-btn">Submit Feedback</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;