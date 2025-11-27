import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../store/slices/userSlice";

const NaverCallbackPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  console.log("=== NaverCallbackPage 렌더링 ===");
  console.log("현재 URL:", window.location.href);
  console.log("location:", location);

  useEffect(() => {
    console.log("=== NaverCallbackPage useEffect 실행 ===");

    const handleNaverCallback = async () => {
      // URL에서 파라미터 추출
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const savedState = sessionStorage.getItem("naverState");

      console.log("code:", code);
      console.log("state:", state);
      console.log("savedState:", savedState);

      // 검증
      if (!code || !state) {
        console.error("code 또는 state가 없습니다!");
        alert("네이버 로그인 실패: 인증 코드가 없습니다.");
        navigate("/login");
        return;
      }

      if (state !== savedState) {
        console.error("state 불일치!");
        alert("네이버 로그인 실패: state 검증 실패");
        navigate("/login");
        return;
      }

      try {
        console.log("백엔드 API 호출 시작...");

        const backendUrl = `http://localhost:8080/api/auth/naver/callback?code=${code}&state=${state}`;
        console.log("호출 URL:", backendUrl);

        const response = await fetch(backendUrl, {
          method: "GET",
          credentials: "include",
        });

        console.log("응답 상태:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("응답 데이터:", data);

        if (data.success && data.accessToken) {
          console.log("=== 네이버 로그인 성공 ===");
          console.log("accessToken:", data.accessToken);
          console.log("user:", data.user);

          // Redux store 업데이트
          dispatch(
            login({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              user: data.user,
            })
          );

          console.log("Redux dispatch 완료");

          // state 값 삭제
          sessionStorage.removeItem("naverState");

          // 메인 페이지로 바로 이동
          window.location.href = "/";
        } else {
          console.error("로그인 실패:", data.message);
          alert("네이버 로그인 실패: " + (data.message || "알 수 없는 오류"));
          navigate("/login");
        }
      } catch (error) {
        console.error("네이버 로그인 처리 중 오류:", error);
        alert("네이버 로그인 처리 중 오류: " + error.message);
        navigate("/login");
      }
    };

    handleNaverCallback();
  }, [navigate, dispatch]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #03C75A",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        ></div>
        <h2 style={{ marginBottom: "10px", color: "#333" }}>
          네이버 로그인 처리 중...
        </h2>
        <p style={{ color: "#666", fontSize: "14px" }}>잠시만 기다려주세요.</p>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default NaverCallbackPage;
