// src/components/RightPanel.jsx
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { FaFireAlt, FaCarCrash, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

function RightPanel() {
  const [incidents, setIncidents] = useState([]);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanelData = async () => {
      try {
        const [violationsRes, incidentsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/violations/'),
          axios.get('http://127.0.0.1:8000/api/incidents/')
        ]);

        // 1. Xử lý Sự cố: Chỉ lấy những sự cố "Đang diễn ra" (ONGOING) và cắt lấy 3 cái mới nhất
        const activeIncidents = incidentsRes.data
          .filter(i => i.status === 'ONGOING')
          .slice(0, 3);
        setIncidents(activeIncidents);

        // 2. Xử lý Vi phạm: Cắt lấy 10 vi phạm mới nhất để không làm tràn bộ nhớ
        const recentViolations = violationsRes.data.slice(0, 10);
        setViolations(recentViolations);

      } catch (error) {
        console.error("Lỗi khi kéo dữ liệu RightPanel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanelData();
    
    // (Tùy chọn) Tự động làm mới dữ liệu mỗi 30 giây để RightPanel luôn "Live"
    const intervalId = setInterval(fetchPanelData, 30000);
    return () => clearInterval(intervalId);
    
  }, []);

  // Hàm chuyển đổi thời gian cho đẹp (VD: 2026-02-03T10:30:00Z -> 10:30)
  const formatTime = (timeString) => {
    if (!timeString) return 'Gần đây';
    const date = new Date(timeString);
    // Nếu ngày không hợp lệ thì trả về nguyên gốc
    if (isNaN(date)) return timeString.split(' ')[1] || timeString; 
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-3 h-100 d-flex flex-column">
      
      {/* 1. Phần Sự cố khẩn cấp */}
      <Card className="mb-3 border-0 shadow-sm">
        <Card.Header className="bg-danger text-white fw-bold d-flex justify-content-between align-items-center">
            <span><FaFireAlt className="me-2"/>Sự Cố Khẩn Cấp</span>
            <Badge bg="light" text="danger">{incidents.length}</Badge>
        </Card.Header>
        
        {loading ? (
           <div className="text-center p-3"><Spinner animation="border" variant="danger" size="sm"/></div>
        ) : incidents.length > 0 ? (
          <ListGroup variant="flush">
            {incidents.map((incident) => (
              <ListGroup.Item key={incident.id}>
                <div className="d-flex justify-content-between">
                    <strong>
                      {incident.type === 'FIRE' ? '🔥 CHÁY' : incident.type === 'FLOOD' ? '🌊 NGẬP LỤT' : '⚠️ SỰ CỐ'}
                    </strong>
                    <Badge bg="warning" text="dark">Mới</Badge>
                </div>
                <small className="text-muted d-block text-truncate" title={incident.location}>
                  {incident.location || 'Chưa rõ địa điểm'}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="p-3 text-center text-muted small">
            Không có sự cố nào đang diễn ra.
          </div>
        )}
      </Card>

      {/* 2. Phần Vi phạm gần đây */}
      <h5 className="mt-2 text-primary fw-bold"><FaCarCrash className="me-2"/>Vi phạm gần đây</h5>
      <div className="flex-grow-1 overflow-auto pe-1" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {loading ? (
          <div className="text-center p-3"><Spinner animation="border" variant="primary" /></div>
        ) : violations.length > 0 ? (
          violations.map((violation) => (
            <Card key={violation.id} className="mb-2 border-start border-4 border-warning shadow-sm">
                <Card.Body className="p-2">
                    <div className="d-flex justify-content-between">
                        <span className="fw-bold">{violation.license_plate || 'Chưa rõ'}</span>
                        <span className="text-muted small">
                          {formatTime(violation.occurred_at)}
                        </span>
                    </div>
                    <div className="text-danger small text-truncate" title={violation.violation_type}>
                      Lỗi: {violation.violation_type || 'Vi phạm giao thông'}
                    </div>
                </Card.Body>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted mt-3 small">
            Chưa có vi phạm nào.
          </div>
        )}
      </div>

    </div>
  );
}

export default RightPanel;