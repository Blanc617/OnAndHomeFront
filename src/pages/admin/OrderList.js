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
      const response = await axios.get(`${API_BASE_URL}/api/admin/orders`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('주문 목록 응답:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
      alert('주문 목록을 불러오는데 실패했습니다.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색은 클라이언트 측 필터링으로 처리
  };

  const handleRowClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
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
      'ORDERED': 'status-paid',
      'CANCELED': 'status-cancelled',
      'DELIVERING': 'status-shipping',
      'DELIVERED': 'status-delivered'
    };
    return classMap[status] || '';
  };

  const getProductInfo = (orderItems) => {
    if (!orderItems || orderItems.length === 0) return '-';
    
    if (orderItems.length === 1) {
      return orderItems[0].productName;
    } else {
      return `${orderItems[0].productName} 외 ${orderItems.length - 1}건`;
    }
  };

  // 필터링
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.includes(searchTerm) || 
      order.userId?.includes(searchTerm) ||
      order.userName?.includes(searchTerm) ||
      order.username?.includes(searchTerm);
    
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
              <form onSubmit={handleSearch}>
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
                <th style={{ width: '150px' }}>주문번호</th>
                <th>상품명</th>
                <th style={{ width: '120px' }}>주문가격</th>
                <th style={{ width: '120px' }}>구매자 ID</th>
                <th style={{ width: '120px' }}>구매자명</th>
                <th style={{ width: '100px' }}>주문상태</th>
                <th style={{ width: '120px' }}>주문일자</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    조회된 주문이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => handleRowClick(order.id)}
                    className="clickable-row"
                  >
                    <td className="order-number">{order.orderNumber}</td>
                    <td className="product-info text-left">
                      {getProductInfo(order.orderItems)}
                    </td>
                    <td className="price">{formatPrice(order.totalPrice)}</td>
                    <td>{order.userId || '-'}</td>
                    <td>{order.userName || order.username || '-'}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))
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
              {filteredOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
