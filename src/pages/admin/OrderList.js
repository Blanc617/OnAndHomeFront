import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import './OrderList.css';

const OrderList = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/orders`);
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // 필터링
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.orderNumber?.includes(searchTerm) || 
      order.userId?.includes(searchTerm) ||
      (order.userName || order.username || '').includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-order-list">
        <AdminSidebar />
        <div className="order-list-main">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-list">
      <AdminSidebar />
      
      <div className="order-list-main">
        <div className="page-header">
          <h1>Order List</h1>
          
          <div className="header-controls">
            <select 
              className="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="ORDERED">결제완료</option>
              <option value="DELIVERING">배송중</option>
              <option value="DELIVERED">배송완료</option>
              <option value="CANCELED">취소</option>
            </select>
            
            <div className="search-box">
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="주문번호 또는 구매자명을 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">🔍</button>
              </form>
            </div>
          </div>
        </div>

        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>주문번호</th>
                <th>상품명</th>
                <th>주문가격</th>
                <th>구매자 ID</th>
                <th>구매자명</th>
                <th>주문상태</th>
                <th>주문일자</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7">조회된 주문이 없습니다.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  // 상품명 추출
                  let productName = '-';
                  if (order.orderItems && Array.isArray(order.orderItems) && order.orderItems.length > 0) {
                    const first = order.orderItems[0];
                    productName = first.productName || '-';
                    if (order.orderItems.length > 1) {
                      productName += ` 외 ${order.orderItems.length - 1}건`;
                    }
                  }

                  // 가격 포맷
                  const price = order.totalPrice ? order.totalPrice.toLocaleString() + '원' : '0원';

                  // 날짜 포맷
                  let dateStr = '-';
                  if (order.createdAt) {
                    try {
                      const d = new Date(order.createdAt);
                      dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    } catch (e) {
                      dateStr = '-';
                    }
                  }

                  // 상태 텍스트
                  const statusMap = {
                    'ORDERED': '결제완료',
                    'CANCELED': '취소',
                    'DELIVERING': '배송중',
                    'DELIVERED': '배송완료'
                  };
                  const statusText = statusMap[order.status] || order.status;

                  // 상태 클래스
                  const statusClassMap = {
                    'ORDERED': 'status-paid',
                    'CANCELED': 'status-cancelled',
                    'DELIVERING': 'status-shipping',
                    'DELIVERED': 'status-delivered'
                  };
                  const statusClass = statusClassMap[order.status] || '';

                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => handleRowClick(order.id)}
                      className="clickable-row"
                    >
                      <td>{order.orderNumber || '-'}</td>
                      <td style={{ textAlign: 'left', paddingLeft: '15px' }}>{productName}</td>
                      <td style={{ textAlign: 'right', paddingRight: '15px' }}>{price}</td>
                      <td>{order.userId || '-'}</td>
                      <td>{order.userName || order.username || '-'}</td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          {statusText}
                        </span>
                      </td>
                      <td>{dateStr}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="order-summary">
          <div className="summary-item">
            <span className="summary-label">총 주문 수:</span>
            <span className="summary-value">{filteredOrders.length}건</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">총 매출액:</span>
            <span className="summary-value">
              {filteredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
