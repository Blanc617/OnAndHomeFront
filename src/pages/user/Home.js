import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  addToCompare,
  removeFromCompare,
} from "../../store/slices/compareSlice";

import { Link } from "react-router-dom";
import { productAPI } from "../../api";
import "./Home.css";

const SEARCH_PLACEHOLDER =
  "상품명 또는 카테고리를 검색해 보세요 (예: TV, 냉장고)";

// 모달별로 개별 localStorage 키 사용
const POPUP_MODAL1_KEY = "homePopupHideUntil1";
const POPUP_MODAL2_KEY = "homePopupHideUntil2";
const POPUP_MODAL3_KEY = "homePopupHideUntil3";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compare.items);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);

  // 홈 상단 검색어
  const [searchKeyword, setSearchKeyword] = useState("");
  const [homePlaceholder, setHomePlaceholder] = useState(SEARCH_PLACEHOLDER);

  useEffect(() => {
    fetchProducts();

    const todayStr = new Date().toISOString().slice(0, 10);
    const hide1 = localStorage.getItem(POPUP_MODAL1_KEY);
    const hide2 = localStorage.getItem(POPUP_MODAL2_KEY);
    const hide3 = localStorage.getItem(POPUP_MODAL3_KEY);

    // 세 모달 모두 오늘 숨기기로 되어 있으면 아무 것도 띄우지 않음
    if (hide1 === todayStr && hide2 === todayStr && hide3 === todayStr) {
      return;
    }

    const timer = setTimeout(() => {
      // 숨기기 설정이 안 된 첫 번째 모달부터 보여줌
      if (hide1 !== todayStr) {
        setIsModal1Open(true);
      } else if (hide2 !== todayStr) {
        setIsModal2Open(true);
      } else if (hide3 !== todayStr) {
        setIsModal3Open(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProductsForUser();
      if (response.success && response.products) {
        setProducts(response.products.slice(0, 8));
      }
    } catch (error) {
      console.error("상품 조회 오류:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    return price.toLocaleString();
  };

  const getImageUrl = (imagePath) => {
    console.log("원본 imagePath:", imagePath);

    if (!imagePath) return "/images/no-image.png";

    if (imagePath.startsWith("uploads/") || imagePath.startsWith("/uploads/")) {
      return `http://localhost:8080${
        imagePath.startsWith("/") ? "" : "/"
      }${imagePath}`;
    }

    if (!imagePath.includes("/") && !imagePath.startsWith("http")) {
      return `/product_img/${imagePath}.jpg`;
    }

    return imagePath;
  };

  const handleCompareToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const isInCompare = compareItems.some((item) => item.id === product.id);

    if (isInCompare) {
      dispatch(removeFromCompare(product.id));
    } else {
      if (compareItems.length >= 4) {
        alert("최대 4개 상품까지 비교할 수 있습니다.");
        return;
      }

      const compareProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        image: product.thumbnailImage,
      };

      dispatch(addToCompare(compareProduct));
    }
  };

  // ===== 검색창 제출 핸들러 =====
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchKeyword.trim();
    if (!trimmed) return;

    // 키워드 검색 페이지로 이동
    navigate(`/products?keyword=${encodeURIComponent(trimmed)}`);
  };

  // 모달 닫기(단순 닫기) 핸들러
  const handleCloseModal1 = () => {
    setIsModal1Open(false);

    const todayStr = new Date().toISOString().slice(0, 10);
    const hide2 = localStorage.getItem(POPUP_MODAL2_KEY);

    // 2번이 오늘 숨김이 아니면 이어서 2번 모달 표시
    if (hide2 !== todayStr) {
      setIsModal2Open(true);
    }
  };

  const handleCloseModal2 = () => {
    setIsModal2Open(false);

    const todayStr = new Date().toISOString().slice(0, 10);
    const hide3 = localStorage.getItem(POPUP_MODAL3_KEY);

    if (hide3 !== todayStr) {
      setIsModal3Open(true);
    }
  };

  const handleCloseModal3 = () => {
    setIsModal3Open(false);
  };

  // 모달별 "오늘 하루 보지 않기" 핸들러
  const handleHideTodayModal1 = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem(POPUP_MODAL1_KEY, todayStr);
    setIsModal1Open(false);

    const hide2 = localStorage.getItem(POPUP_MODAL2_KEY);
    if (hide2 !== todayStr) {
      setIsModal2Open(true);
    }
  };

  const handleHideTodayModal2 = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem(POPUP_MODAL2_KEY, todayStr);
    setIsModal2Open(false);

    const hide3 = localStorage.getItem(POPUP_MODAL3_KEY);
    if (hide3 !== todayStr) {
      setIsModal3Open(true);
    }
  };

  const handleHideTodayModal3 = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem(POPUP_MODAL3_KEY, todayStr);
    setIsModal3Open(false);
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="home-container">
      {/* ===== 검색 영역 ===== */}
      <section className="home-search-section">
        <form className="home-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="home-search-input"
            placeholder={homePlaceholder}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onFocus={() => setHomePlaceholder("")}
            onBlur={() => setHomePlaceholder(SEARCH_PLACEHOLDER)}
          />
          <button type="submit" className="home-search-button">
            검색
          </button>
        </form>
      </section>

      {/* 1. 모달 1 */}
      {isModal1Open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">첫 번째 혜택</h4>
              <button
                className="modal-close-btn"
                onClick={handleCloseModal1}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className="modal-divider" />

            <div className="modal-body">
              <div className="modal-main-title">
                <span className="modal-emoji">🎁</span>
                <span className="modal-main-text">첫 번째 특별 혜택!</span>
              </div>
              <p className="modal-sub-text">
                전 상품 10% 할인 쿠폰을 드립니다!
              </p>
              <button className="modal-main-btn" onClick={handleCloseModal1}>
                다음 혜택 보기
              </button>
            </div>

            <div className="modal-footer">
              <button className="modal-sub-btn" onClick={handleHideTodayModal1}>
                오늘 하루 보지 않기
              </button>
              <button className="modal-sub-btn" onClick={handleCloseModal1}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 모달 2 */}
      {isModal2Open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">두 번째 혜택</h4>
              <button
                className="modal-close-btn"
                onClick={handleCloseModal2}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className="modal-divider" />

            <div className="modal-body">
              <div className="modal-main-title">
                <span className="modal-emoji">🚀</span>
                <span className="modal-main-text">
                  지금 가입하면 추가 5,000원 적립!
                </span>
              </div>
              <p className="modal-sub-text">
                오늘의 핫딜 상품을 놓치지 마세요.
              </p>
              <button className="modal-main-btn" onClick={handleCloseModal2}>
                다음 광고 보기
              </button>
            </div>

            <div className="modal-footer">
              <button className="modal-sub-btn" onClick={handleHideTodayModal2}>
                오늘 하루 보지 않기
              </button>
              <button className="modal-sub-btn" onClick={handleCloseModal2}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 모달 3 */}
      {isModal3Open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">세 번째 혜택</h4>
              <button
                className="modal-close-btn"
                onClick={handleCloseModal3}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className="modal-divider" />

            <div className="modal-body">
              <div className="modal-main-title">
                <span className="modal-emoji">📣</span>
                <span className="modal-main-text">신규 입점 브랜드!</span>
              </div>
              <p className="modal-sub-text">
                오늘의 추천 상품 목록을 확인해보세요.
              </p>
              <button className="modal-main-btn" onClick={handleCloseModal3}>
                메인 페이지로 돌아가기
              </button>
            </div>

            <div className="modal-footer">
              <button className="modal-sub-btn" onClick={handleHideTodayModal3}>
                오늘 하루 보지 않기
              </button>
              <button className="modal-sub-btn" onClick={handleCloseModal3}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메인 배너 + 추천상품 */}
      <section className="hero-section">
        <div className="hero-slider">
          <div className="slide">
            <img
              src="/product_img/slide_01.jpg"
              alt="메인 배너"
              onError={(e) => {
                e.target.style.display = "none";
              }}
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
              {products.map((product) => {
                const isInCompare = compareItems.some(
                  (item) => item.id === product.id
                );

                return (
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
                          e.target.src = "/images/item.png";
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>

                      <div className="product-prices">
                        {product.salePrice &&
                        product.salePrice < product.price ? (
                          <>
                            <span className="original-price">
                              {formatPrice(product.price)}원
                            </span>
                            <div className="price-row">
                              <span className="sale-price">
                                {formatPrice(product.salePrice)}원
                              </span>
                              <div className="discount-rate">
                                {Math.round(
                                  ((product.price - product.salePrice) /
                                    product.price) *
                                    100
                                )}
                                % 할인
                              </div>
                            </div>
                          </>
                        ) : (
                          <span className="sale-price">
                            {formatPrice(product.price)}원
                          </span>
                        )}
                      </div>

                      <button
                        className={`compare-btn-bottom ${
                          isInCompare ? "active" : ""
                        }`}
                        onClick={(e) => handleCompareToggle(e, product)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          {isInCompare ? (
                            <path d="M9 12l2 2 4-4" />
                          ) : (
                            <path d="M12 8v8M8 12h8" />
                          )}
                        </svg>
                        <span>{isInCompare ? "비교중" : "비교하기"}</span>
                      </button>
                    </div>
                  </Link>
                );
              })}
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
