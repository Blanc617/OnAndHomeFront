import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./ReviewItem.css";

// ✅ 1. 별 아이콘 컴포넌트 (설치 필요 없음, 코드 내장형)
const StarIcon = ({ filled, className, onClick, onMouseEnter, onMouseLeave }) => (
    <svg
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ cursor: "pointer" }} // 마우스 올리면 손가락 모양
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ReviewItem = ({ review, onEdit, onDelete }) => {
    const { user } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(review.content);

    // ✅ 별점 상태 관리 (팀원 기능 + 내 변수명 합체)
    const [editedRating, setEditedRating] = useState(review.rating || 5);
    // ✅ 마우스 오버용 상태 (미리보기용)
    const [hoveredRating, setHoveredRating] = useState(0);

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
        setEditedRating(review.rating || 5); // 원래 점수로 되돌리기
        setHoveredRating(0); // 미리보기 초기화
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

                        {/* ✅ 별점 수정 영역 (콤보박스 대신 별 아이콘 사용) */}
                        <div className="rating-edit">
                            <span className="rating-label">별점: </span>
                            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        // 마우스 올린 값(hovered)이 있으면 그걸 보여주고, 없으면 확정된 값(edited) 보여주기
                                        filled={(hoveredRating || editedRating) >= star}
                                        className={
                                            (hoveredRating || editedRating) >= star
                                                ? "star-icon star-filled text-yellow-400" // 노란 별 (CSS 클래스 있다면 적용)
                                                : "star-icon text-gray-300" // 빈 별
                                        }
                                        // 클릭 시 -> 점수 확정
                                        onClick={() => setEditedRating(star)}
                                        // 마우스 올림 -> 미리보기
                                        onMouseEnter={() => setHoveredRating(star)}
                                        // 마우스 뗌 -> 미리보기 끄기
                                        onMouseLeave={() => setHoveredRating(0)}
                                    />
                                ))}
                                <span style={{ marginLeft: "8px", fontSize: "0.9em", color: "#666" }}>
                  ({hoveredRating > 0 ? hoveredRating : editedRating}점)
                </span>
                            </div>
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

                        {/* ⭐ 수정/삭제 버튼 */}
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

            {/* ⭐ 답글 표시 부분 */}
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