import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { getProductReviews, getProductReviewStats, addReview } from '../api/reviews';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(null); // null = chưa check, true/false = kết quả

  useEffect(() => {
    if (productId) {
      fetchReviews();
      fetchStats();
      checkCanReview();
    }
  }, [productId, currentPage]);

  const checkCanReview = async () => {
    const userId = getUserId();
    if (!userId) {
      setCanReview(false);
      return;
    }

    // Có thể thêm API call để check user đã mua sản phẩm chưa
    // Tạm thời set true, sẽ check khi submit
    setCanReview(true);
  };

  const fetchReviews = async () => {
    try {
      const response = await getProductReviews(productId, currentPage, 5);
      if (response.success) {
        setReviews(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getProductReviewStats(productId);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading review stats:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const userId = getUserId();
    if (!userId) {
      alert('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        user_id: userId,
        product_id: parseInt(productId),
        rating: parseInt(newReview.rating),
        comment: newReview.comment.trim()
      };

      console.log('Sending review data:', reviewData);

      const response = await addReview(reviewData);

      if (response.success) {
        alert('Đánh giá đã được thêm thành công!');
        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
        fetchStats();
      } else {
        alert(response.message || 'Có lỗi xảy ra khi thêm đánh giá');
      }
    } catch (error) {
      console.error('Error submitting review:', error);

      let errorMessage = 'Có lỗi xảy ra khi thêm đánh giá';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn chỉ có thể đánh giá sản phẩm đã mua. Vui lòng mua sản phẩm trước khi đánh giá.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Thông tin đánh giá không hợp lệ. Vui lòng kiểm tra lại.';
      }

      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && onStarClick && onStarClick(i)}
          className={`${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          disabled={!interactive}
        >
          {i <= rating ? <FaStar /> : <FaRegStar />}
        </button>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h3>

      {/* Thống kê đánh giá */}
      {stats && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-bold">{stats.averageRating}</div>
            <div>
              {renderStars(Math.round(stats.averageRating))}
              <p className="text-sm text-gray-600 mt-1">
                {stats.totalReviews} đánh giá
              </p>
            </div>
          </div>

          {/* Phân bố rating */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-8">{star} ⭐</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: stats.totalReviews > 0 
                        ? `${(stats.ratingDistribution[star] / stats.totalReviews) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-sm w-8 text-right">
                  {stats.ratingDistribution[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nút thêm đánh giá */}
      {getUserId() ? (
        <div className="mb-6">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition-colors"
          >
            {showReviewForm ? 'Hủy' : 'Viết đánh giá'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-amber-600">*</span> Chỉ khách hàng đã mua sản phẩm mới có thể đánh giá
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            <a href="/login" className="text-amber-800 hover:underline">Đăng nhập</a> để viết đánh giá sản phẩm
          </p>
        </div>
      )}

      {/* Form thêm đánh giá */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-4 border rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Đánh giá của bạn:</label>
            {renderStars(newReview.rating, true, (rating) =>
              setNewReview({ ...newReview, rating })
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Nhận xét: <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows="4"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              required
              minLength="10"
            />
            <p className="text-sm text-gray-500 mt-1">Tối thiểu 10 ký tự</p>
          </div>

          <button
            type="submit"
            disabled={submitting || newReview.comment.trim().length < 10}
            className="bg-amber-800 text-white px-6 py-2 rounded-lg hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      )}

      {/* Danh sách đánh giá */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.avatar_url ? (
                    <img
                      src={`http://localhost:3001${review.avatar_url}`}
                      alt={review.user_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {review.user_name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{review.user_name}</h4>
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-amber-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
