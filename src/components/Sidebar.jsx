// src/components/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
// Import các icon đẹp
import { FaMapMarkedAlt, FaVideo, FaExclamationTriangle, FaChartBar, FaCogs } from 'react-icons/fa';

function Sidebar() {
  return (
    <div 
      className="d-flex flex-column p-3 text-white bg-dark" 
      style={{ width: '260px', minHeight: '100vh' }} // Cố định chiều rộng và chiều cao
    >
      {/* 1. Phần Logo */}
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4 fw-bold">🚦 STMS Admin</span>
      </a>
      <hr />
      
      {/* 2. Phần Menu */}
      <Nav className="flex-column mb-auto">
        <Nav.Item>
          <Nav.Link href="#" className="text-white active bg-primary rounded mb-2">
            <FaMapMarkedAlt className="me-2"/> Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="text-white mb-2">
            <FaVideo className="me-2"/> Camera Live
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="text-white mb-2">
            <FaExclamationTriangle className="me-2"/> Cảnh báo & Vi phạm
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="text-white mb-2">
            <FaChartBar className="me-2"/> Báo cáo thống kê
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      <hr />
      
      {/* 3. Phần Footer Menu */}
      <div>
        <a href="#" className="d-flex align-items-center text-white text-decoration-none">
          <FaCogs className="me-2"/>
          <strong>Cài đặt</strong>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;