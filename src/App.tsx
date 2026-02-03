import { useEffect } from 'react';
import { useChatStore } from './store/chatStore';
import ChatLayout from './components/ChatLayout';
import InstallPrompt from './components/InstallPrompt';

function App() {
    const initialize = useChatStore((state) => state.initialize);

    useEffect(() => {
        initialize();

        // Prevent pull-to-refresh on mobile
        document.body.addEventListener('touchmove', (e) => {
            if (e.target === document.body) {
                e.preventDefault();
            }
        }, { passive: false });

        // Handle viewport height for mobile keyboards
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);

        return () => window.removeEventListener('resize', setVH);
    }, [initialize]);

    return (
        <>
            <ChatLayout />
            <InstallPrompt />
        </>
    );
}

export default App;
