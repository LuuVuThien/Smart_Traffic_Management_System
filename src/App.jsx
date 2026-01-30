import React from 'react';
import LiveMap from './components/LiveMap';

// import TrafficList from './components/TrafficList'; 
// import SignalControl from './components/SignalControl'; 

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 1. Header - Phần chung */}
      <header style={{ background: '#282c34', padding: '20px', color: 'white' }}>
        <h1>STMS Dashboard - Hệ thống Quản lý Giao thông</h1>
      </header>

      {/* 2. Body chính */}
      <div className="main-content" style={{ display: 'flex', flex: 1 }}>
        <div style={{ flex: 3, padding: '10px' }}>
            <h2>Bản đồ trực gian (Live Map)</h2>
            <LiveMap />
        </div>

        {/* Cột phải: Nơi hiển thị chức năng của thành viên khác */}
        <div style={{ flex: 1, padding: '10px', background: '#f4f4f4', borderLeft: '1px solid #ddd' }}>
            
            {/* Khu vực của Thành viên 2 */}
            <div className="member-section" style={{ marginBottom: '20px' }}>
                <h3>🚦 Trạng thái đèn (Thành viên 2)</h3>
                <p>Đang chờ component...</p>
                {/* <SignalControl /> */}
            </div>

            <hr />

            {/* Khu vực của Thành viên 3 */}
            <div className="member-section">
                <h3>📝 Danh sách sự cố (Thành viên 3)</h3>
                <p>Đang chờ component...</p>
                {/* <TrafficList /> */}
            </div>

        </div>
      </div>
    </div>
  );
}

export default App;