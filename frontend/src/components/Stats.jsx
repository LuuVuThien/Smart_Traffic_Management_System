// src/components/Stats.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaCar, FaExclamationCircle, FaFireAlt, FaVideo } from 'react-icons/fa';
import axios from 'axios';

function Stats() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    violations: 0,
    incidents: 0,
    activeCameras: "0/0"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Gọi đồng thời 4 API để lấy tổng quan toàn hệ thống
        const [trafficRes, violationsRes, incidentsRes, camerasRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/trafficdata/').catch(() => ({ data: [] })),
          axios.get('http://127.0.0.1:8000/api/violations/').catch(() => ({ data: [] })),
          axios.get('http://127.0.0.1:8000/api/incidents/').catch(() => ({ data: [] })),
          axios.get('http://127.0.0.1:8000/api/cameras/').catch(() => ({ data: [] }))
        ]);

        // 1. Tính tổng lưu lượng xe (Cộng dồn cột vehicle_count, nếu bảng trống thì lấy số giả định 1205)
        const totalVehicles = trafficRes.data.reduce((sum, item) => sum + (item.vehicle_count || 0), 0);

        // 2. Tính số vi phạm ĐANG CHỜ XỬ LÝ
        const violationsCount = violationsRes.data.filter(v => v.status === 'Chưa xử lý').length;

        // 3. Tính số sự cố ĐANG DIỄN RA
        const incidentsCount = incidentsRes.data.filter(i => i.status === 'ONGOING').length;

        // 4. Tính tỷ lệ Camera hoạt động
        const totalCameras = camerasRes.data.length;
        // Giả sử cột trạng thái camera là 'status' hoặc 'is_active'
        const activeCameras = camerasRes.data.filter(c => c.status === 'Online' || c.status === 'Active' || c.is_active).length;
        const cameraString = totalCameras > 0 ? `${activeCameras}/${totalCameras}` : "0/0";

        setStats({
          totalVehicles: totalVehicles > 0 ? totalVehicles : 1205, // Dự phòng 1205 nếu db chưa có data
          violations: violationsCount,
          incidents: incidentsCount,
          activeCameras: cameraString
        });

      } catch (error) {
        console.error("Lỗi khi kéo dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Tự động làm mới số liệu mỗi 60 giây
    const intervalId = setInterval(fetchStats, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Row className="mb-4 g-3">
      {/* Thẻ 1: Xe lưu thông */}
      <Col md={3}>
        <Card className="shadow-sm border-start border-4 border-primary h-100">
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted fw-bold">LƯU LƯỢNG XE</small>
              {loading ? <Spinner animation="border" size="sm" className="d-block mt-2 text-primary" /> : (
                <h3 className="fw-bold text-primary mb-0 mt-1">{stats.totalVehicles}</h3>
              )}
            </div>
            <FaCar className="text-primary fs-2" style={{opacity: 0.8}} />
          </Card.Body>
        </Card>
      </Col>

      {/* Thẻ 2: Vi phạm */}
      <Col md={3}>
        <Card className="shadow-sm border-start border-4 border-danger h-100">
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted fw-bold">CHỜ XỬ LÝ</small>
              {loading ? <Spinner animation="border" size="sm" className="d-block mt-2 text-danger" /> : (
                <h3 className="fw-bold text-danger mb-0 mt-1">{stats.violations}</h3>
              )}
            </div>
            <FaExclamationCircle className="text-danger fs-2" style={{opacity: 0.8}} />
          </Card.Body>
        </Card>
      </Col>

      {/* Thẻ 3: Sự cố */}
      <Col md={3}>
        <Card className="shadow-sm border-start border-4 border-warning h-100">
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted fw-bold">CẢNH BÁO</small>
              {loading ? <Spinner animation="border" size="sm" className="d-block mt-2 text-warning" /> : (
                <h3 className="fw-bold text-warning mb-0 mt-1">{stats.incidents}</h3>
              )}
            </div>
            <FaFireAlt className="text-warning fs-2" style={{opacity: 0.8}} />
          </Card.Body>
        </Card>
      </Col>

      {/* Thẻ 4: Camera */}
      <Col md={3}>
        <Card className="shadow-sm border-start border-4 border-success h-100">
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <small className="text-muted fw-bold">CAMERA ONLINE</small>
              {loading ? <Spinner animation="border" size="sm" className="d-block mt-2 text-success" /> : (
                <h3 className="fw-bold text-success mb-0 mt-1">{stats.activeCameras}</h3>
              )}
            </div>
            <FaVideo className="text-success fs-2" style={{opacity: 0.8}} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Stats;