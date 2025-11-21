import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate, user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/orders/user/${user.id}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('주문 목록 응답:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
      
      if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        // 에러가 발생해도 빈 배열로 설정
        setOrders([]);
      }
    } finally {
      setLoading(false);
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
      'PENDING': '결제 대기',
      'PAID': '결제 완료',
      'PREPARING': '배송 준비중',
      'SHIPPING': '배송 중',
      'DELIVERED': '배송 완료',
      'CANCELLED': '주문 취소',
      'REFUNDED': '환불 완료'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const statusClassMap = {
      'PENDING': 'status-pending',
      'PAID': 'status-paid',
      'PREPARING': 'status-preparing',
      'SHIPPING': 'status-shipping',
      'DELIVERED': 'status-delivered',
      'CANCELLED': 'status-cancelled',
      'REFUNDED': 'status-refunded'
    };
    return statusClassMap[status] || '';
  };

  const handleOrderDetail = (orderId) => {
    navigate(`/user/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="my-orders-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="my-orders-content">
        <h1>주문 내역</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>주문 내역이 없습니다.</p>
            <button 
              className="go-shopping-btn"
              onClick={() => navigate('/products')}
            >
              쇼핑 하러 가기
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                    <span className="order-number">주문번호: {order.orderNumber || order.id}</span>
                  </div>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="order-body">
                  {order.items && order.items.length > 0 ? (
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="item-info">
                            <span className="item-name">{item.productName}</span>
                            <span className="item-quantity">수량: {item.quantity}개</span>
                          </div>
                          <div className="item-price">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-items">주문 상품 정보가 없습니다.</p>
                  )}

                  <div className="order-summary">
                    <div className="delivery-info">
                      <strong>배송지:</strong> {order.shippingAddress || '배송지 정보 없음'}
                    </div>
                    <div className="total-amount">
                      <strong>총 결제금액:</strong> 
                      <span className="amount">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="order-footer">
                  <button 
                    className="detail-btn"
                    onClick={() => handleOrderDetail(order.id)}
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
