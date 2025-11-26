import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 알림에서 온 경우
  const fromNotifications = location.state?.from === 'notifications';

  const handleBack = () => {
    if (fromNotifications) {
      navigate('/notifications');
    } else {
      navigate('/mypage/orders');
    }
  };

  useEffect(() => {
    console.log('📦 OrderDetail 마운트, orderId:', orderId);
    console.log('🔑 isAuthenticated:', isAuthenticated);
    console.log('📍 알림에서 왔는가?', fromNotifications);
    
    if (!isAuthenticated) {
      console.warn('⚠️ 로그인 필요');
      toast.error('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    loadOrderDetail();
  }, [orderId, isAuthenticated]);

  const loadOrderDetail = async () => {
    try {
      console.log('🔍 주문 상세 로딩 시작, orderId:', orderId);
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      console.log('🔑 Token:', token ? '존재' : '없음');
      
      const url = `http://localhost:8080/api/orders/${orderId}`;
      console.log('🎯 API URL:', url);
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('📦 API 응답:', response.data);

      if (response.data.success) {
        console.log('✅ 성공! order 데이터:', response.data.order);
        setOrder(response.data.order);
      } else {
        console.error('❌ API 실패:', response.data.message);
        toast.error('주문 정보를 불러올 수 없습니다.');
        navigate('/mypage/orders');
      }
    } catch (error) {
      console.error('💥 주문 상세 조회 실패:', error);
      console.error('에러 응답:', error.response?.data);
      console.error('에러 상태:', error.response?.status);
      toast.error('주문 정보를 불러오는데 실패했습니다.');
      navigate('/mypage/orders');
    } finally {
      setLoading(false);
      console.log('🏁 로딩 완료');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() || '0';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'ORDERED': '주문완료',
      'PAYMENT_PENDING': '입금대기',
      'DELIVERING': '배송중',
      'DELIVERED': '배송완료',
      'CANCELED': '주문취소'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      'ORDERED': 'status-ordered',
      'PAYMENT_PENDING': 'status-pending',
      'DELIVERING': 'status-delivering',
      'DELIVERED': 'status-delivered',
      'CANCELED': 'status-canceled'
    };
    return classMap[status] || '';
  };

  if (loading) {
    return (
      <div className="order-detail-container">
        <div className="loading">주문 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <button onClick={handleBack} className="back-button">
          ← {fromNotifications ? '알림 목록으로' : '주문 목록으로'}
        </button>
        <h2>주문 상세</h2>
      </div>

      <div className="order-detail-content">
        {/* 주문 정보 */}
        <div className="detail-section">
          <h3>주문 정보</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">주문번호</span>
              <span className="info-value">{order.orderNumber}</span>
            </div>
            <div className="info-row">
              <span className="info-label">주문일시</span>
              <span className="info-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">주문상태</span>
              <span className={`order-status ${getStatusClass(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">결제방법</span>
              <span className="info-value">
                {order.paymentMethod === 'CARD' ? '카드결제' : '무통장입금'}
              </span>
            </div>
          </div>
        </div>

        {/* 주문 상품 */}
        <div className="detail-section">
          <h3>주문 상품</h3>
          <div className="order-items">
            {order.orderItems && order.orderItems.map((item, index) => (
              <div key={index} className="order-item-card">
                <div className="item-image">
                  {item.productImage ? (
                    <img 
                      src={`http://localhost:8080${item.productImage}`} 
                      alt={item.productName}
                      onError={(e) => {
                        e.target.src = '/images/no-image.png';
                      }}
                    />
                  ) : (
                    <div className="no-image">이미지 없음</div>
                  )}
                </div>
                <div className="item-info">
                  <h4 
                    className="item-name"
                    onClick={() => navigate(`/products/${item.productId}`)}
                  >
                    {item.productName}
                  </h4>
                  <p className="item-price">
                    {formatPrice(item.price)}원 × {item.quantity}개
                  </p>
                  <p className="item-total">
                    소계: <strong>{formatPrice(item.price * item.quantity)}원</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 배송 정보 */}
        <div className="detail-section">
          <h3>배송 정보</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">수령인</span>
              <span className="info-value">{order.recipientName || '-'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">연락처</span>
              <span className="info-value">{order.recipientPhone || '-'}</span>
            </div>
            <div className="info-row full-width">
              <span className="info-label">배송지</span>
              <span className="info-value">{order.shippingAddress || '-'}</span>
            </div>
            <div className="info-row full-width">
              <span className="info-label">배송 요청사항</span>
              <span className="info-value">{order.shippingRequest || '-'}</span>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="detail-section payment-section">
          <h3>결제 정보</h3>
          <div className="payment-summary">
            <div className="payment-row">
              <span>상품 금액</span>
              <span>{formatPrice(order.totalAmount)}원</span>
            </div>
            <div className="payment-row">
              <span>배송비</span>
              <span>0원</span>
            </div>
            <div className="payment-row total">
              <span>총 결제 금액</span>
              <span className="total-amount">{formatPrice(order.totalAmount)}원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
