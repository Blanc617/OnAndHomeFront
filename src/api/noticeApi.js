import apiClient from './axiosConfig';

/**
 * 공지사항 관련 API
 */
const noticeApi = {
  /**
   * 공지사항 목록 조회
   */
  getNoticeList: async (page = 0, size = 10) => {
    const response = await apiClient.get('/api/notice/list', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * 공지사항 상세 조회
   */
  getNoticeDetail: async (noticeId) => {
    const response = await apiClient.get(`/api/notice/${noticeId}`);
    return response.data;
  },
};

export default noticeApi;
