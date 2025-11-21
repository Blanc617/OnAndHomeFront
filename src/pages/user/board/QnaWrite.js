import React from 'react';
import { useNavigate } from 'react-router-dom';

const QnaWrite = () => {
  const navigate = useNavigate();
  
  return (
    <div className="qna-write-container">
      <h2>Q&A 작성</h2>
      <p>Q&A 작성 페이지입니다. (개발 중)</p>
      <button onClick={() => navigate('/qna')}>목록으로</button>
    </div>
  );
};

export default QnaWrite;
