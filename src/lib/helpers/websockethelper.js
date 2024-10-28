export class WebSocketClient {
    constructor(url, token) {
        this.url = url;
        this.token = token;
        this.socket = null;
        this.onMessageCallback = null;
        this.onStatusChangeCallback = null;
    }

    connect() {
        try {
            this.socket = new WebSocket(this.url);
            
            this.socket.addEventListener('open', () => {
                // Send authentication token
                this.socket.send(JSON.stringify({
                    type: 'auth',
                    token: this.token
                }));
                
                this.onStatusChangeCallback?.('connected');
            });

            this.socket.addEventListener('message', (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.onMessageCallback?.(message);
                } catch (error) {
                    console.error("Failed to parse WebSocket message:", error);
                }
            });

            this.socket.addEventListener('close', () => {
                this.onStatusChangeCallback?.('disconnected');
            });

            this.socket.addEventListener('error', () => {
                this.onStatusChangeCallback?.('error');
            });
        } catch (error) {
            console.error('WebSocket connection error:', error);
            this.onStatusChangeCallback?.('error');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    sendMessage(message) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }

    onMessage(callback) {
        this.onMessageCallback = callback;
    }

    onStatusChange(callback) {
        this.onStatusChangeCallback = callback;
    }
}
