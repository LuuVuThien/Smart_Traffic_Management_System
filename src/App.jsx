// src/App.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Quan trọng
import LiveMap from './components/LiveMap';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import Stats from './components/Stats';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#f0f2f5' }}>
      
      {/* 1. CỘT TRÁI (Sidebar) */}
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* 2. CỘT GIỮA (Thống kê + Bản đồ) */}
      <div className="d-flex flex-column flex-grow-1 p-3" style={{ minWidth: 0 }}>
        
        {/* Phần Thống kê nằm trên cùng */}
        <div className="mb-3">
            <h2 className="fw-bold text-dark mb-3">🚦 STMS Dashboard</h2>
            <Stats />
        </div>

        {/* Phần Bản đồ (Chiếm hết không gian còn lại) */}
        <div className="flex-grow-1 shadow-sm rounded overflow-hidden border" style={{ position: 'relative' }}>
           <LiveMap />
        </div>

      </div>

      {/* 3. CỘT PHẢI (RightPanel) - Chứa danh sách sự cố */}
      <div style={{ 
          width: '320px', 
          flexShrink: 0, 
          background: 'white', 
          borderLeft: '1px solid #ddd' 
      }}>
        <RightPanel />
      </div>

    </div>
  );
}

export default App;