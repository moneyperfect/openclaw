// Gateway Client - Abstraction layer for OpenClaw Gateway API

// Configuration from environment
const config = {
    baseUrl: import.meta.env.VITE_OPENCLAW_BASE_URL || 'http://127.0.0.1:18789',
    token: import.meta.env.VITE_OPENCLAW_TOKEN || '',
    useFakeAdapter: import.meta.env.VITE_USE_FAKE_ADAPTER === 'true',
    chatEndpoint: import.meta.env.VITE_CHAT_ENDPOINT || '/api/chat',
};

// Gateway adapter interface
export interface GatewayAdapter {
    sendMessage(sessionId: string, text: string): Promise<string>;
    abortRequest?(): void;
}

// Fake adapter for development/testing
class FakeAdapter implements GatewayAdapter {
    private responses = [
        '我明白你的意思了。让我来帮你分析一下...',
        '这是一个很好的问题！根据我的理解...',
        '当然可以！以下是我的建议：\n\n1. 首先确定目标\n2. 制定计划\n3. 逐步执行\n4. 及时调整',
        '感谢你的提问。这个话题很有趣，让我详细解释一下...',
        '好的，我来帮你处理这个问题。根据你提供的信息，我认为最好的方案是...',
        '这个功能正在开发中，但我可以给你一些建议来实现类似的效果。',
        '我理解你的需求。这里有几个可行的解决方案供你参考：\n\n**方案一**：使用现有工具\n**方案二**：自定义开发\n**方案三**：混合方案',
    ];

    async sendMessage(_sessionId: string, text: string): Promise<string> {
        // Simulate network delay (800ms - 2000ms)
        const delay = 800 + Math.random() * 1200;
        await new Promise(resolve => setTimeout(resolve, delay));

        // 10% chance to simulate an error
        if (Math.random() < 0.1) {
            throw new Error('模拟网络错误：请稍后重试');
        }

        // If message is a greeting, respond accordingly
        const greetings = ['你好', '嗨', 'hi', 'hello', '早上好', '晚上好'];
        const isGreeting = greetings.some(g => text.toLowerCase().includes(g.toLowerCase()));

        if (isGreeting) {
            const greetingResponses = [
                '你好！很高兴见到你。有什么我可以帮助你的吗？',
                '嗨！今天想聊些什么呢？',
                '你好呀！我是 OpenClaw Assistant，随时为你服务。',
            ];
            return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
        }

        // Return a random response
        return this.responses[Math.floor(Math.random() * this.responses.length)];
    }
}

// HTTP adapter for real API calls
class HttpAdapter implements GatewayAdapter {
    private abortController: AbortController | null = null;

    async sendMessage(sessionId: string, text: string): Promise<string> {
        this.abortController = new AbortController();

        const url = new URL(config.chatEndpoint, config.baseUrl);
        url.searchParams.set('token', config.token);

        try {
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.token}`,
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    message: text,
                }),
                signal: this.abortController.signal,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Token 无效或已过期，请检查配置');
                }
                if (response.status === 404) {
                    throw new Error('API 端点不存在，请检查 VITE_CHAT_ENDPOINT 配置');
                }
                throw new Error(`请求失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // TODO: Adjust based on actual API response format
            // Common patterns:
            // - data.message
            // - data.content
            // - data.response
            // - data.text
            return data.message || data.content || data.response || data.text || JSON.stringify(data);

        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('请求已取消');
            }
            if (error instanceof TypeError) {
                throw new Error('无法连接到 Gateway，请确保服务正在运行');
            }
            throw error;
        }
    }

    abortRequest(): void {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }
}

// WebSocket adapter (optional, for real-time communication)
class WsAdapter implements GatewayAdapter {
    private ws: WebSocket | null = null;
    private messageResolvers: Map<string, (value: string) => void> = new Map();

    private connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            const wsUrl = config.baseUrl.replace('http', 'ws');
            const url = new URL(wsUrl);
            url.searchParams.set('token', config.token);

            this.ws = new WebSocket(url.toString());

            this.ws.onopen = () => resolve();
            this.ws.onerror = () => reject(new Error('WebSocket 连接失败'));

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // TODO: Adjust based on actual WS message format
                    const requestId = data.request_id || data.id;
                    const resolver = this.messageResolvers.get(requestId);
                    if (resolver) {
                        resolver(data.message || data.content || data.response);
                        this.messageResolvers.delete(requestId);
                    }
                } catch {
                    console.error('Failed to parse WebSocket message');
                }
            };

            this.ws.onclose = () => {
                this.ws = null;
            };
        });
    }

    async sendMessage(sessionId: string, text: string): Promise<string> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            await this.connect();
        }

        return new Promise((resolve, reject) => {
            const requestId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

            const timeout = setTimeout(() => {
                this.messageResolvers.delete(requestId);
                reject(new Error('请求超时'));
            }, 30000);

            this.messageResolvers.set(requestId, (value) => {
                clearTimeout(timeout);
                resolve(value);
            });

            this.ws!.send(JSON.stringify({
                request_id: requestId,
                session_id: sessionId,
                message: text,
            }));
        });
    }
}

// Export the appropriate adapter based on configuration
function createAdapter(): GatewayAdapter {
    if (config.useFakeAdapter) {
        console.log('[GatewayClient] Using FakeAdapter (mock mode)');
        return new FakeAdapter();
    }

    console.log('[GatewayClient] Using HttpAdapter:', config.baseUrl);
    return new HttpAdapter();
}

// Singleton adapter instance
let adapterInstance: GatewayAdapter | null = null;

export function getAdapter(): GatewayAdapter {
    if (!adapterInstance) {
        adapterInstance = createAdapter();
    }
    return adapterInstance;
}

// For testing: switch adapter at runtime
export function setAdapter(adapter: GatewayAdapter): void {
    adapterInstance = adapter;
}

// Export individual adapters for manual use
export { FakeAdapter, HttpAdapter, WsAdapter };

// Export config for debugging
export { config as gatewayConfig };
