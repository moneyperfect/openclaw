import { useEffect } from 'react';
import { useChatStore } from './store/chatStore';
import ChatLayout from './components/ChatLayout';

function App() {
    const initialize = useChatStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return <ChatLayout />;
}

export default App;
