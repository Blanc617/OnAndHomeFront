import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/userSlice';
import './UserLayout.css';

const UserLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [showMyPageDropdown, setShowMyPageDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    navigate('/');
    alert('로그아웃되었습니다.');
  };

  const toggleMyPageDropdown = () => {
    setShowMyPageDropdown(!showMyPageDropdown);
  };

  const closeDropdown = () => {
    setShowMyPageDropdown(false);
  };

  return (
    <div className="user-layout">
      {/* 헤더 */}
      <header className="user-header">
        <div className="header-container">
          {/* 로고 */}
          <div className="logo">
            <Link to="/" onClick={closeDropdown}>
              <img src="/images/logo.png" alt="On&Home" />
            </Link>
          </div>

          {/* 네비게이션 */}
          <nav className="main-nav">
            <Link to="/products" onClick={closeDropdown}>전체상품</Link>
            <Link to="/products/category/TV/모니터" onClick={closeDropdown}>TV/모니터</Link>
            <Link to="/products/category/주방가전" onClick={closeDropdown}>주방가전</Link>
            <Link to="/products/category/생활가전" onClick={closeDropdown}>생활가전</Link>
            <Link to="/products/category/에어컨/공기청정기" onClick={closeDropdown}>에어컨/공기청정기</Link>
            <Link to="/products/category/기타" onClick={closeDropdown}>기타</Link>
          </nav>

          {/* 사용자 메뉴 */}
          <div className="user-menu">
            {isAuthenticated ? (
              <>
                <span className="user-name">{user?.username}님</span>
                
                {/* 마이페이지 드롭다운 */}
                <div className="mypage-dropdown-container">
                  <button 
                    className="mypage-button"
                    onClick={toggleMyPageDropdown}
                  >
                    마이페이지
                  </button>
                  {showMyPageDropdown && (
                    <div className="mypage-dropdown-menu">
                      <Link 
                        to="/user/my-orders" 
                        onClick={closeDropdown}
                        className="dropdown-item"
                      >
                        주문내역
                      </Link>
                      <Link 
                        to="/mypage/info" 
                        onClick={closeDropdown}
                        className="dropdown-item"
                      >
                        내정보
                      </Link>
                      <Link 
                        to="/cart" 
                        onClick={closeDropdown}
                        className="dropdown-item"
                      >
                        장바구니
                      </Link>
                    </div>
                  )}
                </div>

                <button onClick={handleLogout} className="logout-button">로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeDropdown}>로그인</Link>
                <Link to="/signup" onClick={closeDropdown}>회원가입</Link>
              </>
            )}
            <Link to="/cart" onClick={closeDropdown}>
              <img src="/images/cart-icon.png" alt="장바구니" className="cart-icon" />
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="main-content" onClick={closeDropdown}>
        <Outlet />
      </main>

      {/* 푸터 */}
      <footer className="user-footer">
        <div className="footer-container">
          <div className="footer-info">
            <h3>On&Home</h3>
            <p>고객센터: 1544-7777</p>
            <p>© 2024 On&Home. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <Link to="/notice" onClick={closeDropdown}>공지사항</Link>
            <Link to="/qna" onClick={closeDropdown}>Q&A</Link>
            <Link to="/review" onClick={closeDropdown}>리뷰</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;