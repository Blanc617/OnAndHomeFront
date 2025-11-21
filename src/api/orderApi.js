import apiClient from './axiosConfig';

/**
 * 주문 관련 API - Spring Boot 엔드포인트에 맞게 수정
 */
const orderApi = {
  /**
   * 주문 생성
   * POST /api/orders/create
   */
  createOrder: async (orderData) => {
    const response = await apiClient.post('/api/orders/create', orderData);
    return response.data;
  },

  /**
   * 사용자의 모든 주문 조회
   * GET /api/orders/user/{userId}
   */
  getUserOrders: async (userId) => {
    const response = await apiClient.get(`/api/orders/user/${userId}`);
    return response.data;
  },

  /**
   * 주문 상세 조회
   * GET /api/orders/{orderId}
   */
  getOrderDetail: async (orderId) => {
    const response = await apiClient.get(`/api/orders/${orderId}`);
    return response.data;
  },

  /**
   * 주문 결제 처리
   * POST /api/orders/{orderId}/pay
   */
  payOrder: async (orderId) => {
    const response = await apiClient.post(`/api/orders/${orderId}/pay`);
    return response.data;
  },

  /**
   * 주문 취소
   * POST /api/orders/{orderId}/cancel
   */
  cancelOrder: async (orderId) => {
    const response = await apiClient.post(`/api/orders/${orderId}/cancel`);
    return response.data;
  },
};

export default orderApi;
