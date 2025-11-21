import React from 'react';
import { useParams } from 'react-router-dom';

const NoticeDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="notice-detail-container">
      <h2>공지사항 상세</h2>
      <p>공지사항 ID: {id}</p>
      <p>공지사항 상세 페이지입니다. (개발 중)</p>
    </div>
  );
};

export default NoticeDetail;
