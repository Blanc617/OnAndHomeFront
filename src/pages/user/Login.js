import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userSlice';
import authApi from '../../api/authApi';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력 시 에러 메시지 초기화
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 입력 검증
    if (!formData.userId.trim() || !formData.password.trim()) {
      setError('아이디와 비밀번호를 입력하세요.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('로그인 요청:', formData.userId);
      
      // Spring Boot API 호출
      const response = await authApi.login(formData);
      
      console.log('로그인 응답:', response);
      
      if (response.success && response.accessToken) {
        // Redux store 업데이트
        dispatch(login({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user
        }));
        
        console.log('로그인 성공 - Redux store 업데이트 완료');
        
        // 역할에 따라 리다이렉트
        if (response.user && response.user.role === 0) {
          // 관리자
          navigate('/admin/dashboard');
        } else {
          // 일반 사용자
          navigate('/');
        }
      } else {
        setError(response.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      
      if (error.response) {
        // 서버 응답이 있는 경우
        const errorMessage = error.response.data?.message || '아이디 또는 비밀번호가 일치하지 않습니다.';
        setError(errorMessage);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        setError('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        setError('로그인 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="on-main-wrap">
      <div className="login-wrap_user mt-80 mb-40">
        <div className="login-card_user">
          <div className="login-logo-wrap">
            <h3 className="login_header">Login</h3>
          </div>

          {/* 로그인 폼 */}
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="mb-16">
              <h4 className="login-h4">ID</h4>
              <input
                className="input w-full"
                type="text"
                name="userId"
                id="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="ID를 입력하세요"
                required
                disabled={loading}
              />
            </div>
            <div>
              <h4 className="login-h4">PASSWORD</h4>
              <input
                type="password"
                name="password"
                id="password"
                className="input w-full"
                value={formData.password}
                onChange={handleChange}
                placeholder="*************"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn--blk w-full mt-40"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          
          {/* 에러 메시지 표시 */}
          {error && (
            <div id="errorMessage" style={{ color: '#d32f2f', marginTop: '10px', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          {/* 링크 */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>
              계정이 없으신가요?{' '}
              <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>
                <b>회원가입</b>
              </Link>
            </p>
          </div>
          
          <div className="center mt-20" style={{ fontSize: 'xx-small' }}>
            ©2025 on&home. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
