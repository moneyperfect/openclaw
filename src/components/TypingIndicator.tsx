export default function TypingIndicator() {
    return (
        <div className="flex justify-start animate-fade-in">
            <div
                className="
          relative
          px-4 py-3
          bg-telegram-bubble-received
          rounded-2xl rounded-bl-md
          shadow-bubble
        "
            >
                <div className="flex items-center gap-1.5">
                    <div
                        className="
              w-2 h-2
              bg-telegram-text-muted
              rounded-full
              animate-pulse-soft
            "
                        style={{ animationDelay: '0ms' }}
                    />
                    <div
                        className="
              w-2 h-2
              bg-telegram-text-muted
              rounded-full
              animate-pulse-soft
            "
                        style={{ animationDelay: '150ms' }}
                    />
                    <div
                        className="
              w-2 h-2
              bg-telegram-text-muted
              rounded-full
              animate-pulse-soft
            "
                        style={{ animationDelay: '300ms' }}
                    />
                </div>

                {/* Tail */}
                <div
                    className="
            absolute bottom-0 left-[-6px]
            w-3 h-3
            bg-telegram-bubble-received
          "
                    style={{
                        clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
                    }}
                />
            </div>
        </div>
    );
}
