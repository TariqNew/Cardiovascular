import React, { useState } from "react";
import NotificationPanel from "./NotificationPanel";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showNotifications: boolean;
  toggleNotifications: () => void;
}

const tabs = [
  { id: "dashboard", icon: "fa-chart-line", label: "Dashboard" },
  { id: "profile", icon: "fa-user-circle", label: "Health Profile" },
  { id: "meals", icon: "fa-utensils", label: "Meal Plans" },
  { id: "progress", icon: "fa-tasks", label: "Progress Tracking" },
  { id: "recommendations", icon: "fa-robot", label: "AI Recommendations" },
  { id: "education", icon: "fa-book-open", label: "Education" },
];

const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  showNotifications,
  toggleNotifications,
}) => {
  const isAuthPage = activeTab === "login" || activeTab === "signup";
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setActiveTab("login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <i className="fas fa-heartbeat text-red-500 text-2xl mr-2"></i>
            <span className="text-xl font-semibold text-gray-900">CardioVascular</span>
          </div>

          {!isAuthPage && (
            <>
              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-6 ml-10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <i className={`fas ${tab.icon} mr-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Notification + Logout */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i className="fas fa-bell"></i>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  </button>
                  {showNotifications && <NotificationPanel />}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 px-4 py-2 rounded text-sm text-white hover:bg-blue-700 flex items-center gap-2"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Nav Panel */}
        {!isAuthPage && isOpen && (
          <nav className="md:hidden mt-2 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`${
                  activeTab === tab.id
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-700"
                } flex items-center space-x-2 w-full text-left px-4 py-2`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="text-red-600 flex items-center space-x-2 px-4 py-2"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
