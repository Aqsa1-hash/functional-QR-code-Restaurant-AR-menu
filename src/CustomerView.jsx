import React, { useState, useEffect } from 'react';
import '@google/model-viewer';
import { QRCodeSVG } from 'qrcode.react';

function CustomerView() {
  const [cart, setCart] = useState([]);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [menuItems, setMenuItems] = useState([]); // State for dynamic products from DB

  // Fetch products from MongoDB via backend when component loads
  useEffect(() => {
    fetch('http://127.0.0.1:5001/api/products')
      .then((res) => res.json())
      .then((data) => {
     
        if (data && data.length > 0) {
          setMenuItems(data);
        }
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} added to cart!`);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5001/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment: feedbackText })
      });
      
      if (response.ok) {
        setSubmitted(true); 
      } else {
        alert('Server returned an error.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to connect to backend server. Make sure your backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">🍽️ AR Restaurant Menu</h1>
        <p className="text-gray-600 mb-6">Scan the QR code to open on mobile, view food in AR, and order directly!</p>
        
        <div className="flex justify-center">
          <div className="p-4 bg-white shadow-md rounded-xl inline-block">
              <QRCodeSVG value="http://192.168.1.82:5173" size={110} />
          </div>
        </div>
      </header>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
        {menuItems.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No products available yet. Add some from the Owner Dashboard!</p>
        ) : (
          menuItems.map((item) => (
            <div key={item._id || item.id} className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-shadow">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{item.name}</h2>
                <p className="text-green-600 font-bold text-lg mb-4">${item.price}</p>

                <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                  <model-viewer
                    src={item.modelPath}
                    alt={item.name}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    style={{ width: '100%', height: '100%' }}
                  >
                    <button slot="ar-button" className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-blue-700 transition">
                      View in AR
                    </button>
                  </model-viewer>
                </div>
              </div>

              <button 
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition"
                onClick={() => addToCart(item)}
              >
                Add to Cart ({cart.filter(c => (c._id || c.id) === (item._id || item.id)).length})
              </button>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-10 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛒 Your Cart Summary</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-100 mb-4">
              {cart.map((item, index) => (
                <li key={index} className="py-2 flex justify-between text-gray-700">
                  <span>{item.name}</span>
                  <span className="font-semibold">${item.price}</span>
                </li>
              ))}
            </ul>
            <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
              <span>Total:</span>
              <span className="text-green-600">${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">⭐ Rate Your Experience</h2>
        {submitted ? (
          <p className="text-green-600 text-center font-medium py-4">Thank you for your valuable feedback!</p>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
            <div className="flex justify-center gap-2 text-3xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={rating >= star ? 'text-yellow-400' : 'text-gray-300'}
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
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28"
            ></textarea>
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition">
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CustomerView;