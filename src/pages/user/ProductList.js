import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // 전체 데이터 저장
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 카테고리 또는 검색어 변경 시 데이터 다시 불러오기
  useEffect(() => {
    setCurrentPage(0); // 페이지 초기화
    fetchProducts();
  }, [category, keyword]);

  // 페이지 변경 시 현재 데이터에서 페이지네이션
  useEffect(() => {
    if (allProducts.length > 0) {
      paginateProducts();
    }
  }, [currentPage, allProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8080/user/product/api/all`;
      
      if (category) {
        url = `http://localhost:8080/user/product/api/category/${encodeURIComponent(category)}`;
      } else if (keyword) {
        url = `http://localhost:8080/user/product/api/search?keyword=${encodeURIComponent(keyword)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        const fetchedProducts = data.products || [];
        setAllProducts(fetchedProducts);
        setTotalElements(fetchedProducts.length);
        
        // 페이지네이션 계산
        const itemsPerPage = 12;
        setTotalPages(Math.ceil(fetchedProducts.length / itemsPerPage));
        
        // 첫 페이지 표시
        const paginatedProducts = fetchedProducts.slice(0, itemsPerPage);
        setProducts(paginatedProducts);
      } else {
        console.error('상품 로드 실패:', data.message);
        setAllProducts([]);
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('상품 로드 오류:', error);
      setAllProducts([]);
      setProducts([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const paginateProducts = () => {
    const itemsPerPage = 12;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    setProducts(paginatedProducts);
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() || '0';
  };

  // 이미지 URL 생성 함수
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.png';
    // 이미지 경로가 uploads/로 시작하면 백엔드 서버 URL 사용
    if (imagePath.startsWith('uploads/') || imagePath.startsWith('/uploads/')) {
      return `http://localhost:8080/${imagePath.replace(/^\//, '')}`;
    }
    // 그렇지 않으면 static 경로로 처리
    return imagePath;
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getPageTitle = () => {
    if (category) {
      return `${category} 카테고리`;
    } else if (keyword) {
      return `'${keyword}' 검색 결과`;
    }
    return '전체 상품';
  };

  return (
    <div className="product-list-page">
      <div className="product-list-container">
        {/* 헤더 */}
        <div className="product-list-header">
          <h1 className="product-list-title">{getPageTitle()}</h1>
          <p className="product-list-count">총 {totalElements}개의 상품</p>
        </div>

        {/* 로딩 */}
        {loading ? (
          <div className="loading-container">
            <p>상품을 불러오는 중...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-container">
            <p>상품이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 상품 그리드 */}
            <div className="product-grid">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={getImageUrl(product.thumbnailImage)}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-category">{product.category}</div>
                    <div className="product-prices">
                      <span className="original-price">
                        {formatPrice(product.price)}원
                      </span>
                      {product.salePrice && product.salePrice < product.price && (
                        <span className="sale-price">
                          {formatPrice(product.salePrice)}원
                        </span>
                      )}
                    </div>
                    {product.salePrice && product.price > product.salePrice && (
                      <div className="discount-rate">
                        {Math.round(((product.price - product.salePrice) / product.price) * 100)}% 할인
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                >
                  처음
                </button>
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  이전
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i)
                  .filter(page => {
                    return page === 0 || 
                           page === totalPages - 1 || 
                           (page >= currentPage - 2 && page <= currentPage + 2);
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="page-ellipsis">...</span>
                      )}
                      <button
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page + 1}
                      </button>
                    </React.Fragment>
                  ))}
                
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  다음
                </button>
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  마지막
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
