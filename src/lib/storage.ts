// Types for sessions and messages

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    status: 'sending' | 'sent' | 'error';
}

export interface Session {
    id: string;
    title: string;
    avatar: string;
    lastMessage: string;
    updatedAt: number;
    unreadCount: number;
    online?: boolean;
}

// Storage keys
const SESSIONS_KEY = 'openclaw_sessions';
const MESSAGES_PREFIX = 'openclaw_messages_';
const THEME_KEY = 'openclaw_theme';

// Demo data
const DEMO_SESSIONS: Session[] = [
    {
        id: 'demo-1',
        title: 'OpenClaw Assistant',
        avatar: '🤖',
        lastMessage: '有什么我可以帮助你的吗？',
        updatedAt: Date.now() - 1000 * 60 * 5,
        unreadCount: 0,
        online: true,
    },
    {
        id: 'demo-2',
        title: '代码助手',
        avatar: '💻',
        lastMessage: '我可以帮你分析代码和解决编程问题。',
        updatedAt: Date.now() - 1000 * 60 * 60,
        unreadCount: 2,
        online: true,
    },
    {
        id: 'demo-3',
        title: '创意写作',
        avatar: '✨',
        lastMessage: '让我们一起创作精彩的内容吧！',
        updatedAt: Date.now() - 1000 * 60 * 60 * 24,
        unreadCount: 0,
        online: false,
    },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
    'demo-1': [
        {
            id: 'msg-1-1',
            role: 'assistant',
            content: '你好！我是 OpenClaw Assistant，有什么我可以帮助你的吗？',
            timestamp: Date.now() - 1000 * 60 * 10,
            status: 'sent',
        },
        {
            id: 'msg-1-2',
            role: 'user',
            content: '你好，请介绍一下你自己。',
            timestamp: Date.now() - 1000 * 60 * 8,
            status: 'sent',
        },
        {
            id: 'msg-1-3',
            role: 'assistant',
            content: '我是一个基于大语言模型的AI助手，通过 OpenClaw Gateway 提供服务。我可以帮助你回答问题、分析代码、撰写文档，以及进行各种创意任务。有什么我可以帮助你的吗？',
            timestamp: Date.now() - 1000 * 60 * 5,
            status: 'sent',
        },
    ],
    'demo-2': [
        {
            id: 'msg-2-1',
            role: 'assistant',
            content: '欢迎来到代码助手频道！我专注于帮助你解决编程问题。',
            timestamp: Date.now() - 1000 * 60 * 120,
            status: 'sent',
        },
        {
            id: 'msg-2-2',
            role: 'user',
            content: '帮我写一个 React Hook 用于获取窗口尺寸。',
            timestamp: Date.now() - 1000 * 60 * 65,
            status: 'sent',
        },
        {
            id: 'msg-2-3',
            role: 'assistant',
            content: '```typescript\nimport { useState, useEffect } from \'react\';\n\nexport function useWindowSize() {\n  const [size, setSize] = useState({\n    width: window.innerWidth,\n    height: window.innerHeight,\n  });\n\n  useEffect(() => {\n    const handleResize = () => {\n      setSize({\n        width: window.innerWidth,\n        height: window.innerHeight,\n      });\n    };\n\n    window.addEventListener(\'resize\', handleResize);\n    return () => window.removeEventListener(\'resize\', handleResize);\n  }, []);\n\n  return size;\n}\n```\n\n这个 Hook 会在窗口大小变化时自动更新，并返回当前的宽度和高度。',
            timestamp: Date.now() - 1000 * 60 * 60,
            status: 'sent',
        },
    ],
    'demo-3': [
        {
            id: 'msg-3-1',
            role: 'assistant',
            content: '嗨！我是你的创意写作伙伴。无论是故事、诗歌还是文案，我都可以帮你！',
            timestamp: Date.now() - 1000 * 60 * 60 * 25,
            status: 'sent',
        },
        {
            id: 'msg-3-2',
            role: 'user',
            content: '帮我写一首关于月光的短诗。',
            timestamp: Date.now() - 1000 * 60 * 60 * 24.5,
            status: 'sent',
        },
        {
            id: 'msg-3-3',
            role: 'assistant',
            content: '《月影》\n\n银辉洒落窗前，\n如水般温柔缠绵。\n星子在夜空眨眼，\n月光编织着梦的边缘。\n\n轻轻地，轻轻地，\n一抹清辉落在书页间。\n岁月在此刻静止，\n只有月光还在流转。',
            timestamp: Date.now() - 1000 * 60 * 60 * 24,
            status: 'sent',
        },
    ],
};

// Check if this is the first load
function isFirstLoad(): boolean {
    return localStorage.getItem(SESSIONS_KEY) === null;
}

// Initialize with demo data if first load
function initializeDemoData(): void {
    if (isFirstLoad()) {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(DEMO_SESSIONS));
        Object.entries(DEMO_MESSAGES).forEach(([sessionId, messages]) => {
            localStorage.setItem(MESSAGES_PREFIX + sessionId, JSON.stringify(messages));
        });
    }
}

// Get all sessions
export function getSessions(): Session[] {
    initializeDemoData();
    try {
        const data = localStorage.getItem(SESSIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// Save sessions
export function saveSessions(sessions: Session[]): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

// Get messages for a session
export function getMessages(sessionId: string): Message[] {
    initializeDemoData();
    try {
        const data = localStorage.getItem(MESSAGES_PREFIX + sessionId);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// Save messages for a session
export function saveMessages(sessionId: string, messages: Message[]): void {
    localStorage.setItem(MESSAGES_PREFIX + sessionId, JSON.stringify(messages));
}

// Get theme preference
export function getTheme(): 'dark' | 'light' {
    const theme = localStorage.getItem(THEME_KEY);
    return theme === 'light' ? 'light' : 'dark';
}

// Save theme preference
export function saveTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
}

// Generate unique ID
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Create a new session
export function createSession(title: string, avatar: string = '💬'): Session {
    return {
        id: generateId(),
        title,
        avatar,
        lastMessage: '',
        updatedAt: Date.now(),
        unreadCount: 0,
        online: true,
    };
}

// Format timestamp
export function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;

    // Today: show time
    if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getDate() === yesterday.getDate()) {
        return '昨天';
    }

    // This week: show day name
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return days[date.getDay()];
    }

    // Older: show date
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
}

// Format message time (always show time)
export function formatMessageTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
