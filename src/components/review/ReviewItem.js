import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import reviewApi from '../../api/reviewApi';
import StarRating from '../StarRating';
import './ReviewItem.css';

const ReviewItem = ({ review, onEdit, onDelete }) => {
    const { user } = useSelector((state) => state.user);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(review.content);
    const [editedRating, setEditedRating] = useState(review.rating || 5);
    
    const [isLiked, setIsLiked] = useState(review.isLiked || false);
    const [likedCount, setLikedCount] = useState(review.likedCount || 0);

    useEffect(() => {
    setIsLiked(review.isLiked || false);
    setLikedCount(review.likedCount ?? 0);
  }, [review.isLiked, review.likedCount]);

    const isAuthor =
        user &&
        (review.username === user.userId ||
            review.author === user.username ||
            review.author === user.userId);
            

    const handleEdit = () => setIsEditing(true);
    

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(review.content);
        setEditedRating(review.rating || 5); // 원래 점수로 되돌리기
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

        const handleLikeClick = async () => {
            try {
                const result = await reviewApi.toggleLike(review.id, user.id);

                if (result.success) {
                    setIsLiked(result.data.isLiked);
                    setLikedCount(result.data.likedCount); // 이름은 likedCount!
                }
             } catch (error) {
                console.error("좋아요 오류: ", error);
             }
        };


    return (
    <div className="review-item-wrapper">
        <div className="review-item">
            {isEditing ? (
                <div className="review-edit-form">
                    
                        <span className="rating-label"></span>
                            {/* 별점 선택 컴포넌트 */} 
                            <StarRating
                                rating={editedRating}
                                onRatingChange={setEditedRating}
                                />
                            
                        <textarea
                            className="review-edit-textarea"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            placeholder="리뷰 내용을 입력하세요"
                            />
                            <div className="review-edit-actions">
                             <button onClick={handleSaveEdit} className="btn-save">저장</button>
                         <button onClick={handleCancelEdit} className="btn-cancel">취소</button>
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

                        {/* ✅ footer 영역 - 좋아요와 수정/삭제 버튼 */}
                <div className="review-footer">
                    <button 
                        className={`like-btn ${isLiked ? 'liked' : ''}`}
                        onClick={handleLikeClick}
                    >
                        <span className="like-icon">{isLiked ? "❤️" : "🤍"}</span>
                        <span className="like-count">{likedCount}</span>
                    </button>
                    
                    {isAuthor && (
                        <div className="review-actions">
                            <button onClick={handleEdit} className="btn-edit">수정</button>
                            <button onClick={handleDelete} className="btn-delete">삭제</button>
                        </div>
                    )}
                </div>
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