import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx starting...');

try {
    const rootElement = document.getElementById("root");
    console.log('Root element found:', rootElement);

    if (!rootElement) {
        throw new Error('Root element not found');
    }

    const root = createRoot(rootElement);
    console.log('React root created');

    root.render(<App />);
    console.log('App rendered successfully');
} catch (error) {
    console.error('Error in main.tsx:', error);
    document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; color: red; background: white; min-height: 100vh;">
      <h1>🚨 Initialization Error!</h1>
      <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
      <pre style="text-align: left; background: #f5f5f5; padding: 10px; overflow: auto;">
        ${error instanceof Error ? error.stack : 'No stack trace available'}
      </pre>
    </div>
  `;
}
