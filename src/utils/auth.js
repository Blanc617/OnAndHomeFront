/**
 * JWT 토큰 관련 유틸리티
 */

/**
 * 토큰 저장
 */
export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

/**
 * 액세스 토큰 조회
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * 리프레시 토큰 조회
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

/**
 * 토큰 삭제
 */
export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
};

/**
 * 토큰 유효성 검사 (간단한 체크)
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // JWT는 3개 부분으로 구성 (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // payload 디코딩
    const payload = JSON.parse(atob(parts[1]));
    
    // 만료 시간 체크
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // 초를 밀리초로 변환
      return Date.now() < expirationTime;
    }
    
    return true;
  } catch (error) {
    console.error('토큰 검증 실패:', error);
    return false;
  }
};

/**
 * 토큰에서 사용자 정보 추출
 */
export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return {
      userId: payload.userId,
      email: payload.sub,
      role: payload.role,
    };
  } catch (error) {
    console.error('토큰 파싱 실패:', error);
    return null;
  }
};

/**
 * 로그인 상태 확인
 */
export const isLoggedIn = () => {
  const token = getAccessToken();
  return token && isTokenValid(token);
};
