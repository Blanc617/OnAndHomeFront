import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
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
    request: '',
    paymentMethod: 'CARD' // 기본값: 카드 결제
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ 추가

  useEffect(() => {
    // 인증 확인
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 상품 정보 확인
    if (!products || products.length === 0) {
      toast.error('주문할 상품이 없습니다.');
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
      toast.error('주소를 입력해주세요.');
      return;
    }

    if (!orderInfo.name || !orderInfo.phone) {
      toast.error('이름과 연락처를 입력해주세요.');
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
        paymentMethod: orderInfo.paymentMethod,
        recipientName: orderInfo.name,
        recipientPhone: orderInfo.phone,
        shippingAddress: orderInfo.address + (orderInfo.detailAddress ? ` ${orderInfo.detailAddress}` : ''),
        shippingRequest: orderInfo.request
      };

      console.log('=== 주문 데이터 확인 ===');
      console.log('User ID:', user.id);
      console.log('Payment Method:', orderInfo.paymentMethod);
      console.log('Recipient Name:', orderInfo.name);
      console.log('Products:', products);
      console.log('전체 주문 데이터:', JSON.stringify(orderData, null, 2));

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
        // ✅ 로딩 끄고 성공 화면 표시
        setLoading(false);
        setShowSuccess(true);
        
        // ✅ 1.3초 후 주문 완료 페이지로 이동
        setTimeout(() => {
          navigate('/user/order-complete', {
            state: {
              orderInfo: orderInfo,
              products: products,
              totalPrice: calculateTotalPrice(),
              orderId: result.data.orderId
            }
          });
        }, 1300);
      } else {
        console.error('주문 실패:', result.message);
        toast.error(result.message || '주문 생성에 실패했습니다.');
        setLoading(false);
      }
    } catch (error) {
      console.error('=== 주문 생성 오류 ===');
      console.error('오류 내용:', error);
      console.error('응답 데이터:', error.response?.data);
      console.error('응답 상태:', error.response?.status);
      
      let errorMessage = '주문 생성 중 오류가 발생했습니다.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage += ' (' + error.message + ')';
      }
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price ? price.toLocaleString() + '원' : '0원';
  };

  // ✅ 로딩 화면
  if (loading) {
    return (
      <div className="order-payment-container">
        <div className="loading">처리 중...</div>
      </div>
    );
  }

  // ✅ 결제 완료 화면 (2초간 표시)
  if (showSuccess) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          ✅
        </div>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#4ade80'
        }}>
          {orderInfo.paymentMethod === 'BANK_TRANSFER' ? '주문 완료!' : '결제 완료!'}
        </div>
        {orderInfo.paymentMethod === 'BANK_TRANSFER' && (
          <div style={{
            fontSize: '16px',
            color: '#666',
            marginTop: '10px'
          }}>
            입금 확인 후 배송이 시작됩니다
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="order-payment-container">
      {/* Toaster 컴포넌트 */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '16px',
            padding: '16px',
          },
          success: {
            style: {
              background: '#4ade80',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />

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

        {/* 결제 방법 선택 */}
        <section className="order-section">
          <h2>결제 방법</h2>
          <div className="payment-method-container">
            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={orderInfo.paymentMethod === 'CARD'}
                onChange={handleInputChange}
              />
              <span>카드 결제</span>
            </label>
            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="BANK_TRANSFER"
                checked={orderInfo.paymentMethod === 'BANK_TRANSFER'}
                onChange={handleInputChange}
              />
              <span>무통장 입금</span>
            </label>
          </div>
          
          {/* 무통장 입금 선택 시 계좌 정보 표시 */}
          {orderInfo.paymentMethod === 'BANK_TRANSFER' && (
            <div className="bank-info-container">
              <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#333' }}>입금 계좌 정보</h3>
              <div className="bank-info">
                <p><strong>은행:</strong> 국민은행</p>
                <p><strong>계좌번호:</strong> 123-456-789012</p>
                <p><strong>예금주:</strong> (주)온앤홈</p>
                <p><strong>입금금액:</strong> {formatPrice(calculateTotalPrice())}</p>
              </div>
              <div className="bank-notice">
                <p>⚠️ 입금자명은 주문자명과 동일하게 입력해주세요.</p>
                <p>⚠️ 입금 확인 후 주문이 확정됩니다.</p>
              </div>
            </div>
          )}
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
            {orderInfo.paymentMethod === 'BANK_TRANSFER' ? '주문하기 (입금 대기)' : '결제하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPayment;
