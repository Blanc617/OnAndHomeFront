import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../api';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      // 사용자용 전체 상품 API 호출
      const response = await productAPI.getAllProductsForUser();
      if (response.success && response.products) {
        // 최대 8개 상품만 표시
        setProducts(response.products.slice(0, 8));
      }
    } catch (error) {
      console.error('상품 조회 오류:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    if (!price) return '0원';
    return `${price.toLocaleString()}원`;
  };
  
  // 이미지 URL 생성 함수
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/no-image.png';
    // 이미지 경로가 uploads/로 시작하면 백엔드 서버 URL 사용
    if (imagePath.startsWith('uploads/') || imagePath.startsWith('/uploads/')) {
      return `http://localhost:8080/${imagePath}`;
    }
    // 그렇지 않으면 static 경로로 처리
    return imagePath;
  };
  
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-slider">
          <div className="slide">
            <img 
              src="/product_img/slide_01.jpg" 
              alt="메인 배너"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </section>
      
      <section className="product-section">
        <h2 className="section-title">추천 상품</h2>
        
        {products.length === 0 ? (
          <div className="loading">등록된 상품이 없습니다.</div>
        ) : (
          <>
            <div className="product-grid">
              {products.map(product => (
                <Link 
                  to={`/products/${product.id}`} 
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-image">
                    <img 
                      src={getImageUrl(product.thumbnailImage)} 
                      alt={product.name}
                      onError={(e) => { 
                        e.target.src = '/images/item.png';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="section-footer">
              <Link to="/products" className="btn-more">
                전체 상품 보기
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
