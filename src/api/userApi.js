import apiClient from './axiosConfig';

/**
 * 사용자 관련 API
 */
const userApi = {
  /**
   * 사용자 정보 조회
   */
  getUserInfo: async () => {
    const response = await apiClient.get('/api/user/info');
    return response.data;
  },

  /**
   * 사용자 정보 수정
   */
  updateUserInfo: async (userData) => {
    const response = await apiClient.put('/api/user/info', userData);
    return response.data;
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/api/user/password', passwordData);
    return response.data;
  },

  /**
   * 회원 탈퇴
   */
  deleteAccount: async (verificationCode) => {
    const response = await apiClient.delete('/api/user/account', {
      data: { verificationCode }
    });
    return response.data;
  },
};

export default userApi;
