import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export default function InputBar() {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { sendMessage, isLoading, activeSessionId } = useChatStore();

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
        // Enter to send, Shift+Enter for newline
        if (e.key === 'Enter' && !e.shiftKey) {
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
        const newHeight = Math.min(target.scrollHeight, 200);
        target.style.height = `${newHeight}px`;
    };

    const canSend = text.trim() && !isLoading && activeSessionId;

    return (
        <div className="border-t border-telegram-border bg-telegram-bg-secondary/80 backdrop-blur-sm">
            <div className="flex items-end gap-2 px-3 py-2">
                {/* Attachment button (placeholder) */}
                <button
                    className="
            p-2.5
            text-telegram-text-muted
            hover:text-telegram-text-secondary
            hover:bg-telegram-bg-hover
            rounded-full
            transition-colors
            flex-shrink-0
          "
                    title="附件"
                >
                    <Paperclip size={22} />
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
              py-2.5 px-4
              bg-telegram-bg-tertiary
              text-telegram-text-primary
              placeholder:text-telegram-text-muted
              rounded-2xl
              border-none
              outline-none
              resize-none
              max-h-[200px]
              focus:ring-2 focus:ring-telegram-accent-blue/20
              transition-all
              disabled:opacity-50
            "
                        style={{ height: 'auto', minHeight: '44px' }}
                    />
                </div>

                {/* Emoji button (placeholder) */}
                <button
                    className="
            p-2.5
            text-telegram-text-muted
            hover:text-telegram-text-secondary
            hover:bg-telegram-bg-hover
            rounded-full
            transition-colors
            flex-shrink-0
          "
                    title="表情"
                >
                    <Smile size={22} />
                </button>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className={`
            p-2.5
            rounded-full
            transition-all duration-200
            flex-shrink-0
            ${canSend
                            ? 'bg-telegram-accent-blue text-white hover:bg-telegram-accent-blue/90 scale-100'
                            : 'bg-telegram-bg-tertiary text-telegram-text-muted cursor-not-allowed scale-95'
                        }
          `}
                    title="发送"
                >
                    <Send size={20} className={canSend ? 'translate-x-0.5' : ''} />
                </button>
            </div>

            {/* Hint text */}
            <div className="px-4 pb-2 -mt-1">
                <p className="text-[10px] text-telegram-text-muted text-center">
                    Enter 发送 · Shift+Enter 换行
                </p>
            </div>
        </div>
    );
}
