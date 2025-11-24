import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import './QnaDetail.css';

const QnaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [qna, setQna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQnaDetail();
  }, [id]);

  const fetchQnaDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/qna/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Q&A 상세 응답:', response.data);

      if (response.data && response.data.success) {
        setQna(response.data.data);
      } else if (response.data) {
        setQna(response.data);
      }
    } catch (error) {
      console.error('Q&A 상세 조회 실패:', error);
      alert('Q&A 정보를 불러오는데 실패했습니다.');
      navigate('/admin/qna');
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
        `${API_BASE_URL}/api/admin/qna/${id}/reply`,
        {
          content: replyContent,
          responder: 'Admin' // 관리자 이름 (실제로는 세션에서 가져와야 함)
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('답변 등록 응답:', response.data);

      if (response.data && response.data.success) {
        alert('답변이 등록되었습니다.');
        setReplyContent('');
        fetchQnaDetail(); // 새로고침
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
        `${API_BASE_URL}/api/admin/qna/reply/${replyId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        alert('답변이 삭제되었습니다.');
        fetchQnaDetail(); // 새로고침
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

  const handleGoToProduct = () => {
    if (qna && qna.productId) {
      window.open(`/products/${qna.productId}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="admin-qna-detail">
        <AdminSidebar />
        <div className="qna-detail-main">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!qna) {
    return (
      <div className="admin-qna-detail">
        <AdminSidebar />
        <div className="qna-detail-main">
          <div className="no-data">Q&A를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-qna-detail">
      <AdminSidebar />
      
      <div className="qna-detail-main">
        <div className="page-header">
          <h1>Q&A 상세</h1>
          <button onClick={() => navigate('/admin/qna')} className="back-button">
            목록으로
          </button>
        </div>

      {/* Q&A 정보 */}
      <div className="qna-detail-card">
        <table className="detail-table">
          <tbody>
            <tr>
              <th>번호</th>
              <td>{qna.id}</td>
            </tr>
            <tr>
              <th>상품명</th>
              <td>
                {qna.productName ? (
                  <span 
                    onClick={handleGoToProduct}
                    className="product-link"
                  >
                    {qna.productName}
                    <span className="link-icon">🔗</span>
                  </span>
                ) : (
                  '-'
                )}
              </td>
            </tr>
            <tr>
              <th>작성일자</th>
              <td>{formatDate(qna.createdAt)}</td>
            </tr>
            <tr>
              <th>작성자</th>
              <td>{qna.writer || '-'}</td>
            </tr>
            <tr>
              <th>제목</th>
              <td>{qna.title || '상품 문의'}</td>
            </tr>
            <tr>
              <th>질문 내용</th>
              <td className="content-cell">
                <div className="content-box">
                  {qna.question || '-'}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 답변 목록 */}
      {qna.replies && qna.replies.length > 0 && (
        <div className="replies-section">
          <h3>답변 목록</h3>
          {qna.replies.map((reply, index) => (
            <div key={reply.id || index} className="reply-card">
              <div className="reply-header">
                <span className="reply-author">{reply.responder || reply.author || 'Admin'}</span>
                <span className="reply-date">{formatDate(reply.createdAt)}</span>
              </div>
              <div className="reply-content">
                {reply.content}
              </div>
              <div className="reply-actions">
                <button
                  onClick={() => handleDeleteReply(reply.id)}
                  className="delete-button"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 답변 등록 폼 */}
      <div className="reply-form-section">
        <h3>답변 등록</h3>
        <div className="reply-form">
          <textarea
            placeholder="답변을 입력하세요"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows="6"
            className="reply-textarea"
          />
          <div className="form-actions">
            <button
              onClick={() => navigate('/admin/qna')}
              className="cancel-button"
            >
              목록
            </button>
            <button
              onClick={handleSubmitReply}
              disabled={submitting}
              className="submit-button"
            >
              {submitting ? '등록 중...' : '답변등록'}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QnaDetail;
