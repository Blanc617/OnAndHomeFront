import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './NoticeWrite.css';

const NoticeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isFixed: false,
    isPublic: true
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNoticeDetail();
  }, [id]);

  const fetchNoticeDetail = async () => {
    setLoading(true);
    try {
      // API 호출 구현
      // const response = await fetch(`/api/admin/notices/${id}`);
      // const data = await response.json();
      
      // 임시 더미 데이터
      const dummyData = {
        id: Number(id),
        title: '사이트 이용 안내',
        content: `안녕하세요, On&Home 관리자입니다.

사이트 이용에 대한 안내 말씀드립니다.

1. 회원가입 및 로그인
- 이메일 인증을 통한 회원가입이 가능합니다.
- 소셜 로그인(카카오, 네이버, 구글)도 지원됩니다.

2. 상품 주문
- 장바구니에 담은 상품은 30일간 보관됩니다.
- 주문 시 배송지 정보를 정확히 입력해주세요.`,
        isFixed: true,
        isPublic: true
      };
      
      setFormData({
        title: dummyData.title,
        content: dummyData.content,
        isFixed: dummyData.isFixed,
        isPublic: dummyData.isPublic
      });
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      alert('공지사항을 불러오는데 실패했습니다.');
      navigate('/admin/notices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      // API 호출 구현
      // const response = await fetch(`/api/admin/notices/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // 임시 처리
      console.log('공지사항 수정:', formData);
      alert('공지사항이 수정되었습니다.');
      navigate(`/admin/notices/${id}`);
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      alert('공지사항 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까? 변경사항은 저장되지 않습니다.')) {
      navigate(`/admin/notices/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="dashboard-main">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <div className="dashboard-main">
        <div className="notice-write-container">
          <div className="notice-write-header">
            <h1>공지사항 수정</h1>
            <p className="notice-description">공지사항을 수정합니다</p>
          </div>

          <form onSubmit={handleSubmit} className="notice-write-form">
            <div className="form-card">
              <div className="form-section">
                <label className="form-label required">
                  제목
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="공지사항 제목을 입력하세요"
                  className="form-input"
                  maxLength={100}
                />
                <div className="char-count">
                  {formData.title.length} / 100
                </div>
              </div>

              <div className="form-section">
                <label className="form-label required">
                  내용
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="공지사항 내용을 입력하세요"
                  className="form-textarea"
                  rows={15}
                />
                <div className="char-count">
                  {formData.content.length}자
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">
                  설정
                </label>
                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isFixed"
                      checked={formData.isFixed}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span className="checkbox-text">
                      <strong>상단 고정</strong>
                      <span className="checkbox-desc">이 공지사항을 목록 상단에 고정합니다</span>
                    </span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span className="checkbox-text">
                      <strong>공개</strong>
                      <span className="checkbox-desc">사용자 페이지에 공지사항을 표시합니다</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
              >
                취소
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting}
              >
                {submitting ? '수정 중...' : '수정하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoticeEdit;
