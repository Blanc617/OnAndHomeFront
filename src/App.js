import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import store from './store';
import { initializeAuth } from './store/slices/userSlice';

// 레이아웃
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';

// 사용자 페이지
import Cart from './pages/user/Cart';
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import MyInfo from './pages/user/MyInfo';
import MyOrders from './pages/user/MyOrders';
import MyPage from './pages/user/MyPage';
import Order from './pages/user/Order';
import OrderComplete from './pages/user/OrderComplete';
import OrderPayment from './pages/user/OrderPayment';
import ProductDetail from './pages/user/ProductDetail';
import ProductList from './pages/user/ProductList';
import Signup from './pages/user/Signup';

// 공지사항, Q&A, 리뷰
import NoticeDetail from './pages/user/board/NoticeDetail';
import NoticeList from './pages/user/board/NoticeList';
import QnaDetail from './pages/user/board/QnaDetail';
import QnaList from './pages/user/board/QnaList';
import QnaWrite from './pages/user/board/QnaWrite';
import ReviewDetail from './pages/user/board/ReviewDetail';
import ReviewList from './pages/user/board/ReviewList';

// 관리자 페이지
import AdminDashboard from './pages/admin/Dashboard';
import AdminNoticeDetail from './pages/admin/NoticeDetail';
import AdminNoticeEdit from './pages/admin/NoticeEdit';
import AdminNoticeList from './pages/admin/NoticeList';
import AdminNoticeWrite from './pages/admin/NoticeWrite';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminOrderList from './pages/admin/OrderList';
import AdminProductCreate from './pages/admin/ProductCreate';
import AdminProductEdit from './pages/admin/ProductEdit';
import AdminProductList from './pages/admin/ProductList';
import AdminQnaDetail from './pages/admin/QnaDetail';
import AdminQnaList from './pages/admin/QnaList';
import AdminReviewList from './pages/admin/ReviewList';
import AdminUserList from './pages/admin/UserList';

// ProtectedRoute 컴포넌트 - 관리자는 role로만 구분 (로그인 분기 제외)
const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  
  // 관리자 페이지는 인증 체크 없이 바로 통과
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
    // 최초 접속 시 localStorage에서 토큰과 사용자 정보 확인하여 인증 상태 초기화
    const accessToken = localStorage.getItem('accessToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (accessToken && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        // Redux store에 로그인 상태 복원
        dispatch(initializeAuth());
        console.log('로그인 상태 복원:', user);
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
          <Route 
            path="user/order-payment" 
            element={
              <ProtectedRoute>
                <OrderPayment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="user/order-complete" 
            element={
              <ProtectedRoute>
                <OrderComplete />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="user/my-orders" 
            element={
              <ProtectedRoute>
                <MyOrders />
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
          
          {/* 게시판 - 공지사항 */}
          <Route path="notices" element={<NoticeList />} />
          <Route path="notices/:id" element={<NoticeDetail />} />
          
          {/* 게시판 - Q&A */}
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
          
          {/* 게시판 - 리뷰 */}
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
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          
          {/* 게시판 관리 */}
          <Route path="notices" element={<AdminNoticeList />} />
          <Route path="notices/write" element={<AdminNoticeWrite />} />
          <Route path="notices/:id" element={<AdminNoticeDetail />} />
          <Route path="notices/edit/:id" element={<AdminNoticeEdit />} />
          
          <Route path="qna" element={<AdminQnaList />} />
          <Route path="qna/:id" element={<AdminQnaDetail />} />
          
          <Route path="reviews" element={<AdminReviewList />} />
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
