import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import './ReviewDetail.css';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [review, setReview] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviewDetail();
  }, [id]);

  const fetchReviewDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      console.log('리뷰 상세 응답:', response.data);

      if (response.data && response.data.success) {
        setReview(response.data.review);
        setReplies(response.data.replies || []);
      }
    } catch (error) {
      console.error('리뷰 상세 조회 실패:', error);
      alert('리뷰 정보를 불러오는데 실패했습니다.');
      navigate('/admin/reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    if (!window.confirm('답변을 등록하시겠습니까?')) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/reviews/${id}/reply`,
        {
          content: replyContent,
          responder: 'Admin'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      console.log('답변 등록 응답:', response.data);

      if (response.data && response.data.success) {
        alert('답변이 등록되었습니다.');
        setReplyContent('');
        fetchReviewDetail(); // 새로고침
      } else {
        alert(response.data.message || '답변 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('답변 등록 실패:', error);
      alert('답변 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('답변을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/admin/reviews/reply/${replyId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (response.data && response.data.success) {
        alert('답변이 삭제되었습니다.');
        fetchReviewDetail(); // 새로고침
      } else {
        alert(response.data.message || '답변 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('답변 삭제 실패:', error);
      alert('답변 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="admin-review-detail">
        <AdminSidebar />
        <div className="review-detail-main">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="admin-review-detail">
        <AdminSidebar />
        <div className="review-detail-main">
          <div className="error">리뷰를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-review-detail">
      <AdminSidebar />
      
      <div className="review-detail-main">
        <div className="page-header">
          <h1>리뷰 상세</h1>
          <button 
            className="btn-back"
            onClick={() => navigate('/admin/reviews')}
          >
            목록으로
          </button>
        </div>

        {/* 리뷰 정보 */}
        <div className="review-info-card">
          <div className="review-header">
            <div className="review-meta">
              <span className="review-author">{review.author || review.username}</span>
              <span className="review-date">{formatDate(review.createdAt)}</span>
            </div>
            <div className="review-rating">
              <span className="stars">{renderStars(review.rating)}</span>
              <span className="rating-number">{review.rating}/5</span>
            </div>
          </div>

          <div className="review-product">
            상품: <strong>{review.productName || '-'}</strong>
          </div>

          <div className="review-content">
            {review.content}
          </div>
        </div>

        {/* 답글 목록 */}
        <div className="replies-section">
          <h2>답변 목록 ({replies.length})</h2>
          
          {replies.length > 0 ? (
            <div className="replies-list">
              {replies.map((reply) => (
                <div key={reply.id} className="reply-item">
                  <div className="reply-header">
                    <div className="reply-meta">
                      <span className="reply-author">{reply.author}</span>
                      <span className="reply-date">{formatDate(reply.createdAt)}</span>
                    </div>
                    <button 
                      className="btn-delete-reply"
                      onClick={() => handleDeleteReply(reply.id)}
                    >
                      삭제
                    </button>
                  </div>
                  <div className="reply-content">
                    {reply.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-replies">등록된 답변이 없습니다.</div>
          )}
        </div>

        {/* 답변 작성 */}
        <div className="reply-form">
          <h2>답변 작성</h2>
          <textarea
            className="reply-textarea"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답변 내용을 입력하세요"
            rows="5"
            disabled={submitting}
          />
          <div className="reply-actions">
            <button 
              className="btn-submit"
              onClick={handleSubmitReply}
              disabled={submitting || !replyContent.trim()}
            >
              {submitting ? '등록 중...' : '답변 등록'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
