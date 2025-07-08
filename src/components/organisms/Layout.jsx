import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import Sidebar from "@/components/organisms/Sidebar";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with logout */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <ApperIcon name="Menu" size={20} />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Welcome, {user?.firstName || user?.name || 'User'}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <ApperIcon name="LogOut" size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto">
            <Outlet context={{ setSidebarOpen }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;