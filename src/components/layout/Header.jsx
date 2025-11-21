import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { CATEGORIES } from '../../utils/constants';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, isAdmin, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      dispatch(logout());
      navigate('/login?logout=true');
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-inner">
          <div className="logo">
            <Link to="/">
              <img src="/images/logo.png" alt="On&Home" />
            </Link>
          </div>
          
          <div className="header-nav">
            <ul>
              {isLoggedIn ? (
                <>
                  <li><Link to="/my-page">마이페이지</Link></li>
                  <li><Link to="/notice/list">공지사항</Link></li>
                  {isAdmin && (
                    <li><Link to="/admin/dashboard"><strong>관리자</strong></Link></li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="logout-btn">
                      로그아웃
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login">로그인</Link></li>
                  <li><Link to="/signup">회원가입</Link></li>
                  <li><Link to="/notice/list">공지사항</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="header-category">
        <div className="header-inner">
          <nav className="category-nav">
            <ul className="depth1">
              {CATEGORIES.map((category, index) => (
                <li key={index}>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    {category.parentName}
                  </a>
                  {category.children && category.children.length > 0 && (
                    <ul className="depth2">
                      {category.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link to={`/product/category?category=${encodeURIComponent(child)}`}>
                            {child}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="header-actions">
            <Link to="/cart" className="cart-link">
              <img src="/images/icon_cart.png" alt="장바구니" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
