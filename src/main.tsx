import {createRoot} from 'react-dom/client';
import App from './App.tsx';
// @ts-ignore - CSS module type declarations handled by Vite
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
