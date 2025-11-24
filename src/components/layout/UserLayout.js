import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/userSlice';
import './UserLayout.css';

const UserLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [showMyPageDropdown, setShowMyPageDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // 관리자 확인 로그
  useEffect(() => {
    console.log('=== UserLayout 렌더링 상태 ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    
    if (isAuthenticated && user) {
      console.log('role:', user.role);
      console.log('role type:', typeof user.role);
      const isAdmin = user.role === 0 || user.role === "0" || Number(user.role) === 0;
      console.log('>>> 관리자 여부:', isAdmin);
    }
  }, [isAuthenticated, user]);

  // 관리자 여부 확인 함수
  const isAdmin = () => {
    if (!user) return false;
    return user.role === 0 || user.role === "0" || Number(user.role) === 0;
  };

  // 카테고리 구조 정의
  const categories = [
    {
      id: 'all',
      name: '전체상품',
      link: '/products',
      subCategories: []
    },
    {
      id: 'tv-audio',
      name: 'TV/오디오',
      subCategories: [
        { name: 'TV', link: '/products/category/TV' },
        { name: '오디오', link: '/products/category/오디오' }
      ]
    },
    {
      id: 'kitchen',
      name: '주방가전',
      subCategories: [
        { name: '냉장고', link: '/products/category/냉장고' },
        { name: '전자레인지', link: '/products/category/전자레인지' },
        { name: '식기세척기', link: '/products/category/식기세척기' }
      ]
    },
    {
      id: 'living',
      name: '생활가전',
      subCategories: [
        { name: '세탁기', link: '/products/category/세탁기' },
        { name: '청소기', link: '/products/category/청소기' }
      ]
    },
    {
      id: 'air',
      name: '에어컨/공기청정기',
      subCategories: [
        { name: '에어컨', link: '/products/category/에어컨' },
        { name: '공기청정기', link: '/products/category/공기청정기' }
      ]
    },
    {
      id: 'etc',
      name: '기타',
      subCategories: [
        { name: '정수기', link: '/products/category/정수기' },
        { name: '안마의자', link: '/products/category/안마의자' },
        { name: 'PC', link: '/products/category/PC' }
      ]
    }
  ];

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

  const closeDropdowns = () => {
    setShowMyPageDropdown(false);
    setHoveredCategory(null);
  };

  const handleCategoryMouseEnter = (categoryId) => {
    setHoveredCategory(categoryId);
  };

  const handleCategoryMouseLeave = () => {
    setHoveredCategory(null);
  };

  const handleCategoryClick = (e, category) => {
    // 소카테고리가 있는 경우 클릭 방지
    if (category.subCategories && category.subCategories.length > 0) {
      e.preventDefault();
    }
  };

  return (
    <div className="user-layout">
      {/* 헤더 */}
      <header className="user-header">
        <div className="header-container">
          {/* 로고 */}
          <div className="logo">
            <Link to="/" onClick={closeDropdowns}>
              <img src="/images/logo.png" alt="On&Home" />
            </Link>
          </div>

          {/* 네비게이션 */}
          <nav className="main-nav">
            {categories.map((category) => (
              <div
                key={category.id}
                className="nav-item-wrapper"
                onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                onMouseLeave={handleCategoryMouseLeave}
              >
                {category.link ? (
                  <Link
                    to={category.link}
                    className="nav-item"
                    onClick={closeDropdowns}
                  >
                    {category.name}
                  </Link>
                ) : (
                  <span
                    className="nav-item nav-item-no-link"
                    onClick={(e) => handleCategoryClick(e, category)}
                  >
                    {category.name}
                  </span>
                )}

                {/* 소카테고리 드롭다운 */}
                {category.subCategories && category.subCategories.length > 0 && hoveredCategory === category.id && (
                  <div className="sub-category-dropdown">
                    {category.subCategories.map((subCategory, index) => (
                      <Link
                        key={index}
                        to={subCategory.link}
                        className="sub-category-item"
                        onClick={closeDropdowns}
                      >
                        {subCategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
                        onClick={closeDropdowns}
                        className="dropdown-item"
                      >
                        주문내역
                      </Link>
                      <Link 
                        to="/mypage/info" 
                        onClick={closeDropdowns}
                        className="dropdown-item"
                      >
                        내정보
                      </Link>
                      <Link 
                        to="/cart" 
                        onClick={closeDropdowns}
                        className="dropdown-item"
                      >
                        장바구니
                      </Link>
                    </div>
                  )}
                </div>

                {/* 관리자 버튼 - 마이페이지와 로그아웃 사이 */}
                {isAdmin() && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={closeDropdowns}
                    style={{ 
                      color: '#ff6b00', 
                      fontWeight: 'bold',
                      marginLeft: '15px',
                      marginRight: '15px'
                    }}
                  >
                    관리자페이지
                  </Link>
                )}

                <button onClick={handleLogout} className="logout-button">로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeDropdowns}>로그인</Link>
                <Link to="/signup" onClick={closeDropdowns}>회원가입</Link>
              </>
            )}
            <Link to="/cart" onClick={closeDropdowns}>
              <img src="/images/cart-icon.png" alt="장바구니" className="cart-icon" />
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="main-content" onClick={closeDropdowns}>
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
            <Link to="/notice" onClick={closeDropdowns}>공지사항</Link>
            <Link to="/qna" onClick={closeDropdowns}>Q&A</Link>
            <Link to="/review" onClick={closeDropdowns}>리뷰</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
