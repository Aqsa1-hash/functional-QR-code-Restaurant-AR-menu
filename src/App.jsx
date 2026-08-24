import React, { useState } from 'react';
import CustomerView from './CustomerView';
import OwnerView from './OwnerView';

function App() {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Tabs */}
      <nav className="hidden md:flex justify-center gap-4 p-4 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <button 
          onClick={() => setActiveTab('customer')}
          className={`px-6 py-2.5 rounded-xl font-medium transition ${activeTab === 'customer' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Customer View (AR Menu)
        </button>
        <button        
          onClick={() => setActiveTab('owner')}
          className={`px-6 py-2.5 rounded-xl font-medium transition ${activeTab === 'owner' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Owner Dashboard (Add Products)
        </button>
      </nav>

      {/* Active Component */}
      <main>
        {activeTab === 'customer' ? <CustomerView /> : <OwnerView />}
      </main>
    </div>
  );
}

export default App;