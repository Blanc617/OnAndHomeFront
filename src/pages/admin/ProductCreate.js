import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCreate = () => {
  const navigate = useNavigate();
  
  return (
    <div className="admin-product-create">
      <h2>상품 등록</h2>
      <p>상품 등록 페이지입니다. (개발 중)</p>
      <button onClick={() => navigate('/admin/products')}>목록으로</button>
    </div>
  );
};

export default ProductCreate;
