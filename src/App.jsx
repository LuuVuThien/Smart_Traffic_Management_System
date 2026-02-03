// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 1. Nhập Router
import 'bootstrap/dist/css/bootstrap.min.css';

// Import các component cũ
import LiveMap from './components/LiveMap';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import Stats from './components/Stats';

// Import 4 trang mới
import CameraPage from './components/CameraPage';
import ViolationPage from './components/ViolationPage';
import ReportPage from './components/ReportPage';
import SettingsPage from './components/SettingsPage';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#f0f2f5' }}>
        
        {/* 1. SIDEBAR (Luôn cố định bên trái) */}
        <div style={{ flexShrink: 0 }}>
          <Sidebar />
        </div>

        {/* 2. KHUNG NỘI DUNG THAY ĐỔI (Dynamic Content) */}
        {/* Phần này sẽ thay đổi tùy theo Link được bấm */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Routes>
                
                {/* --- TRANG CHỦ (DASHBOARD) --- */}
                {/* Giữ nguyên bố cục: Cột Giữa (Map) + Cột Phải (RightPanel) */}
                <Route path="/" element={
                    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                        {/* Cột Giữa */}
                        <div className="d-flex flex-column flex-grow-1 p-3" style={{ minWidth: 0 }}>
                            <div className="mb-3">
                                <h2 className="fw-bold text-dark mb-3">🚦 STMS Dashboard</h2>
                                <Stats />
                            </div>
                            <div className="flex-grow-1 shadow-sm rounded overflow-hidden border" style={{ position: 'relative' }}>
                                <LiveMap />
                            </div>
                        </div>
                        {/* Cột Phải */}
                        <div style={{ width: '320px', flexShrink: 0, background: 'white', borderLeft: '1px solid #ddd' }}>
                            <RightPanel />
                        </div>
                    </div>
                } />

                {/* --- CÁC TRANG CHỨC NĂNG KHÁC --- */}
                {/* Các trang này sẽ chiếm trọn không gian bên phải Sidebar */}
                <Route path="/camera" element={<CameraPage />} />
                <Route path="/violations" element={<ViolationPage />} />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/settings" element={<SettingsPage />} />

            </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;