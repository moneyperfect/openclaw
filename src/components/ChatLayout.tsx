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
          background-color: rgb(240 242 245);
        }
        .light .bg-telegram-bg-tertiary {
          background-color: rgb(228 230 235);
        }
        .light .bg-telegram-bg-hover:hover {
          background-color: rgb(232 232 232);
        }
        .light .text-telegram-text-primary {
          color: rgb(0 0 0);
        }
        .light .text-telegram-text-secondary {
          color: rgb(101 103 107);
        }
        .light .text-telegram-text-muted {
          color: rgb(138 141 145);
        }
        .light .border-telegram-border {
          border-color: rgb(229 231 235);
        }
        .light .bg-telegram-bubble-sent {
          background-color: rgb(231 253 216);
        }
        .light .bg-telegram-bubble-received {
          background-color: rgb(255 255 255);
        }
      `}</style>
    </div>
  );
}
