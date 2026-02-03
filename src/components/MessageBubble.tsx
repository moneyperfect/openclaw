import { Message } from '../lib/storage';
import { formatMessageTime } from '../lib/storage';
import { Check, CheckCheck, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
    message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    // Render content with basic markdown support
    const renderContent = (content: string) => {
        // Simple code block detection
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(content)) !== null) {
            // Add text before code block
            if (match.index > lastIndex) {
                parts.push(
                    <span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>
                );
            }

            // Add code block
            const language = match[1] || 'code';
            const code = match[2];
            parts.push(
                <pre
                    key={match.index}
                    className="
            mt-2 mb-2 p-3
            bg-black/20
            rounded-lg
            overflow-x-auto
            text-sm font-mono
          "
                >
                    <div className="text-xs text-telegram-text-muted mb-2 uppercase">
                        {language}
                    </div>
                    <code className="text-telegram-text-primary">{code}</code>
                </pre>
            );

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < content.length) {
            parts.push(<span key={lastIndex}>{content.slice(lastIndex)}</span>);
        }

        return parts.length > 0 ? parts : content;
    };

    // Status icon
    const StatusIcon = () => {
        if (!isUser) return null;

        switch (message.status) {
            case 'sending':
                return <Check size={14} className="text-telegram-text-muted" />;
            case 'sent':
                return <CheckCheck size={14} className="text-telegram-accent-blue" />;
            case 'error':
                return <AlertCircle size={14} className="text-red-400" />;
            default:
                return null;
        }
    };

    return (
        <div
            className={`
        flex
        ${isUser ? 'justify-end' : 'justify-start'}
        animate-bubble-pop
      `}
        >
            <div
                className={`
          relative
          max-w-[85%] md:max-w-[70%]
          px-3.5 py-2
          rounded-2xl
          shadow-bubble
          ${isUser
                        ? 'bg-telegram-bubble-sent rounded-br-md'
                        : 'bg-telegram-bubble-received rounded-bl-md'
                    }
        `}
            >
                {/* Message content */}
                <div
                    className={`
            text-sm leading-relaxed whitespace-pre-wrap break-words
            ${isUser ? 'text-white' : 'text-telegram-text-primary'}
          `}
                >
                    {renderContent(message.content)}
                </div>

                {/* Timestamp and status */}
                <div
                    className={`
            flex items-center justify-end gap-1
            mt-1
            text-[11px]
            ${isUser ? 'text-white/60' : 'text-telegram-text-muted'}
          `}
                >
                    <span>{formatMessageTime(message.timestamp)}</span>
                    <StatusIcon />
                </div>

                {/* Bubble tail */}
                <div
                    className={`
            absolute bottom-0
            w-3 h-3
            ${isUser ? 'right-[-6px]' : 'left-[-6px]'}
            ${isUser ? 'bg-telegram-bubble-sent' : 'bg-telegram-bubble-received'}
          `}
                    style={{
                        clipPath: isUser
                            ? 'polygon(0 0, 0 100%, 100% 100%)'
                            : 'polygon(100% 0, 0 100%, 100% 100%)',
                    }}
                />
            </div>
        </div>
    );
}
