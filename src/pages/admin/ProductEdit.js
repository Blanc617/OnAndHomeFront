import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="admin-product-edit">
      <h2>상품 수정</h2>
      <p>상품 ID: {id}</p>
      <p>상품 수정 페이지입니다. (개발 중)</p>
      <button onClick={() => navigate('/admin/products')}>목록으로</button>
    </div>
  );
};

export default ProductEdit;
