import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import HealthProfile from './pages/HealthProfile';
import MealPlans from './pages/MealPlan';
import ProgressTracking from './pages/ProgressTracking';
import Education from './pages/Education';
import Login from './components/SignIn';
import Register from './components/SignUp';

const App: React.FC = () => {
  
  const [activeTab, setActiveTab] = useState('login');
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'login':
        return <Login setActiveTab={setActiveTab} />;
      case 'signup':
        return <Register setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <HealthProfile />;
      case 'meals':
        return <MealPlans />;
      case 'progress':
        return <ProgressTracking />;
      case 'education':
        return <Education />;
      default:
        return <Login setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showNotifications={showNotifications}
        toggleNotifications={toggleNotifications}
      />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
