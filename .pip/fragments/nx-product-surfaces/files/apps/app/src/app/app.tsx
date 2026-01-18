import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Dashboard } from '../pages/Dashboard';
import { Profile } from '../pages/Profile';
import './app.css';

export function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<div className="text-gray-900 dark:text-white">Settings page coming soon...</div>} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
