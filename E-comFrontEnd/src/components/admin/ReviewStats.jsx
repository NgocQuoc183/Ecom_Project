import React, { useState, useEffect } from 'react';
import { FaStar, FaUsers, FaShoppingBag, FaComments } from 'react-icons/fa';
import { getReviewStats } from '../../api/adminReviews';

const ReviewStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getReviewStats();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không thể tải thống kê đánh giá</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaComments className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng đánh giá</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.overview.totalReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaStar className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đánh giá TB</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900 mr-2">
                  {stats.overview.averageRating}
                </p>
                {renderStars(parseFloat(stats.overview.averageRating))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaUsers className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Người đánh giá</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.overview.uniqueReviewers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">SP được đánh giá</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.overview.reviewedProducts}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố đánh giá</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star];
              const percentage = stats.overview.totalReviews > 0 
                ? (count / stats.overview.totalReviews) * 100 
                : 0;

              return (
                <div key={star} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium mr-1">{star}</span>
                    <FaStar className="text-yellow-400 text-sm" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-gray-600">{count}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Reviewed Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top sản phẩm được đánh giá
          </h3>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {index + 1}
                  </span>
                </div>
                
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover ml-3"
                  />
                )}
                
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center mt-1">
                    {renderStars(parseFloat(product.avg_rating))}
                    <span className="text-xs text-gray-500 ml-2">
                      {product.avg_rating} ({product.review_count} đánh giá)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stats.topProducts.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Chưa có sản phẩm nào được đánh giá
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
