import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoticeWrite = () => {
  const navigate = useNavigate();
  
  return (
    <div className="admin-notice-write">
      <h2>공지사항 작성</h2>
      <p>공지사항 작성 페이지입니다. (개발 중)</p>
      <button onClick={() => navigate('/admin/notice')}>목록으로</button>
    </div>
  );
};

export default NoticeWrite;
