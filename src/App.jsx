
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import Home from './pages/home/Homepage'
import AdminPanel from './pages/admin/adminPanel'
import UserDashboard from './pages/user/userDashboard'
import AppShell from './components/layouts/AppShell'
import LoginPage from './pages/login/loginPage'
import RegisterPage from './pages/register/regitstePage'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './Auth/AuthProvider'

function App() {
  const { user } = useAuth();
  const userAvailable = user ? true : false;
  const role = user?.role;

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {role === "admin" ? (
          <>
            <Route element={<AppShell />}>
              <Route path="/admin/*" element={<AdminPanel />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            
            <Route path="/admin/*" element={<Navigate to={userAvailable ? "/" : "/"} replace />} />
            
            
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
