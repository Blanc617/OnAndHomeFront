import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import userApi from '../../api/userApi';
import './MyInfo.css';

const MyInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 수정 폼 상태
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    birthDate: ''
  });

  // 비밀번호 변경 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 사용자 정보 조회
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUserInfo();
      if (response.success) {
        setUserInfo(response.data);
        setEditForm({
          username: response.data.username || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          gender: response.data.gender || '',
          birthDate: response.data.birthDate || ''
        });
      }
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err);
      setError('사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 수정 모드 전환
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // 취소 시 원래 정보로 되돌림
      setEditForm({
        username: userInfo.username || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        gender: userInfo.gender || '',
        birthDate: userInfo.birthDate || ''
      });
    }
  };

  // 입력 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 정보 수정 저장
  const handleSaveInfo = async () => {
    try {
      const response = await userApi.updateUserInfo(editForm);
      if (response.success) {
        alert('회원 정보가 수정되었습니다.');
        setUserInfo(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('정보 수정 실패:', err);
      alert(err.response?.data?.message || '정보 수정에 실패했습니다.');
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    try {
      const response = await userApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.success) {
        alert('비밀번호가 변경되었습니다.');
        setShowPasswordModal(false);
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      alert(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 회원 탈퇴하시겠습니까?\n탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.')) {
      try {
        const response = await userApi.deleteAccount();
        if (response.success) {
          alert('회원 탈퇴가 완료되었습니다.');
          
          // Redux logout 액션 dispatch
          dispatch(logout());
          
          // 모든 로컬 스토리지 데이터 완전 삭제
          localStorage.clear();
          
          // 메인 페이지로 강제 이동
          window.location.href = '/';
        }
      } catch (err) {
        console.error('회원 탈퇴 실패:', err);
        alert(err.response?.data?.message || '회원 탈퇴에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <div className="my-info-container"><div className="loading">로딩 중...</div></div>;
  }

  if (error) {
    return <div className="my-info-container"><div className="error">{error}</div></div>;
  }

  if (!userInfo) {
    return <div className="my-info-container"><div className="error">사용자 정보를 찾을 수 없습니다.</div></div>;
  }

  return (
    <div className="my-info-container">
      <div className="my-info-header">
        <h1>내 정보</h1>
        <button 
          className={`btn-edit-mode ${isEditing ? 'editing' : ''}`}
          onClick={handleEditToggle}
        >
          {isEditing ? '취소' : '수정'}
        </button>
      </div>

      <div className="info-card">
        <div className="info-section">
          <h2>기본 정보</h2>
          
          <div className="info-row">
            <label>아이디</label>
            <div className="info-value">{userInfo.userId}</div>
          </div>

          <div className="info-row">
            <label>이름</label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                className="info-input"
              />
            ) : (
              <div className="info-value">{userInfo.username || '-'}</div>
            )}
          </div>

          <div className="info-row">
            <label>이메일</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="info-input"
              />
            ) : (
              <div className="info-value">{userInfo.email || '-'}</div>
            )}
          </div>

          <div className="info-row">
            <label>전화번호</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className="info-input"
                placeholder="010-1234-5678"
              />
            ) : (
              <div className="info-value">{userInfo.phone || '-'}</div>
            )}
          </div>

          <div className="info-row">
            <label>성별</label>
            {isEditing ? (
              <select
                name="gender"
                value={editForm.gender}
                onChange={handleInputChange}
                className="info-input"
              >
                <option value="">선택</option>
                <option value="M">남성</option>
                <option value="F">여성</option>
                <option value="O">기타</option>
              </select>
            ) : (
              <div className="info-value">
                {userInfo.gender === 'M' ? '남성' : userInfo.gender === 'F' ? '여성' : userInfo.gender === 'O' ? '기타' : '-'}
              </div>
            )}
          </div>

          <div className="info-row">
            <label>생년월일</label>
            {isEditing ? (
              <input
                type="date"
                name="birthDate"
                value={editForm.birthDate}
                onChange={handleInputChange}
                className="info-input"
              />
            ) : (
              <div className="info-value">{userInfo.birthDate || '-'}</div>
            )}
          </div>

          <div className="info-row">
            <label>주소</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editForm.address}
                onChange={handleInputChange}
                className="info-input"
                placeholder="주소를 입력하세요"
              />
            ) : (
              <div className="info-value">{userInfo.address || '-'}</div>
            )}
          </div>

          <div className="info-row">
            <label>가입일</label>
            <div className="info-value">
              {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : '-'}
            </div>
          </div>

          {isEditing && (
            <div className="edit-actions">
              <button className="btn-save" onClick={handleSaveInfo}>
                저장
              </button>
            </div>
          )}
        </div>

        <div className="info-section">
          <h2>계정 관리</h2>
          
          <div className="account-actions">
            <button 
              className="btn-password-change"
              onClick={() => setShowPasswordModal(true)}
            >
              비밀번호 변경
            </button>
            
            <button 
              className="btn-delete-account"
              onClick={handleDeleteAccount}
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>비밀번호 변경</h2>
            
            <div className="modal-form">
              <div className="form-group">
                <label>현재 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    oldPassword: e.target.value
                  }))}
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>새 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  placeholder="새 비밀번호를 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-modal-cancel"
                  onClick={() => setShowPasswordModal(false)}
                >
                  취소
                </button>
                <button 
                  className="btn-modal-confirm"
                  onClick={handlePasswordChange}
                >
                  변경
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInfo;
