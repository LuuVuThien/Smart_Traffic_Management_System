// src/components/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaMapMarkedAlt, FaVideo, FaExclamationTriangle, FaChartBar, FaCogs } from 'react-icons/fa';

// Nhận biến 'role' từ App.jsx truyền sang để phân quyền hiển thị menu
function Sidebar({ role }) {
  const location = useLocation();

  // Hàm kiểm tra xem link có đang được chọn không để tô màu xanh
  const isActive = (path) => location.pathname === path ? 'active bg-primary' : '';

  return (
    <div 
      className="d-flex flex-column p-3 text-white bg-dark" 
      style={{ width: '260px', height: '100vh' }} 
    >
      {/* 1. Phần Logo */}
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4 fw-bold">🚦 STMS Admin</span>
      </Link>
      <hr />
      
      {/* 2. Phần Menu Chính */}
      <Nav className="flex-column mb-auto">
        
        {/* DASHBOARD: Công khai cho cả Admin, Police và User */}
        <Nav.Item>
          <Nav.Link as={Link} to="/" className={`text-white mb-2 ${isActive('/')}`}>
            <FaMapMarkedAlt className="me-2"/> Dashboard
          </Nav.Link>
        </Nav.Item>

        {/* CHỈ HIỂN THỊ NẾU LÀ ADMIN HOẶC POLICE (Ẩn đối với User thường) */}
        {role !== 'User' && (
          <>
            {/* CAMERA LIVE */}
            <Nav.Item>
              <Nav.Link as={Link} to="/camera" className={`text-white mb-2 ${isActive('/camera')}`}>
                <FaVideo className="me-2"/> Camera Live
              </Nav.Link>
            </Nav.Item>

            {/* CẢNH BÁO & VI PHẠM */}
            <Nav.Item>
              <Nav.Link as={Link} to="/violations" className={`text-white mb-2 ${isActive('/violations')}`}>
                <FaExclamationTriangle className="me-2"/> Cảnh báo & Vi phạm
              </Nav.Link>
            </Nav.Item>

            {/* BÁO CÁO THỐNG KÊ */}
            <Nav.Item>
              <Nav.Link as={Link} to="/reports" className={`text-white mb-2 ${isActive('/reports')}`}>
                <FaChartBar className="me-2"/> Báo cáo thống kê
              </Nav.Link>
            </Nav.Item>
          </>
        )}
      </Nav>
      
      <hr />
      
      {/* 3. Phần Footer Menu (Cài đặt) - ĐƯA RA NGOÀI ĐỂ USER CŨNG THẤY */}
      <div>
        <Link to="/settings" className={`d-flex align-items-center text-white text-decoration-none p-2 rounded ${isActive('/settings')}`}>
          <FaCogs className="me-2"/>
          <strong>Cài đặt</strong>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;