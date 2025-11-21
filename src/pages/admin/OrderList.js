import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './OrderList.css';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'fe44d397-948',
      productInfo: '삼성 KQ85QC75AFXKR',
      totalAmount: '2,590,000원',
      orderAmount: '5,180,000원',
      buyerId: 'admin',
      buyerName: '김민자',
      orderStatus: '결제완료',
      orderDate: '2025-10-27'
    },
    {
      id: 2,
      orderNumber: '4e2723ce-a0f',
      productInfo: 'LG 에어컨 FQ27GASMA2 일반벽걸 etv',
      totalAmount: '16,000,000원',
      orderAmount: '16,000,000원',
      buyerId: 'User',
      buyerName: '이도윤',
      orderStatus: '배송중',
      orderDate: '2025-10-27'
    },
    {
      id: 3,
      orderNumber: '1c699332-514',
      productInfo: '삼성 KQ85QC75AFXKR',
      totalAmount: '2,590,000원',
      orderAmount: '2,590,000원',
      buyerId: 'happy',
      buyerName: 'asdf',
      orderStatus: '배송완료',
      orderDate: '2025-10-27'
    },
    {
      id: 4,
      orderNumber: 'fe4d123f-6b8',
      productInfo: '삼성 KQ85QC75AFXKR',
      totalAmount: '2,590,000원',
      orderAmount: '2,590,000원',
      buyerId: 'admin',
      buyerName: '김민자',
      orderStatus: '결제완료',
      orderDate: '2025-10-27'
    },
    {
      id: 5,
      orderNumber: '079cf99f-14a',
      productInfo: '삼성 KQ85QC75AFXKR',
      totalAmount: '2,590,000원',
      orderAmount: '2,590,000원',
      buyerId: 'admin',
      buyerName: '김민자',
      orderStatus: '결제완료',
      orderDate: '2025-10-27'
    },
    {
      id: 6,
      orderNumber: '733ef173-bf5',
      productInfo: '삼성 KQ85QC75AFXKR',
      totalAmount: '2,590,000원',
      orderAmount: '2,590,000원',
      buyerId: 'admin',
      buyerName: '김민자',
      orderStatus: '결제완료',
      orderDate: '2025-10-27'
    },
    {
      id: 7,
      orderNumber: '93ba6840-7cf',
      productInfo: '삼성 KQ85QC75AFXKR',
      totalAmount: '2,590,000원',
      orderAmount: '23,310,000원',
      buyerId: 'admin',
      buyerName: '김민자',
      orderStatus: '결제완료',
      orderDate: '2025-10-27'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // API 호출하여 주문 목록 가져오기
    fetchOrders();
  }, [filterStatus, dateRange]);

  const fetchOrders = async () => {
    try {
      // 실제 API 호출 구현
      // const response = await adminService.getOrders({ 
      //   status: filterStatus,
      //   startDate: dateRange.startDate,
      //   endDate: dateRange.endDate
      // });
      // setOrders(response.data);
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 API 호출
    console.log('검색어:', searchTerm);
  };

  const handleStatusChange = (orderId, newStatus) => {
    // 주문 상태 변경 API 호출
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, orderStatus: newStatus } : order
    ));
  };

  const handleOrderDetail = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case '결제완료':
        return 'status-paid';
      case '배송준비':
        return 'status-preparing';
      case '배송중':
        return 'status-shipping';
      case '배송완료':
        return 'status-delivered';
      case '취소':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.includes(searchTerm) || 
                          order.buyerId.includes(searchTerm) ||
                          order.buyerName.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
              <option value="결제완료">결제완료</option>
              <option value="배송준비">배송준비</option>
              <option value="배송중">배송중</option>
              <option value="배송완료">배송완료</option>
              <option value="취소">취소</option>
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
                <th>주문번호</th>
                <th>상품명</th>
                <th>정상가격</th>
                <th>주문가격</th>
                <th>구매자 아이디</th>
                <th>구매자명</th>
                <th>주문상태</th>
                <th>주문일자</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} onClick={() => handleOrderDetail(order.id)}>
                  <td className="order-number">{order.orderNumber}</td>
                  <td className="product-info">{order.productInfo}</td>
                  <td className="price">{order.totalAmount}</td>
                  <td className="price">{order.orderAmount}</td>
                  <td>{order.buyerId}</td>
                  <td>{order.buyerName}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{order.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="no-data">
              <p>조회된 주문이 없습니다.</p>
            </div>
          )}
        </div>

        <div className="order-summary">
          <div className="summary-item">
            <span className="summary-label">총 주문 수:</span>
            <span className="summary-value">{filteredOrders.length}건</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">총 매출액:</span>
            <span className="summary-value">
              {filteredOrders.reduce((sum, order) => {
                const amount = parseInt(order.orderAmount.replace(/[^0-9]/g, ''));
                return sum + amount;
              }, 0).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
