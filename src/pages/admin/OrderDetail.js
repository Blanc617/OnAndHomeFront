import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/orders/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      console.log('주문 상세 응답:', response.data);
      setOrder(response.data);
    } catch (error) {
      console.error('주문 상세 조회 실패:', error);
      alert('주문 정보를 불러오는데 실패했습니다.');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`주문 상태를 "${getStatusText(newStatus)}"(으)로 변경하시겠습니까?`)) {
      return;
    }

    setStatusUpdating(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/orders/${id}/status`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      alert('주문 상태가 변경되었습니다.');
      fetchOrderDetail();
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    } finally {
      setStatusUpdating(false);
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

  const formatPrice = (price) => {
    return price ? price.toLocaleString() + '원' : '0원';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'ORDERED': '결제완료',
      'CANCELED': '취소',
      'DELIVERING': '배송중',
      'DELIVERED': '배송완료'
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeClass = (status) => {
    const classMap = {
      'ORDERED': 'status-ordered',
      'CANCELED': 'status-canceled',
      'DELIVERING': 'status-delivering',
      'DELIVERED': 'status-delivered'
    };
    return classMap[status] || '';
  };

  if (loading) {
    return (
      <div className="admin-order-detail">
        <AdminSidebar />
        <div className="order-detail-main">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-order-detail">
        <AdminSidebar />
        <div className="order-detail-main">
          <div className="error-message">주문 정보를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-detail">
      <AdminSidebar />
      
      <div className="order-detail-main">
        <div className="page-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/admin/orders')}>
              ← 목록으로
            </button>
            <h1>주문 상세</h1>
          </div>
          <div className="header-right">
            <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        {/* 주문 기본 정보 */}
        <div className="detail-section">
          <h2>주문 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">주문번호</span>
              <span className="info-value">{order.orderNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">주문일시</span>
              <span className="info-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">주문상태</span>
              <span className="info-value">
                <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">총 주문금액</span>
              <span className="info-value highlight">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* 주문자 정보 */}
        <div className="detail-section">
          <h2>주문자 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">구매자 ID</span>
              <span className="info-value">{order.userId || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">구매자명</span>
              <span className="info-value">{order.userName || order.username || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">연락처</span>
              <span className="info-value">{order.phone || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">이메일</span>
              <span className="info-value">{order.email || '-'}</span>
            </div>
          </div>
        </div>

        {/* 배송지 정보 */}
        <div className="detail-section">
          <h2>배송지 정보</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <span className="info-label">배송지 주소</span>
              <span className="info-value">{order.address || '-'}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">배송 메시지</span>
              <span className="info-value">{order.deliveryMessage || '없음'}</span>
            </div>
          </div>
        </div>

        {/* 주문 상품 정보 */}
        <div className="detail-section">
          <h2>주문 상품</h2>
          <div className="order-items-table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>번호</th>
                  <th>상품명</th>
                  <th style={{ width: '100px' }}>수량</th>
                  <th style={{ width: '120px' }}>단가</th>
                  <th style={{ width: '120px' }}>금액</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-left">{item.productName}</td>
                      <td className="text-center">{item.quantity}개</td>
                      <td className="text-right">{formatPrice(item.price)}</td>
                      <td className="text-right">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">주문 상품이 없습니다.</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-right total-label">총 주문금액</td>
                  <td className="text-right total-price">{formatPrice(order.totalPrice)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* 상태 변경 버튼 */}
        <div className="detail-section">
          <h2>주문 상태 관리</h2>
          <div className="status-buttons">
            <button 
              className="status-btn btn-ordered"
              onClick={() => handleStatusChange('ORDERED')}
              disabled={statusUpdating || order.status === 'ORDERED'}
            >
              결제완료
            </button>
            <button 
              className="status-btn btn-delivering"
              onClick={() => handleStatusChange('DELIVERING')}
              disabled={statusUpdating || order.status === 'DELIVERING'}
            >
              배송중
            </button>
            <button 
              className="status-btn btn-delivered"
              onClick={() => handleStatusChange('DELIVERED')}
              disabled={statusUpdating || order.status === 'DELIVERED'}
            >
              배송완료
            </button>
            <button 
              className="status-btn btn-canceled"
              onClick={() => handleStatusChange('CANCELED')}
              disabled={statusUpdating || order.status === 'CANCELED'}
            >
              취소
            </button>
          </div>
          {statusUpdating && <div className="status-updating">상태 변경 중...</div>}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
