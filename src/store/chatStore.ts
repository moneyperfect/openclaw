import { create } from 'zustand';
import {
    Session,
    Message,
    getSessions,
    saveSessions,
    getMessages,
    saveMessages,
    generateId,
    getTheme,
    saveTheme,
} from '../lib/storage';
import { getAdapter } from '../lib/gatewayClient';
import toast from 'react-hot-toast';

interface ChatState {
    // Data
    sessions: Session[];
    activeSessionId: string | null;
    messages: Message[];

    // UI State
    isMobileView: boolean;
    isLoading: boolean;
    theme: 'dark' | 'light';
    searchQuery: string;

    // Actions
    initialize: () => void;
    setMobileView: (isMobile: boolean) => void;
    setActiveSession: (sessionId: string | null) => void;
    sendMessage: (text: string) => Promise<void>;
    toggleTheme: () => void;
    setSearchQuery: (query: string) => void;
    createNewSession: () => void;
    clearSession: (sessionId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    // Initial state
    sessions: [],
    activeSessionId: null,
    messages: [],
    isMobileView: window.innerWidth < 768,
    isLoading: false,
    theme: getTheme(),
    searchQuery: '',

    // Initialize app state
    initialize: () => {
        const sessions = getSessions();
        const theme = getTheme();

        // Apply theme to document
        saveTheme(theme);

        set({ sessions, theme });

        // Set up resize listener
        const handleResize = () => {
            set({ isMobileView: window.innerWidth < 768 });
        };
        window.addEventListener('resize', handleResize);
    },

    // Set mobile view state
    setMobileView: (isMobile) => {
        set({ isMobileView: isMobile });
    },

    // Select a session
    setActiveSession: (sessionId) => {
        if (sessionId) {
            const messages = getMessages(sessionId);

            // Clear unread count
            const { sessions } = get();
            const updatedSessions = sessions.map(s =>
                s.id === sessionId ? { ...s, unreadCount: 0 } : s
            );
            saveSessions(updatedSessions);

            set({
                activeSessionId: sessionId,
                messages,
                sessions: updatedSessions,
            });
        } else {
            set({ activeSessionId: null, messages: [] });
        }
    },

    // Send a message
    sendMessage: async (text) => {
        const { activeSessionId, messages, sessions } = get();
        if (!activeSessionId || !text.trim()) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: text.trim(),
            timestamp: Date.now(),
            status: 'sending',
        };

        // Add user message immediately
        const updatedMessages = [...messages, userMessage];
        set({ messages: updatedMessages, isLoading: true });

        // Update session's last message
        const updatedSessions = sessions.map(s =>
            s.id === activeSessionId
                ? { ...s, lastMessage: text.trim(), updatedAt: Date.now() }
                : s
        );
        set({ sessions: updatedSessions });
        saveSessions(updatedSessions);

        // Mark user message as sent
        const sentMessages = updatedMessages.map(m =>
            m.id === userMessage.id ? { ...m, status: 'sent' as const } : m
        );
        set({ messages: sentMessages });
        saveMessages(activeSessionId, sentMessages);

        try {
            // Call gateway
            const adapter = getAdapter();
            const response = await adapter.sendMessage(activeSessionId, text.trim());

            // Create assistant message
            const assistantMessage: Message = {
                id: generateId(),
                role: 'assistant',
                content: response,
                timestamp: Date.now(),
                status: 'sent',
            };

            // Add assistant message
            const finalMessages = [...sentMessages, assistantMessage];
            set({ messages: finalMessages, isLoading: false });
            saveMessages(activeSessionId, finalMessages);

            // Update session's last message to assistant response
            const finalSessions = get().sessions.map(s =>
                s.id === activeSessionId
                    ? { ...s, lastMessage: response.substring(0, 50), updatedAt: Date.now() }
                    : s
            );
            set({ sessions: finalSessions });
            saveSessions(finalSessions);

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '发送失败，请重试';
            toast.error(errorMsg);

            // Mark user message as error
            const errorMessages = sentMessages.map(m =>
                m.id === userMessage.id ? { ...m, status: 'error' as const } : m
            );
            set({ messages: errorMessages, isLoading: false });
            saveMessages(activeSessionId, errorMessages);
        }
    },

    // Toggle theme
    toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        saveTheme(newTheme);
        set({ theme: newTheme });
    },

    // Search
    setSearchQuery: (query) => {
        set({ searchQuery: query });
    },

    // Create new session
    createNewSession: () => {
        const { sessions } = get();
        const newSession: Session = {
            id: generateId(),
            title: `新对话 ${sessions.length + 1}`,
            avatar: '💬',
            lastMessage: '',
            updatedAt: Date.now(),
            unreadCount: 0,
            online: true,
        };

        const updatedSessions = [newSession, ...sessions];
        set({ sessions: updatedSessions });
        saveSessions(updatedSessions);

        // Select the new session
        get().setActiveSession(newSession.id);
    },

    // Clear session messages
    clearSession: (sessionId) => {
        saveMessages(sessionId, []);
        if (get().activeSessionId === sessionId) {
            set({ messages: [] });
        }

        const { sessions } = get();
        const updatedSessions = sessions.map(s =>
            s.id === sessionId ? { ...s, lastMessage: '' } : s
        );
        set({ sessions: updatedSessions });
        saveSessions(updatedSessions);

        toast.success('对话已清空');
    },
}));
