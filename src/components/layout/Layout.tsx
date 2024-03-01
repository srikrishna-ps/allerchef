import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-screen-xl px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;