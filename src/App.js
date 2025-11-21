import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { initializeAuth } from './store/slices/userSlice';

// 레이아웃
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// 사용자 페이지
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import ProductList from './pages/user/ProductList';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
import Order from './pages/user/Order';
import MyPage from './pages/user/MyPage';
import MyInfo from './pages/user/MyInfo';
import MyOrders from './pages/user/MyOrders';

// 공지사항, Q&A, 리뷰
import NoticeList from './pages/user/board/NoticeList';
import NoticeDetail from './pages/user/board/NoticeDetail';
import QnaList from './pages/user/board/QnaList';
import QnaDetail from './pages/user/board/QnaDetail';
import QnaWrite from './pages/user/board/QnaWrite';
import ReviewList from './pages/user/board/ReviewList';
import ReviewDetail from './pages/user/board/ReviewDetail';

// 관리자 페이지
import AdminDashboard from './pages/admin/Dashboard';
import AdminUserList from './pages/admin/UserList';
import AdminProductList from './pages/admin/ProductList';
import AdminProductCreate from './pages/admin/ProductCreate';
import AdminProductEdit from './pages/admin/ProductEdit';
import AdminOrderList from './pages/admin/OrderList';
import AdminNoticeList from './pages/admin/NoticeList';
import AdminNoticeWrite from './pages/admin/NoticeWrite';
import AdminNoticeDetail from './pages/admin/NoticeDetail';
import AdminNoticeEdit from './pages/admin/NoticeEdit';
import AdminQnaList from './pages/admin/QnaList';
import AdminQnaDetail from './pages/admin/QnaDetail';
import AdminReviewList from './pages/admin/ReviewList';

// ProtectedRoute 컴포넌트 - 관리자는 role로만 구분 (로그인 불필요)
const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  
  // 관리자 페이지는 인증 채크 없이 바로 통과
  if (requireAdmin) {
    return children;
  }
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && (!user || user.role !== 0)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// App 내부 컴포넌트 (Provider 내부에서 useDispatch 사용)
const AppContent = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // 앱 시작 시 localStorage에서 토큰과 사용자 정보 확인하여 인증 상태 초기화
    const accessToken = localStorage.getItem('accessToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (accessToken && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        // Redux store에 로그인 상태 복원
        dispatch(initializeAuth());
        console.log('로그인 상태 복원됨:', user);
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        // 잘못된 데이터면 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
      }
    }
  }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        {/* 사용자 페이지 */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          
          {/* 상품 */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/category/:category" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          
          {/* 장바구니 */}
          <Route 
            path="cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          
          {/* 주문 */}
          <Route 
            path="order" 
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            } 
          />
          
          {/* 마이페이지 */}
          <Route 
            path="mypage" 
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="mypage/info" 
            element={
              <ProtectedRoute>
                <MyInfo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="mypage/orders" 
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } 
          />
          
          {/* 게시판 */}
          <Route path="notice" element={<NoticeList />} />
          <Route path="notice/:id" element={<NoticeDetail />} />
          
          <Route path="qna" element={<QnaList />} />
          <Route path="qna/:id" element={<QnaDetail />} />
          <Route 
            path="qna/write" 
            element={
              <ProtectedRoute>
                <QnaWrite />
              </ProtectedRoute>
            } 
          />
          
          <Route path="review" element={<ReviewList />} />
          <Route path="review/:id" element={<ReviewDetail />} />
        </Route>
        
        {/* 관리자 페이지 - 인증 불필요 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* 회원 관리 */}
          <Route path="users" element={<AdminUserList />} />
          
          {/* 상품 관리 */}
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/create" element={<AdminProductCreate />} />
          <Route path="products/:id/edit" element={<AdminProductEdit />} />
          
          {/* 주문 관리 */}
          <Route path="orders" element={<AdminOrderList />} />
          
          {/* 게시판 관리 */}
          <Route path="notices" element={<AdminNoticeList />} />
          <Route path="notices/write" element={<AdminNoticeWrite />} />
          <Route path="notices/:id" element={<AdminNoticeDetail />} />
          <Route path="notices/edit/:id" element={<AdminNoticeEdit />} />
          
          <Route path="qna" element={<AdminQnaList />} />
          <Route path="qna/:id" element={<AdminQnaDetail />} />
          
          <Route path="review" element={<AdminReviewList />} />
        </Route>
        
        {/* 404 페이지 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// 메인 App 컴포넌트
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
