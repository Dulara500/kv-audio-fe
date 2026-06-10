
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/home/Homepage'
import AdminPanel from './pages/admin/adminPanel'
import UserDashboard from './pages/user/userDashboard'
import AppShell from './components/layouts/AppShell'
import LoginPage from './pages/login/loginPage'
import RegisterPage from './pages/register/regitstePage'
import { Toaster } from 'react-hot-toast'
import Test from './components/test'

function App() {

  return (
    <BrowserRouter>
      <Toaster/>
      <Routes>
        <Route element={<AppShell/>}>  
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/user/*" element={<UserDashboard />} />
          
        </Route>
        
        <Route path="/test" element={<Test/>}/>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/*" element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
