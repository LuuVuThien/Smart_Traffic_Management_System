// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const [dbUsers, setDbUsers] = useState([
    { id: 1, username: 'admin', password: '123', name: 'Lưu Vũ Thiện', role: 'Admin', email: 'admin@stms.com', status: 'Online', avatar: 'https://via.placeholder.com/150' },
    { id: 2, username: 'police1', password: '123', name: 'Trần Văn Cảnh', role: 'Police', email: 'canh_sat@stms.com', status: 'Online', avatar: 'https://via.placeholder.com/150' },
    { id: 3, username: 'dan', password: '123', name: 'Nguyễn Văn Dân', role: 'User', email: 'dan@gmail.com', status: 'Offline', avatar: 'https://via.placeholder.com/150' }
  ]);

  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (apiResponseData) => {
    const loggedInUser = {
      id: apiResponseData.user.id,
      username: apiResponseData.user.username,
      name: apiResponseData.user.name, 
      role: apiResponseData.user.role, 
      avatar: 'https://via.placeholder.com/150'
    };
    setCurrentUser(loggedInUser);
  };

  const handleRegister = () => { return true; };

  const handleAddPersonnel = (newPersonnel) => {
    const userToAdd = { ...newPersonnel, id: dbUsers.length + 1, status: 'Offline', avatar: 'https://via.placeholder.com/150' };
    setDbUsers([...dbUsers, userToAdd]);
  };

  const handleLogout = () => { setCurrentUser(null); };

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

                {/* CÁC TRANG NGHIỆP VỤ: Chỉ dành cho Admin và Police */}
                {currentUser.role !== 'User' && (
                    <>
                        <Route path="/camera" element={<CameraPage />} />
                        <Route path="/violations" element={<ViolationPage />} />
                        <Route path="/reports" element={<ReportPage />} />
                    </>
                )}

                {/* TRANG SETTINGS: ĐƯA RA NGOÀI ĐỂ USER CŨNG VÀO ĐƯỢC */}
                <Route path="/settings" element={
                    <SettingsPage 
                        currentUser={currentUser} 
                        allUsers={dbUsers} 
                        onAddPersonnel={handleAddPersonnel}
                        onLogout={handleLogout} 
                    />
                } />

                {/* Chặn truy cập trái phép bằng cách đẩy về trang chủ */}
                {currentUser.role === 'User' && (
                    <>
                        <Route path="/camera" element={<Navigate to="/" />} />
                        <Route path="/violations" element={<Navigate to="/" />} />
                        <Route path="/reports" element={<Navigate to="/" />} />
                    </>
                )}
                
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;