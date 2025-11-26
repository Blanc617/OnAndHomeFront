import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { productAPI, cartAPI, reviewAPI, qnaAPI, favoriteAPI } from '../../api';
import ReviewItem from '../../components/review/ReviewItem';
import QnaItem from '../../components/qna/QnaItem';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [qnas, setQnas] = useState([]);
  const [reviewContent, setReviewContent] = useState("");
  const [qnaTitle, setQnaTitle] = useState("");
  const [qnaContent, setQnaContent] = useState("");

  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [qnaTitle, setQnaTitle] = useState('');
  const [qnaContent, setQnaContent] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadProductDetail();
    checkInitialFavoriteStatus();
  }, [id]);


  // 초기 찜 상태 확인
  const checkInitialFavoriteStatus = async () => {
    try {
      const result = await favoriteAPI.check(id);
      if (result.success) {
        setIsFavorite(result.isFavorite);
      }
    } catch (error) {
      console.error('찜 상태 확인 오류:', error);
      // 에러 시 기본값 false 유지
    }
  };

  useEffect(() => {
    if (product) {
      loadReviews();
      loadQnas();
    }
  }, [product]);

  const loadProductDetail = async () => {
    try {
      const response = await productAPI.getProductDetail(id);
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        alert("상품을 찾을 수 없습니다.");
        navigate("/products");
      }
    } catch (error) {
      console.error("상품 조회 오류:", error);
      alert("상품 정보를 불러올 수 없습니다.");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };
  
  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getProductReviews(id);
      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("리뷰 조회 오류:", error);
    }
  };
  
  const loadQnas = async () => {
    try {
      const response = await qnaAPI.getProductQnas(id);
      if (response.success && response.data) {
        setQnas(response.data);
      }
    } catch (error) {
      console.error("QnA 조회 오류:", error);
    }
  };
  
  const formatPrice = (price) => {
    if (!price) return "0원";
    return `${price.toLocaleString()}원`;
  };
  
  const getImageUrl = (imagePath) => {
    console.log("원본 imagePath:", imagePath);

    if (!imagePath) return "/images/no-image.png";

    // uploads/ 경로면 백엔드 서버에서 가져오기
    if (imagePath.startsWith("uploads/") || imagePath.startsWith("/uploads/")) {
      return `http://localhost:8080${
        imagePath.startsWith("/") ? "" : "/"
      }${imagePath}`;
    }

    // 짧은 이름이면 public/product_img/ 폴더에서 가져오기
    if (!imagePath.includes("/") && !imagePath.startsWith("http")) {
      return `/product_img/${imagePath}.jpg`;
    }

    return imagePath;
  };
  
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity <= 1) {
      alert("최소 주문 수량은 1개입니다.");
      return;
    }
    setQuantity((prev) => prev - 1);
  };
  
  const getTotalPrice = () => {
    if (!product) return 0;
    const pricePerUnit =
      product.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product.price;
    return pricePerUnit * quantity;
  };
  
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    
    const productInfo = {
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      quantity: quantity,
      thumbnailImage: product.thumbnailImage,
    };

    navigate("/user/order-payment", {
      state: {
        products: [productInfo],
        fromCart: false,
      },
    });
  };
  
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    
    try {
      const response = await cartAPI.addToCart(product.id, quantity);
      if (response.success) {
        if (
          window.confirm(
            "상품이 장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?"
          )
        ) {
          navigate("/cart");
        }
      } else {
        alert(response.message || "장바구니 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      alert("장바구니에 상품을 추가하는 중 오류가 발생했습니다.");
    }
  };

  // 찜하기 토글
  const handleFavoriteToggle = async () => {
    try {
      const result = await favoriteAPI.toggle(product.id);

      if (result.success) {
        setIsFavorite(result.isFavorite);
      }
    } catch (error) {
      console.error('찜하기 오류:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    
    if (!reviewContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }
    
    try {
      const response = await reviewAPI.createReview({
        productId: product.id,
        content: reviewContent,
        rating: 5,
        userId: user.id,
      });
      
      if (response.success) {
        alert("리뷰가 등록되었습니다.");
        setReviewContent("");
        alert('리뷰가 등록되었습니다.');
        setReviewContent('');
        setReviewRating(5);
        loadReviews();
      } else {
        alert(response.message || "리뷰 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 작성 오류:", error);
      alert("리뷰 작성 중 오류가 발생했습니다.");
    }
  };
  
  const handleSubmitQna = async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    
    if (!qnaTitle.trim()) {
      alert("문의 제목을 입력해주세요.");
      return;
    }
    
    if (!qnaContent.trim()) {
      alert("문의 내용을 입력해주세요.");
      return;
    }
    
    try {
      const response = await qnaAPI.createQna({
        productId: product.id,
        title: qnaTitle,
        question: qnaContent,
        userId: user.id,
        writer: user.username || user.userId,
      });
      
      if (response.success) {
        alert("문의가 등록되었습니다.");
        setQnaTitle("");
        setQnaContent("");
        loadQnas();
      } else {
        alert(response.message || "문의 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("QnA 작성 오류:", error);
      alert("문의 작성 중 오류가 발생했습니다.");
    }
  };

  const handleEditReview = async (reviewId, data) => {
    try {
      const response = await reviewAPI.updateReview(reviewId, data);
      if (response.success) {
        alert("리뷰가 수정되었습니다.");
        loadReviews();
      } else {
        alert(response.message || "리뷰 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 수정 오류:", error);
      alert("리뷰 수정에 실패했습니다.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await reviewAPI.deleteReview(reviewId);
      if (response.success) {
        alert("리뷰가 삭제되었습니다.");
        loadReviews();
      } else {
        alert(response.message || "리뷰 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 삭제 오류:", error);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  const handleEditQna = async (qnaId, data) => {
    try {
      const response = await qnaAPI.updateQna(qnaId, data);
      if (response.success) {
        alert("문의가 수정되었습니다.");
        loadQnas();
      } else {
        alert(response.message || "문의 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("QnA 수정 오류:", error);
      alert("문의 수정에 실패했습니다.");
    }
  };

  const handleDeleteQna = async (qnaId) => {
    try {
      const response = await qnaAPI.deleteQna(qnaId);
      if (response.success) {
        alert("문의가 삭제되었습니다.");
        loadQnas();
      } else {
        alert(response.message || "문의 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("QnA 삭제 오류:", error);
      alert("문의 삭제에 실패했습니다.");
    }
  };
  
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!product) {
    return <div className="loading">상품을 찾을 수 없습니다.</div>;
  }
  
  return (
    <div className="product-detail-container">
      <div className="product-detail-inner">
        <h2 className="page-title">상품 상세정보</h2>
        
        <div className="product-info-section">
          <div className="product-image-wrapper">
            <img
              src={getImageUrl(product.thumbnailImage)}
              alt={product.name}
              className="product-main-image"
              onError={(e) => {
                e.target.src = "/images/item.png";
                e.target.onerror = null;
              }}
            />
          </div>
          
          <div className="product-info-wrapper">
            <h2 className="product-title">{product.name}</h2>
            
            <table className="product-info-table">
              <tbody>
                <tr>
                  <th>정상가격</th>
                  <td className="price-original">
                    {formatPrice(product.price)}
                  </td>
                </tr>
                {product.salePrice && product.salePrice < product.price && (
                  <tr>
                    <th>할인가격</th>
                    <td className="price-sale">
                      {formatPrice(product.salePrice)}
                    </td>
                  </tr>
                )}
                <tr>
                  <th>제조사</th>
                  <td>{product.manufacturer || "-"}</td>
                </tr>
                <tr>
                  <th>제조국</th>
                  <td>{product.country || "-"}</td>
                </tr>
                <tr>
                  <th>배송비</th>
                  <td>무료</td>
                </tr>
                <tr>
                  <th>판매처</th>
                  <td>On&Home</td>
                </tr>
              </tbody>
            </table>
            
            <div className="action-buttons">
              <button className="btn btn-favorite" onClick={handleFavoriteToggle}>
                {isFavorite ? '❤️' : '🤍'}
              </button>
              <button className="btn btn-buy" onClick={handleBuyNow}>
                바로구매
              </button>
              <button className="btn btn-cart" onClick={handleAddToCart}>
                장바구니 담기
              </button>
            </div>
            
            <div className="order-summary">
              <div className="quantity-control">
                <span>주문수량</span>
                <button className="btn-quantity" onClick={decreaseQuantity}>
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button className="btn-quantity" onClick={increaseQuantity}>
                  +
                </button>
              </div>
              <div className="total-price-wrapper">
                <span>합계금액</span>
                <span className="total-price">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {product.detailImage && (
          <div className="product-detail-image-section">
            <img
              src={getImageUrl(product.detailImage)}
              alt="상세 이미지"
              className="product-detail-image"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="review-section">
          <h2 className="section-title">Review</h2>
          <div className="review-list">
            {reviews.length === 0 ? (
              <div className="empty-message">등록된 리뷰가 없습니다.</div>
            ) : (
              reviews.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))
            )}
          </div>
          {isAuthenticated && (
            <div className="review-write-form">
              <div className="form-header">
                <h3>리뷰 작성</h3>
              </div>
              <div className="rating-selector">
                <label>평점</label>
                <select
                  className="rating-select"
                  value={reviewRating || 5}
                  onChange={(e) => setReviewRating(parseInt(e.target.value))}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
                  <option value="4">⭐⭐⭐⭐ (4점)</option>
                  <option value="3">⭐⭐⭐ (3점)</option>
                  <option value="2">⭐⭐ (2점)</option>
                  <option value="1">⭐ (1점)</option>
                </select>
              </div>
              <textarea
                className="review-textarea"
                placeholder="상품에 대한 리뷰를 작성해주세요."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows="5"
              />
              <div className="form-actions">
                <button className="btn btn-submit" onClick={handleSubmitReview}>
                  리뷰 등록
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="qna-section">
          <h2 className="section-title">Q&A</h2>
          <div className="qna-list">
            {qnas.length === 0 ? (
              <div className="empty-message">등록된 문의가 없습니다.</div>
            ) : (
              qnas.map((qna) => (
                <QnaItem
                  key={qna.id}
                  qna={qna}
                  onEdit={handleEditQna}
                  onDelete={handleDeleteQna}
                />
              ))
            )}
          </div>
          {isAuthenticated && (
            <div className="qna-write-form">
              <div className="form-header">
                <h3>문의 작성</h3>
              </div>
              <div className="input-group">
                <label>제목</label>
                <input
                  type="text"
                  className="qna-title-input"
                  placeholder="문의 제목을 입력해주세요"
                  value={qnaTitle}
                  onChange={(e) => setQnaTitle(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>내용</label>
                <textarea
                  className="qna-textarea"
                  placeholder="상품에 대한 문의 내용을 입력해주세요."
                  value={qnaContent}
                  onChange={(e) => setQnaContent(e.target.value)}
                  rows="5"
                />
              </div>
              <div className="form-actions">
                <button className="btn btn-submit" onClick={handleSubmitQna}>
                  문의 등록
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
