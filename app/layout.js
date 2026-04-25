import './globals.css';
import Nav from '@/components/Nav';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Nav />
          <main style={{ flex: 1, padding: '2rem', marginLeft: '240px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
