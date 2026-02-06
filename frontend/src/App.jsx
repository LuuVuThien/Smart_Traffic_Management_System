// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import các trang
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import LiveMap from './components/LiveMap';
import RightPanel from './components/RightPanel';
import Stats from './components/Stats';
import CameraPage from './components/CameraPage';
import ViolationPage from './components/ViolationPage';
import ReportPage from './components/ReportPage';
import SettingsPage from './components/SettingsPage';

function App() {
  // DATABASE GIẢ LẬP
  const [dbUsers, setDbUsers] = useState([
    { id: 1, username: 'admin', password: '123', name: 'Lưu Vũ Thiện', role: 'Admin', email: 'admin@stms.com', status: 'Online', avatar: 'https://via.placeholder.com/150' },
    { id: 2, username: 'police1', password: '123', name: 'Trần Văn Cảnh', role: 'Police', email: 'canh_sat@stms.com', status: 'Online', avatar: 'https://via.placeholder.com/150' },
    { id: 3, username: 'dan', password: '123', name: 'Nguyễn Văn Dân', role: 'User', email: 'dan@gmail.com', status: 'Offline', avatar: 'https://via.placeholder.com/150' }
  ]);

  const [currentUser, setCurrentUser] = useState(null);

  // Đăng nhập
  const handleLogin = (username, password) => {
    const user = dbUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  // Đăng ký
  const handleRegister = (newUser) => {
    const isExist = dbUsers.some(u => u.username === newUser.username);
    if (isExist) return false;
    const userToAdd = { ...newUser, id: dbUsers.length + 1, role: 'User', status: 'Online', avatar: 'https://via.placeholder.com/150' };
    setDbUsers([...dbUsers, userToAdd]);
    setCurrentUser(userToAdd);
    return true;
  };

  // Thêm nhân sự (Admin)
  const handleAddPersonnel = (newPersonnel) => {
    const userToAdd = { ...newPersonnel, id: dbUsers.length + 1, status: 'Offline', avatar: 'https://via.placeholder.com/150' };
    setDbUsers([...dbUsers, userToAdd]);
  };

  // --> HÀM MỚI: ĐĂNG XUẤT <--
  const handleLogout = () => {
    setCurrentUser(null); // Xóa người dùng hiện tại -> Tự động quay về trang Login
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#f0f2f5' }}>
        <div style={{ flexShrink: 0 }}>
          <Sidebar role={currentUser.role} />
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Routes>
                <Route path="/" element={
                    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                        <div className="d-flex flex-column flex-grow-1 p-3">
                            <Stats />
                            <div className="flex-grow-1 shadow-sm rounded overflow-hidden border mt-3">
                                <LiveMap />
                            </div>
                        </div>
                        <div style={{ width: '320px', background: 'white' }}><RightPanel /></div>
                    </div>
                } />
                <Route path="/camera" element={<CameraPage />} />
                <Route path="/violations" element={<ViolationPage />} />
                <Route path="/reports" element={<ReportPage />} />
                
                {/* TRUYỀN HÀM LOGOUT XUỐNG SETTINGS */}
                <Route path="/settings" element={
                    <SettingsPage 
                        currentUser={currentUser} 
                        allUsers={dbUsers} 
                        onAddPersonnel={handleAddPersonnel}
                        onLogout={handleLogout} // <--- Truyền hàm này
                    />
                } />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;