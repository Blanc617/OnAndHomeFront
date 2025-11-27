import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const useWebSocket = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.log("userId 없음 - 웹소켓 연결 안함");
      return;
    }

    console.log("=== 웹소켓 연결 시작 ===");
    console.log("userId:", userId);

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log("[STOMP DEBUG]", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log("✅ WebSocket 연결 성공");
      console.log("연결 정보:", frame);
      setIsConnected(true);

      // 구독 경로 설정
      const subscriptionPath = `/user/${userId}/queue/notifications`;
      console.log("구독 경로:", subscriptionPath);

      // 개인 알림 구독
      const subscription = client.subscribe(subscriptionPath, (message) => {
        console.log("📩 알림 수신 원본:", message);
        console.log("📩 알림 body:", message.body);

        try {
          const notification = JSON.parse(message.body);
          console.log("📩 파싱된 알림:", notification);
          console.log("📩 알림 타입:", notification.type);
          console.log("📩 QnA ID:", notification.qnaId);
          console.log("📩 상품 ID:", notification.productId);

          setNotifications((prev) => [notification, ...prev]);

          // 브라우저 알림 표시
          showBrowserNotification(notification);
        } catch (error) {
          console.error("알림 파싱 오류:", error);
        }
      });

      console.log("구독 완료:", subscription);
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP 에러:", frame.headers["message"]);
      console.error("상세:", frame.body);
      setIsConnected(false);
    };

    client.onDisconnect = () => {
      console.log("🔌 WebSocket 연결 끊김");
      setIsConnected(false);
    };

    client.onWebSocketError = (error) => {
      console.error("❌ WebSocket 에러:", error);
    };

    try {
      client.activate();
      stompClient.current = client;
      console.log("WebSocket 활성화 완료");
    } catch (error) {
      console.error("WebSocket 활성화 실패:", error);
    }

    return () => {
      console.log("🔌 WebSocket 연결 해제");
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [userId]);

  const showBrowserNotification = (notification) => {
    if (Notification.permission === "granted") {
      const n = new Notification(notification.title || "새 알림", {
        body: notification.message,
        icon: "/logo192.png",
        tag: `notification-${notification.qnaId}`,
      });

      // 알림 클릭 시 해당 상품 페이지로 이동
      n.onclick = () => {
        console.log("🔔 알림 클릭됨");
        console.log("알림 데이터:", notification);
        console.log("알림:", notification.productId);

        // productId가 있으면 해당 상품 페이지로 이동
        if (notification.productId) {
          const targetUrl = `/products/${notification.productId}`;
          console.log("✅ 이동할 URL:", targetUrl);
          window.focus();
          window.location.href = targetUrl;
        } else {
          console.warn("⚠️ productId가 없습니다:", notification);
        }
      };
    }
  };

  return { notifications, isConnected, setNotifications };
};
