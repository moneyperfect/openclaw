import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
        <Toaster
            position="top-center"
            toastOptions={{
                className: '',
                style: {
                    background: '#17212B',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                },
                success: {
                    iconTheme: {
                        primary: '#4CAF50',
                        secondary: '#FFFFFF',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#EF4444',
                        secondary: '#FFFFFF',
                    },
                },
            }}
        />
    </StrictMode>,
)
