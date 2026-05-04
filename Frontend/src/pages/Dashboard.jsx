import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full">

        {/* Optional Navbar */}
        <Navbar />

        {/* Page content */}
        <div className="p-3 md:p-6 w-full">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
