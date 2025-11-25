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

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compare.items);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
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
    if (!imagePath) return "/images/no-image.png";
    if (imagePath.startsWith("uploads/") || imagePath.startsWith("/uploads/")) {
      return `http://localhost:8080/${imagePath}`;
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
