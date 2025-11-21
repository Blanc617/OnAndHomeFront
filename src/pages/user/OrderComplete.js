import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderComplete.css';

const OrderComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const { orderInfo, products, totalPrice } = location.state || {};

  useEffect(() => {
    if (!orderInfo || !products || products.length === 0) {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  }, [orderInfo, products, navigate]);

  const formatPrice = (price) => {
    return price ? price.toLocaleString() + '원' : '0원';
  };

  const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
  };

  if (!orderInfo || !products) {
    return null;
  }

  return (
    <div className="order-complete-container">
      <div className="order-complete-content">
        <div className="complete-header">
          <div className="complete-icon">✓</div>
          <h1>주문이 완료되었습니다</h1>
          <p className="complete-message">
            주문해주셔서 감사합니다.<br />
            주문 내역은 마이페이지에서 확인하실 수 있습니다.
          </p>
        </div>

        <section className="order-section">
          <h2>주문 정보</h2>
          <table className="order-table">
            <tbody>
              <tr>
                <th>주문번호</th>
                <td>{generateOrderNumber()}</td>
              </tr>
              <tr>
                <th>주문일시</th>
                <td>{formatDate()}</td>
              </tr>
              <tr>
                <th>주문자</th>
                <td>{user?.username || orderInfo.name}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="order-section">
          <h2>배송 정보</h2>
          <table className="order-table">
            <tbody>
              <tr>
                <th>받는 분</th>
                <td>{orderInfo.name}</td>
              </tr>
              <tr>
                <th>연락처</th>
                <td>{orderInfo.phone}</td>
              </tr>
              {orderInfo.email && (
                <tr>
                  <th>이메일</th>
                  <td>{orderInfo.email}</td>
                </tr>
              )}
              <tr>
                <th>배송지</th>
                <td>
                  {orderInfo.address}
                  {orderInfo.detailAddress && ` ${orderInfo.detailAddress}`}
                </td>
              </tr>
              {orderInfo.request && (
                <tr>
                  <th>배송 요청사항</th>
                  <td>{orderInfo.request}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="order-section">
          <h2>주문 상품</h2>
          <table className="order-table product-table">
            <thead>
              <tr>
                <th>상품명</th>
                <th>수량</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="product-name">{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{formatPrice((product.salePrice || product.price) * product.quantity)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="2" className="text-right"><strong>총 결제금액</strong></td>
                <td><strong>{formatPrice(totalPrice)}</strong></td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="button-container">
          <button
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            쇼핑 계속하기
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate('/user/my-orders')}
          >
            주문 내역 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;