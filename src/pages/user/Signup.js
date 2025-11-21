import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../../api/authApi';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    passwordConfirm: '',
    email: '',
    username: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드의 에러 메시지 초기화
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    setErrorAlert('');
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // 아이디 검증
    if (!formData.userId || formData.userId.length < 4 || formData.userId.length > 20) {
      newErrors.userId = '아이디는 4-20자여야 합니다.';
    }
    
    // 비밀번호 검증
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }
    
    // 비밀번호 확인 검증
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }
    
    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    // 이름 검증
    if (!formData.username || formData.username.trim() === '') {
      newErrors.username = '이름을 입력해주세요.';
    }
    
    // 휴대폰 검증 (선택 사항이지만 입력된 경우 검증)
    if (formData.phone) {
      const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorAlert('');
    setSuccessMessage('');
    
    // 클라이언트 측 검증
    if (!validateForm()) {
      setErrorAlert('입력 정보를 확인해주세요.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('회원가입 요청:', formData);
      
      // Spring Boot API 호출 (role은 서버에서 자동으로 1로 설정됨)
      const signupData = {
        userId: formData.userId,
        password: formData.password,
        email: formData.email,
        username: formData.username,
        phone: formData.phone || null,
      };
      
      const response = await authApi.signup(signupData);
      
      console.log('회원가입 응답:', response);
      
      if (response.success) {
        setSuccessMessage('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        
        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorAlert(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      
      if (error.response) {
        // 서버 응답이 있는 경우
        const errorMessage = error.response.data?.message || '회원가입에 실패했습니다.';
        setErrorAlert(errorMessage);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        setErrorAlert('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        setErrorAlert('회원가입 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  
  return (
    <div className="on-main-wrap">
      <div className="regeist_wrapper mb-40">
        <div className="regeist_inner">
          <h2 className="mb-30">회원가입</h2>
          <div className="border-1p"></div>
          
          <form id="signupForm" className="mt-40" onSubmit={handleSubmit}>
            {/* 아이디 */}
            <div className="form-group">
              <label className="login-label" htmlFor="userId">
                아이디 <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                className="input"
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="4-20글자"
                required
                disabled={loading}
              />
              {errors.userId && (
                <div className="error-message">{errors.userId}</div>
              )}
            </div>
            
            {/* 비밀번호 */}
            <div className="form-group">
              <label className="login-label" htmlFor="password">
                비밀번호 <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="password"
                className="input"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="8글자 이상"
                required
                disabled={loading}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>
            
            {/* 비밀번호 확인 */}
            <div className="form-group">
              <label className="login-label" htmlFor="passwordConfirm">
                비밀번호 확인 <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="password"
                className="input"
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder=""
                required
                disabled={loading}
              />
              {errors.passwordConfirm && (
                <div className="error-message">{errors.passwordConfirm}</div>
              )}
            </div>
            
            {/* 이메일 */}
            <div className="form-group">
              <label className="login-label" htmlFor="email">
                이메일 <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                className="input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@onandhome.com"
                required
                disabled={loading}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
            
            {/* 이름 */}
            <div className="form-group">
              <label className="login-label" htmlFor="username">
                이름 <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="text"
                className="input"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="홍길동"
                required
                disabled={loading}
              />
              {errors.username && (
                <div className="error-message">{errors.username}</div>
              )}
            </div>
            
            {/* 휴대폰 */}
            <div className="form-group">
              <label className="login-label" htmlFor="phone">
                휴대폰
              </label>
              <input
                type="tel"
                className="input"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                disabled={loading}
              />
              {errors.phone && (
                <div className="error-message">{errors.phone}</div>
              )}
            </div>
            
            {/* 성공 메시지 */}
            {successMessage && (
              <div id="successMessage" style={{ 
                color: '#388e3c', 
                marginTop: '10px', 
                textAlign: 'center', 
                padding: '10px', 
                backgroundColor: '#e8f5e9', 
                borderRadius: '4px' 
              }}>
                {successMessage}
              </div>
            )}
            
            {/* 에러 메시지 */}
            {errorAlert && (
              <div id="errorAlert" style={{ 
                color: '#d32f2f', 
                marginTop: '10px', 
                textAlign: 'center', 
                padding: '10px', 
                backgroundColor: '#ffebee', 
                borderRadius: '4px' 
              }}>
                {errorAlert}
              </div>
            )}
            
            <div className="border-2p"></div>
            
            {/* 버튼 */}
            <div className="button-group justify-start flex mb-20">
              <button 
                type="submit" 
                className="btn btn--primary"
                disabled={loading}
              >
                {loading ? '처리중...' : '회원가입'}
              </button>
              <button 
                type="button" 
                className="btn btn--primary-outline" 
                onClick={handleCancel}
                disabled={loading}
              >
                취소
              </button>
            </div>
            
            {/* 로그인 링크 */}
            <div className="login-link">
              이미 계정이 있으신가요?{' '}
              <Link to="/login">
                <b>로그인</b>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
