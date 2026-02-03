import { useMemo } from 'react';
import { Search, Plus, Moon, Sun, Settings } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { formatTime } from '../lib/storage';

export default function ChatList() {
    const {
        sessions,
        activeSessionId,
        searchQuery,
        theme,
        setActiveSession,
        setSearchQuery,
        toggleTheme,
        createNewSession,
    } = useChatStore();

    // Filter sessions by search query
    const filteredSessions = useMemo(() => {
        if (!searchQuery) return sessions;
        const query = searchQuery.toLowerCase();
        return sessions.filter(
            (s) =>
                s.title.toLowerCase().includes(query) ||
                s.lastMessage.toLowerCase().includes(query)
        );
    }, [sessions, searchQuery]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-telegram-border">
                <h1 className="text-lg font-semibold text-telegram-text-primary">
                    消息
                </h1>
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-telegram-bg-hover transition-colors"
                        title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
                    >
                        {theme === 'dark' ? (
                            <Sun size={20} className="text-telegram-text-secondary" />
                        ) : (
                            <Moon size={20} className="text-telegram-text-secondary" />
                        )}
                    </button>

                    {/* New chat button */}
                    <button
                        onClick={createNewSession}
                        className="p-2 rounded-full hover:bg-telegram-bg-hover transition-colors"
                        title="新建对话"
                    >
                        <Plus size={20} className="text-telegram-accent-blue" />
                    </button>

                    {/* Settings (placeholder) */}
                    <button
                        className="p-2 rounded-full hover:bg-telegram-bg-hover transition-colors"
                        title="设置"
                    >
                        <Settings size={20} className="text-telegram-text-secondary" />
                    </button>
                </div>
            </header>

            {/* Search bar */}
            <div className="px-3 py-2">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-telegram-text-muted"
                    />
                    <input
                        type="text"
                        placeholder="搜索"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
              w-full
              pl-10 pr-4 py-2.5
              bg-telegram-bg-tertiary
              text-telegram-text-primary
              placeholder:text-telegram-text-muted
              rounded-xl
              border-none
              outline-none
              focus:ring-2 focus:ring-telegram-accent-blue/30
              transition-all
            "
                    />
                </div>
            </div>

            {/* Session list */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                {filteredSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-telegram-text-muted">
                        <p className="text-sm">
                            {searchQuery ? '没有找到匹配的对话' : '暂无对话'}
                        </p>
                    </div>
                ) : (
                    <ul className="py-1">
                        {filteredSessions.map((session) => (
                            <li key={session.id}>
                                <button
                                    onClick={() => setActiveSession(session.id)}
                                    className={`
                    w-full
                    flex items-center gap-3
                    px-4 py-3
                    text-left
                    transition-all duration-150
                    ${activeSessionId === session.id
                                            ? 'bg-telegram-accent-blue/20'
                                            : 'hover:bg-telegram-bg-hover'
                                        }
                  `}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`
                      relative
                      w-12 h-12
                      flex items-center justify-center
                      rounded-full
                      text-2xl
                      bg-gradient-to-br from-telegram-accent-blue to-telegram-accent-purple
                      shadow-telegram
                      flex-shrink-0
                    `}
                                    >
                                        <span>{session.avatar}</span>
                                        {/* Online indicator */}
                                        {session.online && (
                                            <span
                                                className="
                          absolute bottom-0.5 right-0.5
                          w-3 h-3
                          bg-telegram-accent-green
                          rounded-full
                          border-2 border-telegram-bg-secondary
                        "
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className="font-medium text-telegram-text-primary truncate">
                                                {session.title}
                                            </h3>
                                            <span className="text-xs text-telegram-text-muted flex-shrink-0 ml-2">
                                                {formatTime(session.updatedAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-telegram-text-secondary truncate pr-2">
                                                {session.lastMessage || '暂无消息'}
                                            </p>
                                            {/* Unread badge */}
                                            {session.unreadCount > 0 && (
                                                <span
                                                    className="
                            flex-shrink-0
                            min-w-5 h-5
                            flex items-center justify-center
                            px-1.5
                            text-xs font-medium
                            text-white
                            bg-telegram-accent-blue
                            rounded-full
                          "
                                                >
                                                    {session.unreadCount > 99 ? '99+' : session.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer */}
            <footer className="px-4 py-2 border-t border-telegram-border">
                <p className="text-xs text-center text-telegram-text-muted">
                    OpenClaw Mini · v0.1.0
                </p>
            </footer>
        </div>
    );
}
