import React, { useState, useEffect } from "react";
import { cartAPI } from "../../api";
import CartSidePanel from "./CartSidePanel";
import "./CartFloatingButton.css";

const CartFloatingButton = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // 장바구니 개수 로드
  const loadCartCount = async () => {
    try {
      const response = await cartAPI.getCartCount();
      if (response.success) {
        setCartCount(response.data || response.count || 0);  // data 또는 count 필드 확인
      }
    } catch (error) {
      console.error('장바구니 개수 조회 실패:', error);
    }
  };

  useEffect(() => {
    loadCartCount();
    
    // 5초마다 장바구니 개수 갱신
    const interval = setInterval(() => {
      loadCartCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsPanelOpen(true);
  };

  const handleClose = () => {
    setIsPanelOpen(false);
    loadCartCount(); // 패널 닫을 때 개수 갱신
  };

  return (
    <>
      <div className="cart-floating-btn" onClick={handleClick}>
        <div className="cart-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        {cartCount > 0 && (
          <div className="cart-count">{cartCount}</div>
        )}
        <div className="cart-text">장바구니</div>
      </div>

      <CartSidePanel 
        isOpen={isPanelOpen} 
        onClose={handleClose}
        onCartUpdate={loadCartCount}
      />
    </>
  );
};

export default CartFloatingButton;