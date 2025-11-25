import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./ReviewItem.css";

const ReviewItem = ({ review, onEdit, onDelete }) => {
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [editedRating, setEditedRating] = useState(review.rating || 5);

  // 현재 로그인한 사용자가 작성자인지 확인
  const isAuthor =
    user &&
    (review.username === user.userId ||
      review.author === user.username ||
      review.author === user.userId);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(review.content);
    setEditedRating(review.rating || 5);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      await onEdit(review.id, { content: editedContent, rating: editedRating });
      setIsEditing(false);
    } catch (error) {
      console.error("리뷰 수정 오류:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await onDelete(review.id);
      } catch (error) {
        console.error("리뷰 삭제 오류:", error);
      }
    }
  };

  return (
    <div className="review-item-wrapper">
      <div className="review-item">
        {isEditing ? (
          <div className="review-edit-form">
            <div className="rating-edit">
              <label>평점: </label>
              <select
                value={editedRating}
                onChange={(e) => setEditedRating(parseInt(e.target.value))}
                className="rating-select"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
                <option value="4">⭐⭐⭐⭐ (4점)</option>
                <option value="3">⭐⭐⭐ (3점)</option>
                <option value="2">⭐⭐ (2점)</option>
                <option value="1">⭐ (1점)</option>
              </select>
            </div>
            <textarea
              className="review-edit-textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="리뷰 내용을 입력하세요"
            />
            <div className="review-edit-actions">
              <button onClick={handleSaveEdit} className="btn-save">
                저장
              </button>
              <button onClick={handleCancelEdit} className="btn-cancel">
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="review-header">
              <div className="review-rating">
                {"⭐".repeat(review.rating || 5)}
              </div>
              <div className="review-author">
                {review.author || review.username || "익명"}
              </div>
              {review.createdAt && (
                <div className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="review-content">{review.content}</div>

            {/* ⭐ 수정/삭제 버튼을 리뷰 내용 바로 아래로 이동 ⭐ */}
            {isAuthor && (
              <div className="review-actions">
                <button onClick={handleEdit} className="btn-edit">
                  수정
                </button>
                <button onClick={handleDelete} className="btn-delete">
                  삭제
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ⭐ 답글 표시 (Q&A와 동일한 UI) ⭐ */}
      {review.replies && review.replies.length > 0 && !isEditing && (
        <div className="review-replies-wrapper">
          {review.replies
            .filter((reply) => reply.content && reply.content.trim().length > 0)
            .map((reply) => (
              <div key={reply.id} className="review-reply">
                <span className="reply-badge">❤️</span>
                <div className="reply-content">
                  <div className="reply-text">{reply.content}</div>
                  <div className="reply-info">
                    <span className="reply-author">
                      {reply.author || "Admin"}
                    </span>
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

export default ReviewItem;
