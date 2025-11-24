import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reviewApi from '../../api/reviewApi';
import './MyReviews.css';

const MyReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('=== 내 리뷰 조회 시작 ===');
      const response = await reviewApi.getMyReviews();
      console.log('API 응답:', response);
      
      if (response.success) {
        console.log('리뷰 데이터:', response.data);
        console.log('리뷰 개수:', response.data.length);
        setReviews(response.data);
      } else {
        console.error('API 실패:', response.message);
        setError(response.message || '리뷰를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('내 리뷰 조회 실패:', error);
      console.error('에러 상세:', error.response?.data);
      setError('리뷰를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (review) => {
    console.log('리뷰 클릭:', review);
    // 상품 상세 페이지의 리뷰 탭으로 이동
    navigate(`/products/${review.productId}?tab=review&reviewId=${review.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '-').replace('.', '');
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="my-reviews-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-reviews-container">
        <div className="my-reviews-header">
          <h2>리뷰 관리</h2>
          <p>작성하신 리뷰를 확인할 수 있습니다.</p>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchMyReviews} className="retry-button">다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reviews-container">
      <div className="my-reviews-header">
        <h2>리뷰 관리</h2>
        <p>작성하신 리뷰를 확인할 수 있습니다.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>작성한 리뷰가 없습니다.</p>
          <p className="debug-info">
            API 호출은 성공했지만 리뷰 데이터가 비어있습니다.<br/>
            브라우저 콘솔(F12)을 열어서 로그를 확인해주세요.
          </p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="review-item"
              onClick={() => handleReviewClick(review)}
            >
              <div className="review-item-header">
                <div className="product-info">
                  <span className="product-name">{review.productName || '상품명 없음'}</span>
                  <span className="review-date">{formatDate(review.createdAt)}</span>
                </div>
                <div className="rating-display">
                  <span className="stars">{renderStars(review.rating || 0)}</span>
                  <span className="rating-number">{review.rating || 0}.0</span>
                </div>
              </div>
              <div className="review-item-body">
                <h3 className="review-title">{review.title || review.productName || '제목 없음'}</h3>
                <p className="review-content">{review.content || '내용 없음'}</p>
                {review.reply && (
                  <div className="review-reply-preview">
                    <span className="reply-label">판매자 답변:</span>
                    <span className="reply-content">
                      {review.reply.substring(0, 100)}
                      {review.reply.length > 100 && '...'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
