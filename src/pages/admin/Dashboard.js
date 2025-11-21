import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DashboardCard from '../../components/admin/DashboardCard';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    sales: {
      todayOrders: 15,
      todayRevenue: 30256000,
      monthRevenue: 456723645
    },
    products: {
      totalProducts: 62,
      notForSale: 8,
      outOfStock: 4
    },
    members: {
      newMembers: 3,
      totalMembers: 7,
      monthlyMembers: 3
    },
    board: {
      notices: 5,
      reviews: 12,
      qna: 5
    }
  });

  const [adminInfo, setAdminInfo] = useState({
    name: 'Admin',
    username: '안녕하세요'
  });

  useEffect(() => {
    // API 호출하여 대시보드 데이터 가져오기
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 실제 API 호출 구현
      // const response = await fetch('/api/admin/dashboard');
      // const data = await response.json();
      // setDashboardData(data);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    }
  };

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dash Board</h1>
        </div>

        <div className="dashboard-grid">
          {/* 매출현황 카드 */}
          <DashboardCard title="매출현황" type="sales">
            <div className="card-content">
              <div className="data-row">
                <span className="label">오늘의 주문</span>
                <span className="value">{dashboardData.sales.todayOrders} 건</span>
              </div>
              <div className="data-row">
                <span className="label">오늘의 매출</span>
                <span className="value">{formatCurrency(dashboardData.sales.todayRevenue)} 원</span>
              </div>
              <div className="data-row">
                <span className="label">이달의 매출</span>
                <span className="value highlight">{formatCurrency(dashboardData.sales.monthRevenue)} 원</span>
              </div>
            </div>
          </DashboardCard>

          {/* 상품 현황 카드 */}
          <DashboardCard title="상품 현황" type="products">
            <div className="card-content">
              <div className="data-row">
                <span className="label">전체상품</span>
                <span className="value">{dashboardData.products.totalProducts} 건</span>
              </div>
              <div className="data-row">
                <span className="label">판매 중지 상품</span>
                <span className="value">{dashboardData.products.notForSale} 건</span>
              </div>
              <div className="data-row">
                <span className="label">품절 상품</span>
                <span className="value">{dashboardData.products.outOfStock} 건</span>
              </div>
            </div>
          </DashboardCard>

          {/* 회원 현황 카드 */}
          <DashboardCard title="회원 현황" type="members">
            <div className="card-content">
              <div className="data-row">
                <span className="label">신규가입 회원</span>
                <span className="value">{dashboardData.members.newMembers} 명</span>
              </div>
              <div className="data-row">
                <span className="label">전체회원</span>
                <span className="value">{dashboardData.members.totalMembers} 명</span>
              </div>
              <div className="data-row">
                <span className="label">탈퇴 회원</span>
                <span className="value">{dashboardData.members.monthlyMembers} 명</span>
              </div>
            </div>
          </DashboardCard>

          {/* 게시판 카드 */}
          <DashboardCard title="게시판" type="board">
            <div className="card-content">
              <div className="data-row">
                <span className="label">공지사항</span>
                <span className="value">{dashboardData.board.notices} 건</span>
              </div>
              <div className="data-row">
                <span className="label">리뷰게시판</span>
                <span className="value">{dashboardData.board.reviews} 건</span>
              </div>
              <div className="data-row">
                <span className="label">Q&A게시판</span>
                <span className="value">{dashboardData.board.qna} 건</span>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* 관리자 정보 플로팅 박스 */}
        <div className="admin-info-box">
          <div className="admin-info">
            <div className="admin-name">{adminInfo.name} 님</div>
            <div className="admin-greeting">{adminInfo.username}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            logout
            <span className="logout-icon">➡</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
