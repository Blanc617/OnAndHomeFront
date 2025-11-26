import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(userId, onMessageCallback, onConnectCallback) {
    console.log('🔌 WebSocket 연결 시도:', userId);
    
    // 이미 연결되어 있으면 재연결하지 않음
    if (this.connected) {
      console.log('WebSocket이 이미 연결되어 있습니다.');
      return;
    }
    
    if (!userId) {
      console.error('❌ userId가 없어서 WebSocket 연결을 할 수 없습니다');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {},
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log('WebSocket 연결 성공:', frame);
      this.connected = true;
      this.reconnectAttempts = 0;

      // 사용자별 알림 구독
      const subscription = this.client.subscribe(
        `/user/${userId}/queue/notifications`,
        (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('알림 수신:', notification);
            onMessageCallback(notification);
          } catch (error) {
            console.error('알림 파싱 에러:', error);
          }
        }
      );

      this.subscriptions.push(subscription);

      if (onConnectCallback) {
        onConnectCallback();
      }
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP 에러:', frame.headers['message']);
      console.error('추가 정보:', frame.body);
      this.connected = false;
    };

    this.client.onWebSocketClose = (event) => {
      console.log('WebSocket 연결 종료:', event);
      this.connected = false;

      // 재연결 시도
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
        setTimeout(() => {
          this.connect(userId, onMessageCallback, onConnectCallback);
        }, this.reconnectDelay);
      } else {
        console.error('최대 재연결 시도 횟수를 초과했습니다.');
      }
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client && this.connected) {
      // 모든 구독 해제
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions = [];

      this.client.deactivate();
      this.connected = false;
      console.log('WebSocket 연결 해제');
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();
