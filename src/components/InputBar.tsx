import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export default function InputBar() {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { sendMessage, isLoading, activeSessionId } = useChatStore();

    // Focus input on mount (desktop only)
    useEffect(() => {
        if (textareaRef.current && window.innerWidth >= 768) {
            textareaRef.current.focus();
        }
    }, [activeSessionId]);

    // Handle send
    const handleSend = async () => {
        if (!text.trim() || isLoading || !activeSessionId) return;

        const messageText = text;
        setText('');

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        await sendMessage(messageText);
    };

    // Handle key press
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter to send (desktop), Shift+Enter for newline
        // On mobile, Enter always creates newline
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth >= 768) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-resize textarea
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        setText(target.value);

        // Auto-resize
        target.style.height = 'auto';
        const newHeight = Math.min(target.scrollHeight, 120);
        target.style.height = `${newHeight}px`;
    };

    const canSend = text.trim() && !isLoading && activeSessionId;

    return (
        <div className="border-t border-telegram-border bg-telegram-bg-secondary/80 backdrop-blur-sm safe-area-bottom">
            <div className="flex items-end gap-2 px-3 py-2">
                {/* Attachment button (placeholder) */}
                <button
                    className="
            p-2
            text-telegram-text-muted
            hover:text-telegram-text-secondary
            active:bg-telegram-bg-hover
            rounded-full
            transition-colors
            flex-shrink-0
            touch-manipulation
          "
                    title="附件"
                >
                    <Paperclip size={24} />
                </button>

                {/* Text input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="输入消息..."
                        disabled={isLoading || !activeSessionId}
                        rows={1}
                        className="
              w-full
              py-3 px-4
              bg-telegram-bg-tertiary
              text-telegram-text-primary
              placeholder:text-telegram-text-muted
              rounded-2xl
              border-none
              outline-none
              resize-none
              max-h-[120px]
              text-base
              focus:ring-2 focus:ring-telegram-accent-blue/20
              transition-all
              disabled:opacity-50
              touch-manipulation
            "
                        style={{ height: 'auto', minHeight: '48px' }}
                    />
                </div>

                {/* Emoji button (placeholder) - hidden on small screens to save space */}
                <button
                    className="
            p-2
            text-telegram-text-muted
            hover:text-telegram-text-secondary
            active:bg-telegram-bg-hover
            rounded-full
            transition-colors
            flex-shrink-0
            touch-manipulation
            hidden sm:flex
          "
                    title="表情"
                >
                    <Smile size={24} />
                </button>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className={`
            p-3
            rounded-full
            transition-all duration-200
            flex-shrink-0
            touch-manipulation
            active:scale-95
            ${canSend
                            ? 'bg-telegram-accent-blue text-white'
                            : 'bg-telegram-bg-tertiary text-telegram-text-muted cursor-not-allowed'
                        }
          `}
                    title="发送"
                >
                    <Send size={22} className={canSend ? 'translate-x-0.5' : ''} />
                </button>
            </div>
        </div>
    );
}
