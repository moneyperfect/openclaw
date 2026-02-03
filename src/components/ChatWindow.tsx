import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, MoreVertical, Trash2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow() {
    const {
        sessions,
        activeSessionId,
        messages,
        isLoading,
        isMobileView,
        setActiveSession,
        clearSession,
    } = useChatStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    // Get active session data
    const activeSession = sessions.find((s) => s.id === activeSessionId);

    // Auto-scroll to bottom when new messages arrive (only if user is near bottom)
    useEffect(() => {
        if (isNearBottom && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading, isNearBottom]);

    // Check if user is near bottom of messages
    const handleScroll = useCallback(() => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            setIsNearBottom(distanceFromBottom < 100);
        }
    }, []);

    // Handle back button (mobile)
    const handleBack = () => {
        setActiveSession(null);
    };

    // Handle clear chat
    const handleClear = () => {
        if (activeSessionId) {
            clearSession(activeSessionId);
            setShowMenu(false);
        }
    };

    // Empty state when no session selected
    if (!activeSession) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-telegram-text-muted">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-xl font-medium mb-2">欢迎使用 OpenClaw Mini</h2>
                <p className="text-sm">选择一个对话开始聊天</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <header className="flex items-center gap-3 px-4 py-3 border-b border-telegram-border bg-telegram-bg-secondary/50 backdrop-blur-sm">
                {/* Back button (mobile only) */}
                {isMobileView && (
                    <button
                        onClick={handleBack}
                        className="p-1.5 -ml-1 rounded-full hover:bg-telegram-bg-hover transition-colors"
                    >
                        <ArrowLeft size={22} className="text-telegram-accent-blue" />
                    </button>
                )}

                {/* Avatar */}
                <div
                    className="
            w-10 h-10
            flex items-center justify-center
            rounded-full
            text-xl
            bg-gradient-to-br from-telegram-accent-blue to-telegram-accent-purple
            shadow-telegram
          "
                >
                    {activeSession.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-telegram-text-primary truncate">
                        {activeSession.title}
                    </h2>
                    <p className="text-xs text-telegram-text-secondary">
                        {activeSession.online ? (
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-telegram-accent-green" />
                                在线
                            </span>
                        ) : (
                            '离线'
                        )}
                    </p>
                </div>

                {/* Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-full hover:bg-telegram-bg-hover transition-colors"
                    >
                        <MoreVertical size={20} className="text-telegram-text-secondary" />
                    </button>

                    {/* Dropdown menu */}
                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div
                                className="
                  absolute right-0 top-full mt-1
                  w-48
                  bg-telegram-bg-tertiary
                  rounded-xl
                  shadow-lg
                  border border-telegram-border
                  py-1
                  z-20
                  animate-fade-in
                "
                            >
                                <button
                                    onClick={handleClear}
                                    className="
                    w-full
                    flex items-center gap-3
                    px-4 py-2.5
                    text-left text-sm
                    text-red-400
                    hover:bg-telegram-bg-hover
                    transition-colors
                  "
                                >
                                    <Trash2 size={18} />
                                    清空对话
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Messages area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="
          flex-1
          overflow-y-auto
          px-4 py-4
          space-y-2
          bg-telegram-bg-primary
        "
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-telegram-text-muted">
                        <p className="text-sm">发送消息开始对话</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        {isLoading && <TypingIndicator />}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <InputBar />
        </div>
    );
}
