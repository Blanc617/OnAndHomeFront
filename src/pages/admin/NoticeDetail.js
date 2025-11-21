import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './NoticeDetail.css';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

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
- 주문 시 배송지 정보를 정확히 입력해주세요.

3. 배송 안내
- 평일 오후 2시 이전 주문 시 당일 출고됩니다.
- 제주 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.

4. 교환 및 환불
- 상품 수령 후 7일 이내 교환 및 환불이 가능합니다.
- 단순 변심의 경우 왕복 배송비가 부과됩니다.

문의사항이 있으시면 고객센터(1588-0000)로 연락주시기 바랍니다.

감사합니다.`,
        author: '관리자',
        createdDate: '2024-01-15 14:30:25',
        updatedDate: '2024-01-15 14:30:25',
        views: 150,
        isFixed: true,
        isPublic: true
      };
      
      setNotice(dummyData);
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      alert('공지사항을 불러오는데 실패했습니다.');
      navigate('/admin/notices');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/notices/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      // API 호출 구현
      // await fetch(`/api/admin/notices/${id}`, { method: 'DELETE' });
      alert('삭제되었습니다.');
      navigate('/admin/notices');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleList = () => {
    navigate('/admin/notices');
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

  if (!notice) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="dashboard-main">
          <div className="error-message">공지사항을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <div className="dashboard-main">
        <div className="notice-detail-container">
          <div className="notice-detail-header">
            <h1>공지사항 상세</h1>
          </div>

          <div className="notice-detail-card">
            {/* 헤더 */}
            <div className="detail-header">
              <div className="title-section">
                {notice.isFixed && <span className="badge-fixed">공지</span>}
                <h2 className="detail-title">{notice.title}</h2>
              </div>
              
              <div className="meta-info">
                <div className="meta-item">
                  <span className="meta-label">작성자</span>
                  <span className="meta-value">{notice.author}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">작성일</span>
                  <span className="meta-value">{notice.createdDate}</span>
                </div>
                {notice.updatedDate !== notice.createdDate && (
                  <div className="meta-item">
                    <span className="meta-label">수정일</span>
                    <span className="meta-value">{notice.updatedDate}</span>
                  </div>
                )}
                <div className="meta-item">
                  <span className="meta-label">조회수</span>
                  <span className="meta-value">{notice.views}</span>
                </div>
              </div>

              <div className="status-badges">
                <span className={`status-badge ${notice.isPublic ? 'public' : 'private'}`}>
                  {notice.isPublic ? '공개' : '비공개'}
                </span>
                {notice.isFixed && (
                  <span className="status-badge fixed">상단 고정</span>
                )}
              </div>
            </div>

            {/* 내용 */}
            <div className="detail-content">
              <div className="content-body">
                {notice.content.split('\n').map((line, index) => (
                  <p key={index}>{line || '\u00A0'}</p>
                ))}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="detail-actions">
              <button className="btn-list" onClick={handleList}>
                목록
              </button>
              <div className="action-group">
                <button className="btn-edit" onClick={handleEdit}>
                  수정
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
