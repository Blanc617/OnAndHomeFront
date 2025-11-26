import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [allOrders, setAllOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // 페이지가 변경될 때마다 표시할 주문 업데이트
    if (allOrders.length > 0) {
      updateDisplayOrders();
    }
  }, [currentPage, allOrders]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('주문 내역 조회 시작...');
      console.log('User ID:', user?.id);
      console.log('API URL:', `${API_BASE_URL}/api/orders/user/${user?.id}`);

      const response = await axios.get(
        `${API_BASE_URL}/api/orders/user/${user?.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API 응답:', response.data);

      // 백엔드 응답 구조: {success: true, data: [...], count: 3}
      const orders = response.data.data || [];
      
      // 날짜순으로 정렬 (최신순)
      const sortedOrders = orders.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAllOrders(sortedOrders);
      
      // 전체 페이지 수 계산
      const pages = Math.ceil(sortedOrders.length / itemsPerPage);
      setTotalPages(pages);
      
      console.log('총 주문 수:', sortedOrders.length);
      console.log('총 페이지 수:', pages);

    } catch (error) {
      console.error('주문 내역 조회 실패:', error);
      console.error('에러 상세:', error.response?.data);
      
      setError(error.response?.data?.message || '주문 내역을 불러오는데 실패했습니다.');
      
      if (error.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else if (error.response?.status === 404) {
        // 404는 주문이 없는 경우일 수 있음
        console.log('주문 내역이 없습니다.');
        setAllOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayOrders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = allOrders.slice(startIndex, endIndex);
    setDisplayOrders(paginatedOrders);
    
    console.log(`페이지 ${currentPage}: ${startIndex}~${endIndex-1} 표시`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch (error) {
      console.error('날짜 형식 변환 오류:', error);
      return '-';
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0원';
    return price.toLocaleString() + '원';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PAYMENT_PENDING': '입금대기',
      'ORDERED': '결제완료',
      'PENDING': '결제대기',
      'PAID': '결제완료',
      'PREPARING': '상품준비중',
      'SHIPPING': '배송중',
      'DELIVERING': '배송중',
      'DELIVERED': '배송완료',
      'CANCELLED': '주문취소',
      'CANCELED': '주문취소',
      'CONFIRMED': '주문확인'
    };
    return statusMap[status] || status || '상태없음';
  };

  const getStatusClass = (status) => {
    const classMap = {
      'PAYMENT_PENDING': 'status-pending',
      'ORDERED': 'status-paid',
      'PENDING': 'status-pending',
      'PAID': 'status-paid',
      'PREPARING': 'status-preparing',
      'SHIPPING': 'status-shipping',
      'DELIVERING': 'status-shipping',
      'DELIVERED': 'status-delivered',
      'CANCELLED': 'status-cancelled',
      'CANCELED': 'status-cancelled',
      'CONFIRMED': 'status-paid'
    };
    return classMap[status] || 'status-pending';
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHideOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`주문번호 ${orderNumber}를 숨김 처리하시겠습니까?\n\n숨긴 주문은 목록에서 표시되지 않습니다.`)) {
      return;
    }

    try {
      console.log('주문 숨김 요청:', orderId);
      const response = await axios.post(
        `${API_BASE_URL}/api/orders/${orderId}/hide`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('주문이 숨검지되었습니다.');
        fetchOrders(); // 목록 새로고침
      } else {
        alert(response.data.message || '주문 숨김에 실패했습니다.');
      }
    } catch (error) {
      console.error('주문 숨김 실패:', error);
      alert('주문 숨김 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="my-orders-container">
        <div className="loading">주문 내역을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-button">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="my-orders-content">
        <h1>주문 내역</h1>

        {allOrders.length === 0 ? (
          <div className="empty-orders">
            <p>주문 내역이 없습니다.</p>
            <button onClick={() => navigate('/products')} className="go-shopping-btn">
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <>
            <div className="orders-summary">
              총 {allOrders.length}개의 주문
            </div>

            <div className="orders-list">
              {displayOrders.map((order) => (
                <div key={order.orderId} className="order-card">
                  <div className="order-header">
                    <div className="order-date">
                      <span className="label">주문일자:</span>
                      <span className="value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-number">
                      <span className="label">주문번호:</span>
                      <span className="value">{order.orderNumber || order.orderId}</span>
                    </div>
                    <div className={`order-status ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                    <button 
                      className="hide-order-btn"
                      onClick={() => handleHideOrder(order.orderId, order.orderNumber || order.orderId)}
                      title="주문 숨김"
                    >
                      🚫 숨김
                    </button>
                  </div>

                  <div className="order-body">
                    <div className="order-items">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <>
                          <div className="order-item-main">
                            <span className="item-name">{order.orderItems[0].productName || '상품명 없음'}</span>
                            <span className="item-quantity">수량: {order.orderItems[0].quantity || 1}개</span>
                          </div>
                          {order.orderItems.length > 1 && (
                            <div className="order-item-more">
                              외 {order.orderItems.length - 1}건
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="order-item-main">주문 상품 정보 없음</div>
                      )}
                    </div>

                    <div className="order-info">
                      <div className="info-row">
                        <span className="info-label">받는 분:</span>
                        <span className="info-value">{order.recipientName || order.username || '-'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">연락처:</span>
                        <span className="info-value">{order.recipientPhone || order.userPhone || '-'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">배송지:</span>
                        <span className="info-value">{order.shippingAddress || order.userAddress || '-'}</span>
                      </div>
                      {order.shippingRequest && (
                        <div className="info-row">
                          <span className="info-label">배송 요청사항:</span>
                          <span className="info-value">{order.shippingRequest}</span>
                        </div>
                      )}
                    </div>

                    {/* 입금 대기 상태일 때 계좌 정보 표시 */}
                    {order.status === 'PAYMENT_PENDING' && (
                      <div className="bank-info-section">
                        <h3 className="bank-info-title">⚠️ 입금 계좌 정보</h3>
                        <div className="bank-info-content">
                          <div className="bank-detail">
                            <span className="bank-label">은행:</span>
                            <span className="bank-value">국민은행</span>
                          </div>
                          <div className="bank-detail">
                            <span className="bank-label">계좌번호:</span>
                            <span className="bank-value">123-456-789012</span>
                          </div>
                          <div className="bank-detail">
                            <span className="bank-label">예금주:</span>
                            <span className="bank-value">(주)온앤홈</span>
                          </div>
                          <div className="bank-detail highlight">
                            <span className="bank-label">입금금액:</span>
                            <span className="bank-value amount">{formatPrice(order.totalPrice)}</span>
                          </div>
                        </div>
                        <div className="bank-notice">
                          <p>• 입금자명은 주문자명({order.recipientName || order.username})과 동일하게 입력해주세요.</p>
                          <p>• 입금 확인 후 배송이 시작됩니다.</p>
                        </div>
                      </div>
                    )}

                    <div className="order-total">
                      <span className="total-label">총 결제금액</span>
                      <span className="total-amount">{formatPrice(order.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이징 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-button"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  처음
                </button>
                <button
                  className="page-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </button>

                {generatePageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  className="page-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
                <button
                  className="page-button"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  마지막
                </button>
              </div>
            )}

            <div className="page-info">
              {currentPage} / {totalPages} 페이지
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;