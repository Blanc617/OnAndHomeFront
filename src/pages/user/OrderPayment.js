import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPayment.css';

const OrderPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // location.state에서 주문 정보 받기
  const { products, fromCart } = location.state || { products: [], fromCart: false };

  const [orderInfo, setOrderInfo] = useState({
    name: user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    detailAddress: '',
    request: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 인증 확인
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 상품 정보 확인
    if (!products || products.length === 0) {
      alert('주문할 상품이 없습니다.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, products, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalPrice = () => {
    return products.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const handlePayment = async () => {
    // 필수 입력 검증
    if (!orderInfo.address || orderInfo.address.trim() === '') {
      alert('주소를 입력해주세요.');
      return;
    }

    if (!orderInfo.name || !orderInfo.phone) {
      alert('이름과 연락처를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 주문 데이터 생성
      const orderData = {
        userId: user.id,
        orderItems: products.map(product => ({
          productId: product.id,
          quantity: product.quantity
        })),
        recipientName: orderInfo.name,
        recipientPhone: orderInfo.phone,
        shippingAddress: orderInfo.address + (orderInfo.detailAddress ? ` ${orderInfo.detailAddress}` : ''),
        shippingRequest: orderInfo.request
      };

      console.log('주문 데이터:', orderData);

      // 백엔드 API 호출
      const response = await fetch('http://localhost:8080/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log('API 응답:', result);

      if (result.success) {
        alert('결제가 완료되었습니다');
        
        // 결제 완료 페이지로 이동
        navigate('/user/order-complete', {
          state: {
            orderInfo: orderInfo,
            products: products,
            totalPrice: calculateTotalPrice(),
            orderId: result.data.orderId
          }
        });
      } else {
        alert(result.message || '주문 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('주문 생성 오류:', error);
      alert('주문 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price ? price.toLocaleString() + '원' : '0원';
  };

  if (loading) {
    return (
      <div className="order-payment-container">
        <div className="loading">처리 중...</div>
      </div>
    );
  }

  return (
    <div className="order-payment-container">
      <div className="order-payment-content">
        <h1>주문/결제</h1>

        {/* 배송정보 */}
        <section className="order-section">
          <h2>배송정보</h2>
          <table className="order-table">
            <tbody>
              <tr>
                <th>이름</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={orderInfo.name}
                    onChange={handleInputChange}
                    placeholder="받는분"
                    required
                  />
                </td>
                <th>ID</th>
                <td>
                  <input
                    type="text"
                    value={user?.userId || ''}
                    readOnly
                    className="readonly-input"
                  />
                </td>
              </tr>
              <tr>
                <th>연락처</th>
                <td>
                  <input
                    type="tel"
                    name="phone"
                    value={orderInfo.phone}
                    onChange={handleInputChange}
                    placeholder="010-1111-2222"
                    required
                  />
                </td>
                <th>e-mail</th>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={orderInfo.email}
                    onChange={handleInputChange}
                    placeholder="admin@a.com"
                  />
                </td>
              </tr>
              <tr>
                <th>주소 <span className="required">*</span></th>
                <td colSpan="3">
                  <input
                    type="text"
                    name="address"
                    value={orderInfo.address}
                    onChange={handleInputChange}
                    placeholder="주소를 입력하세요"
                    className="full-width"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th>요청사항</th>
                <td colSpan="3">
                  <input
                    type="text"
                    name="request"
                    value={orderInfo.request}
                    onChange={handleInputChange}
                    placeholder="배송 시 요청사항을 입력하세요"
                    className="full-width"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 주문정보 */}
        <section className="order-section">
          <h2>주문정보</h2>
          <table className="order-table">
            <thead>
              <tr>
                <th>주문번호</th>
                <th>주문상품 리스트</th>
                <th>상품명</th>
                <th>수량</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{new Date().getFullYear()}{String(new Date().getMonth() + 1).padStart(2, '0')}{String(new Date().getDate()).padStart(2, '0')}-{String(new Date().getHours()).padStart(2, '0')}{String(new Date().getMinutes()).padStart(2, '0')}{String(index + 1).padStart(2, '0')}</td>
                  <td></td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{formatPrice(product.salePrice || product.price)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="4" className="text-right"><strong>주문 금액</strong></td>
                <td><strong>{formatPrice(calculateTotalPrice())} 원</strong></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 결제하기 버튼 */}
        <div className="payment-button-container">
          <button
            className="payment-button"
            onClick={handlePayment}
            disabled={loading}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPayment;