import apiClient from "./axiosConfig";

/**
 * 리뷰 관련 API
 */
const reviewApi = {
  /**
   * 상품 리뷰 목록 조회
   */
  getProductReviews: async (productId, userId = null, page = 0, size = 10) => {
  const params = { page, size };

  if (userId) {
    params.userId = userId;
  }

  const response = await apiClient.get(`/api/reviews/product/${productId}`, {
    params,
  });

  // ✅ 서버 응답: { success: true, data: [...] } 에서 리뷰 배열만 꺼내서 반환
  const { success, data } = response.data;

  if (success && Array.isArray(data)) {
    return data;          // 👉 리뷰 배열만 리턴
  }

  return [];
},

  /**
   * 리뷰 작성
   */
  createReview: async (reviewData) => {
    const response = await apiClient.post("/api/reviews", reviewData);
    return response.data;
  },

  /**
   * 리뷰 수정
   */
  updateReview: async (reviewId, reviewData) => {
    const response = await apiClient.put(
      `/api/reviews/${reviewId}`,
      reviewData
    );
    return response.data;
  },

  /**
   * 리뷰 삭제
   */
  deleteReview: async (reviewId) => {
    const response = await apiClient.delete(`/api/reviews/${reviewId}`);
    return response.data;
  },

  /**
   * 내 리뷰 목록 조회
   */
  getMyReviews: async () => {
    const response = await apiClient.get("/api/reviews/my", {});
    return response.data;
  },

  /**
   * 최근 리뷰 조회
   */
  getRecentReviews: async (limit = 5) => {
    const response = await apiClient.get("/api/reviews/recent", {
      params: { limit },
    });
    return response.data;
  },
   /**
   * 리뷰 좋아요
   */
  toggleLike: async (reviewId, userId) => {
    const response = await apiClient.post(
      `/api/reviews/${reviewId}/like`,
      null,
      { params: { userId } }
    );
    return response.data;
  },
};

export default reviewApi;
