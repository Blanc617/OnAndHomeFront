import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      name: '대시보드',
      icon: '📊',
      path: '/admin/dashboard'
    },
    {
      id: 'members',
      name: '회원 관리',
      icon: '👥',
      path: '/admin/users'
    },
    {
      id: 'products',
      name: '상품 관리',
      icon: '📦',
      path: '/admin/products'
    },
    {
      id: 'orders',
      name: '주문 관리',
      icon: '🛒',
      path: '/admin/orders'
    },
    {
      id: 'notices',
      name: '공지사항',
      icon: '📄',
      path: '/admin/notices'
    },
    {
      id: 'qna',
      name: 'Q&A',
      icon: '📝',
      path: '/admin/qna'
    },
    {
      id: 'reviews',
      name: '리뷰',
      icon: '⭐',
      path: '/admin/reviews'
    }
  ];

  const bottomMenuItems = [
    {
      id: 'sales',
      name: '매출',
      count: 0,
      path: '/admin/sales'
    },
    {
      id: 'membership',
      name: '회원',
      count: 0,
      path: '/admin/membership-stats'
    },
    {
      id: 'product-stats',
      name: '상품',
      count: 0,
      path: '/admin/product-stats'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/admin" className="logo">
          <span className="logo-text">On&Home</span>
          <span className="logo-icon">🏠</span>
        </Link>
      </div>

      <div className="sidebar-user">
        <span className="user-label">관리자</span>
      </div>

      <div className="breadcrumb">
        <span>admin8 관리자홈으로</span>
        <Link to="/" className="logout-link">메인으로</Link>
      </div>

      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map(item => (
            <li key={item.id} className={isActive(item.path) ? 'active' : ''}>
              <Link to={item.path}>
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-title">관리자 대시보드</div>
        <ul className="stats-list">
          {bottomMenuItems.map(item => (
            <li key={item.id}>
              <Link to={item.path}>
                <span className="stat-label">총 {item.name}</span>
                <span className="stat-count">{item.count}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="footer-note">
          관리자 대시보드입니다. (개발 중)
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
