import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './QnaItem.css';

const QnaItem = ({ qna, onEdit, onDelete }) => {
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(qna.title || '상품 문의');
  const [editedQuestion, setEditedQuestion] = useState(qna.question);

  // 디버깅 로그
  useEffect(() => {
    console.log('=== QnaItem 디버깅 ===');
    console.log('QnA 데이터:', qna);
    console.log('로그인 사용자:', user);
    console.log('QnA 작성자:', qna.writer);
    console.log('사용자 ID:', user?.userId);
    console.log('사용자 이름:', user?.username);
    console.log('isAuthor 조건:');
    console.log('  - qna.writer === user.userId:', qna.writer === user?.userId);
    console.log('  - qna.writer === user.username:', qna.writer === user?.username);
  }, [qna, user]);

  // 현재 로그인한 사용자가 작성자인지 확인
  const isAuthor = user && (
    qna.writer === user.userId ||
    qna.writer === user.username
  );

  console.log('isAuthor 결과:', isAuthor);

  const handleEdit = () => {
    console.log('수정 버튼 클릭');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    console.log('취소 버튼 클릭');
    setIsEditing(false);
    setEditedTitle(qna.title || '상품 문의');
    setEditedQuestion(qna.question);
  };

  const handleSaveEdit = async () => {
    console.log('저장 버튼 클릭');
    console.log('수정할 데이터:', { title: editedTitle, question: editedQuestion });
    
    if (!editedQuestion.trim()) {
      alert('문의 내용을 입력해주세요.');
      return;
    }

    try {
      console.log('onEdit 호출 - qnaId:', qna.id);
      await onEdit(qna.id, { title: editedTitle, question: editedQuestion });
      setIsEditing(false);
      console.log('수정 완료');
    } catch (error) {
      console.error('QnA 수정 오류:', error);
      console.error('에러 상세:', error.response?.data || error.message);
    }
  };

  const handleDelete = async () => {
    console.log('삭제 버튼 클릭 - qnaId:', qna.id);
    
    if (window.confirm('정말 이 문의를 삭제하시겠습니까?')) {
      try {
        console.log('onDelete 호출');
        await onDelete(qna.id);
        console.log('삭제 완료');
      } catch (error) {
        console.error('QnA 삭제 오류:', error);
        console.error('에러 상세:', error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="qna-item-wrapper">
      <div className="qna-item">
        {isEditing ? (
          <div className="qna-edit-form">
            <input
              type="text"
              className="qna-edit-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
            <textarea
              className="qna-edit-textarea"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              placeholder="문의 내용을 입력하세요"
            />
            <div className="qna-edit-actions">
              <button onClick={handleSaveEdit} className="btn-save">저장</button>
              <button onClick={handleCancelEdit} className="btn-cancel">취소</button>
            </div>
          </div>
        ) : (
          <>
            <div className="qna-header">
              <span className="qna-badge">Q</span>
              <span className="qna-title">{qna.title || '상품 문의'}</span>
              <div className="qna-info">
                <span className="qna-author">{qna.writer || '익명'}</span>
                {qna.createdAt && (
                  <span className="qna-date">
                    {new Date(qna.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="qna-question">{qna.question}</div>
            {isAuthor && (
              <div className="qna-actions">
                <button onClick={handleEdit} className="btn-edit">수정</button>
                <button onClick={handleDelete} className="btn-delete">삭제</button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* 답변 표시 */}
      {qna.replies && qna.replies.length > 0 && !isEditing && (
        <div className="qna-replies">
          {qna.replies.map((reply, index) => (
            <div key={index} className="qna-reply">
              <span className="reply-badge">A</span>
              <div className="reply-content">
                <div className="reply-text">{reply.content}</div>
                <div className="reply-info">
                  <span className="reply-author">{reply.responder || '관리자'}</span>
                  {reply.createdAt && (
                    <span className="reply-date">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QnaItem;
