import { useChatStore } from '../store/chatStore';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

export default function ChatLayout() {
  const { activeSessionId, isMobileView, theme } = useChatStore();

  // On mobile: show list OR chat, not both
  const showList = !isMobileView || (isMobileView && !activeSessionId);
  const showChat = !isMobileView || (isMobileView && activeSessionId);

  return (
    <div
      className={`flex overflow-hidden ${theme === 'dark' ? 'dark' : 'light'}`}
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* Background gradient for visual depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-telegram-bg-primary via-telegram-bg-primary to-telegram-bg-secondary dark:from-telegram-bg-primary dark:via-telegram-bg-primary dark:to-telegram-bg-secondary pointer-events-none" />

      {/* Sidebar / Chat List */}
      <aside
        className={`
          ${showList ? 'flex' : 'hidden'}
          ${isMobileView ? 'w-full' : 'w-80 min-w-80'}
          flex-col
          relative z-10
          bg-telegram-bg-secondary dark:bg-telegram-bg-secondary
          border-r border-telegram-border dark:border-telegram-border
          transition-transform duration-300 ease-out
          safe-area-top safe-area-left
        `}
      >
        <ChatList />
      </aside>

      {/* Main Chat Window */}
      <main
        className={`
          ${showChat ? 'flex' : 'hidden'}
          flex-1
          flex-col
          relative z-10
          bg-telegram-bg-primary dark:bg-telegram-bg-primary
          transition-transform duration-300 ease-out
          safe-area-right
        `}
      >
        <ChatWindow />
      </main>

      {/* Light mode styles override */}
      <style>{`
        .light {
          --tw-bg-opacity: 1;
        }
        .light .bg-telegram-bg-primary {
          background-color: rgb(255 255 255);
        }
        .light .bg-telegram-bg-secondary {
          background-color: rgb(248 249 250);
        }
        .light .bg-telegram-bg-tertiary {
          background-color: rgb(241 243 244);
        }
        .light .bg-telegram-bg-hover:hover {
          background-color: rgb(232 234 237);
        }
        .light .text-telegram-text-primary {
          color: rgb(32 33 36) !important;
        }
        .light .text-telegram-text-secondary {
          color: rgb(95 99 104) !important;
        }
        .light .text-telegram-text-muted {
          color: rgb(128 134 139) !important;
        }
        .light .border-telegram-border {
          border-color: rgb(218 220 224);
        }
        .light .bg-telegram-bubble-sent {
          background-color: rgb(210 227 252);
        }
        .light .bg-telegram-bubble-received {
          background-color: rgb(255 255 255);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .light .bg-gradient-to-br {
          background: rgb(255 255 255) !important;
        }
        /* Fix message text in light mode */
        .light .message-content {
          color: rgb(32 33 36) !important;
        }
        .light .message-content pre {
          background: rgb(241 243 244);
          color: rgb(32 33 36);
        }
        .light .message-content code {
          background: rgb(241 243 244);
          color: rgb(32 33 36);
        }
        /* Fix input area */
        .light input,
        .light textarea {
          color: rgb(32 33 36) !important;
        }
        .light input::placeholder,
        .light textarea::placeholder {
          color: rgb(128 134 139) !important;
        }
      `}</style>
    </div>
  );
}
