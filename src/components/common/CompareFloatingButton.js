import React, { useState } from "react";
import { useSelector } from "react-redux";
import CompareModal from "../compare/CompareModal";
import "./CompareFloatingButton.css";

const CompareFloatingButton = () => {
  const compareItems = useSelector((state) => state.compare.items);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 상품이 없으면 버튼 숨김
  if (compareItems.length === 0) return null;

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="compare-floating-btn" onClick={handleClick}>
        <div className="compare-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
          </svg>
        </div>
        <div className="compare-count">{compareItems.length}</div>
        <div className="compare-text">상품비교</div>
      </div>

      <CompareModal isOpen={isModalOpen} onClose={handleClose} />
    </>
  );
};

export default CompareFloatingButton;
