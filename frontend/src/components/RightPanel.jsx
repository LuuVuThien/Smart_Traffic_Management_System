// src/components/RightPanel.jsx
import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { FaFireAlt, FaCarCrash, FaExclamationTriangle } from 'react-icons/fa';

function RightPanel() {
  return (
    <div className="p-3 h-100 d-flex flex-column">
      
      {/* 1. Phần Sự cố khẩn cấp */}
      <Card className="mb-3 border-0 shadow-sm">
        <Card.Header className="bg-danger text-white fw-bold d-flex justify-content-between align-items-center">
            <span><FaFireAlt className="me-2"/>Sự Cố Khẩn Cấp</span>
            <Badge bg="light" text="danger">2</Badge>
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <div className="d-flex justify-content-between">
                <strong>🔥 CHÁY</strong>
                <Badge bg="warning" text="dark">Vừa xong</Badge>
            </div>
            <small className="text-muted">Khu Công nghiệp Hòa Khánh</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="d-flex justify-content-between">
                <strong>🌊 NGẬP LỤT</strong>
                <Badge bg="secondary">15p trước</Badge>
            </div>
            <small className="text-muted">Đường Nguyễn Văn Linh</small>
          </ListGroup.Item>
        </ListGroup>
      </Card>

      {/* 2. Phần Vi phạm gần đây (Để danh sách dài cho nó lấp đầy khoảng trống) */}
      <h5 className="mt-2 text-primary fw-bold"><FaCarCrash className="me-2"/>Vi phạm gần đây</h5>
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Card key={index} className="mb-2 border-start border-4 border-warning shadow-sm">
                <Card.Body className="p-2">
                    <div className="d-flex justify-content-between">
                        <span className="fw-bold">43A-123.{45 + index}</span>
                        <span className="text-muted small">10:{30 + index} AM</span>
                    </div>
                    <div className="text-danger small">Lỗi: Vượt đèn đỏ</div>
                </Card.Body>
            </Card>
          ))}
      </div>

    </div>
  );
}

export default RightPanel;