import React, { useState } from 'react';
import ReviewStats from '../../components/admin/ReviewStats';
import ReviewList from '../../components/admin/ReviewList';

const ManageReviews = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div>
      {/* Header với tabs */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý đánh giá</h1>

        {/* Tabs */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📝 Danh sách đánh giá
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 Thống kê
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && <ReviewList />}
      {activeTab === 'stats' && <ReviewStats />}
    </div>
  );
};

export default ManageReviews;
