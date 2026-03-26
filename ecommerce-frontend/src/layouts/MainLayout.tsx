import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer style={{ borderTop: '1px solid var(--border-subtle)' }} className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              © 2026 ShopScale. Built with FastAPI + React.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span>Scalable E-Commerce Platform</span>
            </div>
          </div>
        </div>
      </footer>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card-solid)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </div>
  );
}
