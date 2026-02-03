import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isInStandalone = window.matchMedia('(display-mode: standalone)').matches;

        setIsIOS(isIOSDevice);

        // Don't show if already installed
        if (isInStandalone) return;

        // For iOS, show custom prompt after delay
        if (isIOSDevice) {
            const dismissed = localStorage.getItem('pwa-install-dismissed');
            if (!dismissed) {
                setTimeout(() => setShowPrompt(true), 3000);
            }
            return;
        }

        // For Android/Desktop, listen for beforeinstallprompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            const dismissed = localStorage.getItem('pwa-install-dismissed');
            if (!dismissed) {
                setTimeout(() => setShowPrompt(true), 2000);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
            <div className="bg-telegram-bg-tertiary rounded-2xl p-4 shadow-lg border border-telegram-border max-w-md mx-auto">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-telegram-accent-blue to-[#229ED9] flex items-center justify-center text-2xl flex-shrink-0">
                        🤖
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-telegram-text-primary text-sm">
                            添加到主屏幕
                        </h3>
                        <p className="text-xs text-telegram-text-secondary mt-0.5">
                            {isIOS
                                ? '点击分享按钮 → "添加到主屏幕"'
                                : '像 App 一样快速访问 OpenClaw'
                            }
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="p-1 rounded-full hover:bg-telegram-bg-hover transition-colors flex-shrink-0"
                    >
                        <X size={18} className="text-telegram-text-muted" />
                    </button>
                </div>

                {/* Action button (non-iOS only) */}
                {!isIOS && deferredPrompt && (
                    <button
                        onClick={handleInstall}
                        className="w-full mt-3 py-2.5 px-4 bg-telegram-accent-blue text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                        <Download size={18} />
                        安装应用
                    </button>
                )}

                {/* iOS instructions */}
                {isIOS && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs text-telegram-text-secondary">
                        <span>点击</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .9 2 2z" />
                        </svg>
                        <span>然后选择 "添加到主屏幕"</span>
                    </div>
                )}
            </div>
        </div>
    );
}
