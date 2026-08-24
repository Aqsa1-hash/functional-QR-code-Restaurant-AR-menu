import React, { useState } from 'react';

function OwnerView() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [modelPath, setModelPath] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price), modelPath })
      });

      if (response.ok) {
        alert('Product added successfully with AR model!');
        setName('');
        setPrice('');
        setModelPath('');
      } else {
        alert('Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Backend connection error.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">👨‍💼 Restaurant Owner Dashboard</h1>
        <p className="text-gray-600">Add new menu items.</p>
      </header>

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New AR Product</h2>
        <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Product Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="e.g. Cheese Burger"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Price ($):</label>
            <input 
              type="number" 
              step="0.01" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
              placeholder="9.99"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">3D Model Path:</label>
            <input 
              type="text" 
              value={modelPath} 
              onChange={(e) => setModelPath(e.target.value)} 
              required 
              placeholder="/models/burger.glb"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition mt-2">
            Add Product to Menu
          </button>
        </form>
      </div>
    </div>
  );
}

export default OwnerView;