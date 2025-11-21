import apiClient from './axiosConfig';

/**
 * 인증 관련 API
 */
const authApi = {
  /**
   * 로그인 - Spring Boot 엔드포인트에 맞게 수정
   */
  login: async (credentials) => {
    const response = await apiClient.post('/api/user/login', credentials);
    return response.data;
  },

  /**
   * 회원가입 - Spring Boot 엔드포인트에 맞게 수정
   */
  signup: async (userData) => {
    const response = await apiClient.post('/api/user/register', userData);
    return response.data;
  },

  /**
   * 로그아웃 (클라이언트 측에서 처리)
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    return Promise.resolve({ success: true });
  },

  /**
   * 토큰 갱신 - Spring Boot 엔드포인트에 맞게 수정
   */
  refresh: async (refreshToken) => {
    const response = await apiClient.post('/api/user/refresh', { refreshToken });
    return response.data;
  },

  /**
   * 세션 정보 조회
   */
  getSessionInfo: async () => {
    const response = await apiClient.get('/api/user/session-info');
    return response.data;
  },

  /**
   * 사용자 ID로 조회
   */
  getUserByUserId: async (userId) => {
    const response = await apiClient.get(`/api/user/username/${userId}`);
    return response.data;
  },

  /**
   * 사용자 ID로 조회 (ID)
   */
  getUserById: async (id) => {
    const response = await apiClient.get(`/api/user/${id}`);
    return response.data;
  },
};

export default authApi;
