// src/components/Stats.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaCar, FaExclamationCircle, FaFireAlt, FaVideo } from 'react-icons/fa';

function Stats() {
  // Số liệu giả định (Sau này nhóm trưởng sẽ thay bằng số thật từ Database)
  const data = {
    totalVehicles: 1205,
    violations: 15,
    incidents: 2,
    activeCameras: "10/12"
  };

  return (
    <Row className="mb-4 g-3">
      {/* Thẻ 1: Xe lưu thông */}
      <Col md={3}>
        <Card className="shadow-sm border-start border-4 border-primary">
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted">LƯU LƯỢNG XE</small>
              <h3 className="fw-bold text-primary">{data.totalVehicles}</h3>
            </div>
            <FaCar className="text-primary fs-3" />
          </Card.Body>
        </Card>
      </Col>

      {/* Thẻ 2: Vi phạm */}
      <Col md={3}>
        <Card className="shadow-sm border-start border-4 border-danger">
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted">VI PHẠM</small>
              <h3 className="fw-bold text-danger">{data.violations}</h3>
            </div>
            <FaExclamationCircle className="text-danger fs-3" />
          </Card.Body>
        </Card>
      </Col>

      {/* Thẻ 3: Sự cố */}
      <Col md={3}>
        <Card className="shadow-sm border-start border-4 border-warning">
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted">CẢNH BÁO</small>
              <h3 className="fw-bold text-warning">{data.incidents}</h3>
            </div>
            <FaFireAlt className="text-warning fs-3" />
          </Card.Body>
        </Card>
      </Col>

      {/* Thẻ 4: Camera */}
      <Col md={3}>
        <Card className="shadow-sm border-start border-4 border-success">
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted">CAMERA ONLINE</small>
              <h3 className="fw-bold text-success">{data.activeCameras}</h3>
            </div>
            <FaVideo className="text-success fs-3" />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Stats;