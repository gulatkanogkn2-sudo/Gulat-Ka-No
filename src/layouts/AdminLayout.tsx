import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavigation } from '../components/layout/AdminNavigation';
import { AdminHeader } from '../components/layout/AdminHeader';

export const AdminLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row bg-[#050810] text-slate-100 font-sans relative md:overflow-hidden">
      {/* Background Glows for Admin */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00D9FF]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#FF2ED1]/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      
      {/* Admin Sidebar Navigation */}
      <div className="relative z-20 md:w-56 lg:w-60 xl:w-64 flex-shrink-0 md:h-full">
        <AdminNavigation
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
        />
      </div>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full md:h-full overflow-hidden">
        <AdminHeader onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />

        <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 overflow-y-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

