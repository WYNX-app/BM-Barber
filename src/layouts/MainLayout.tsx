import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { SwipeLayout } from '../components/layout/SwipeLayout';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-dm-ivory overflow-x-hidden">
      <div className="hidden md:block w-64 fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 w-full md:ml-64 p-4 pb-36 md:p-8 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {/* O SwipeLayout envolve tudo aqui */}
          <SwipeLayout>
            <Outlet />
          </SwipeLayout>
        </div>
      </main>

      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};