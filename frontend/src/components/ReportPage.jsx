import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Table, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { FaChartPie, FaCamera, FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

function ReportPage() {
  const [loading, setLoading] = useState(true);
  
  // Thêm state để quản lý việc mở rộng/thu gọn danh sách
  const [showAll, setShowAll] = useState(false);
  
  // State lưu trữ dữ liệu thống kê
  const [stats, setStats] = useState({
    totalAreas: 0,
    totalCameras: 0,
    activeCameras: 0,
    offlineCameras: 0,
  });

  // State lưu danh sách chi tiết để hiển thị bảng
  const [camerasData, setCamerasData] = useState([]);
  const [areasData, setAreasData] = useState([]);

  // Hàm gọi API và tính toán thống kê
  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Gọi song song 2 API lấy Area và Camera để tiết kiệm thời gian
      const [areasResponse, camerasResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/areas/`),
        axios.get(`${API_BASE_URL}/cameras/`)
      ]);

      const areas = areasResponse.data;
      const cameras = camerasResponse.data;

      // Tính toán các con số
      const activeCount = cameras.filter(cam => cam.status === 'ACTIVE').length;
      const offlineCount = cameras.length - activeCount;

      setStats({
        totalAreas: areas.length,
        totalCameras: cameras.length,
        activeCameras: activeCount,
        offlineCameras: offlineCount,
      });

      setAreasData(areas);
      setCamerasData(cameras);

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu báo cáo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chạy một lần duy nhất khi trang Report được mở
  useEffect(() => {
    fetchReportData();
  }, []);

  // Tính phần trăm camera hoạt động để vẽ thanh ProgressBar
  const activePercentage = stats.totalCameras === 0 
    ? 0 
    : Math.round((stats.activeCameras / stats.totalCameras) * 100);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <h5 className="mt-3 text-muted">Đang tổng hợp báo cáo từ Database...</h5>
      </div>
    );
  }

  return (
    <div className="p-4 h-100 overflow-auto bg-light">
      <div className="mb-4">
        <h2 className="fw-bold mb-0"><FaChartPie className="me-2 text-primary"/> Báo Cáo Thống Kê</h2>
        <p className="text-muted fw-semibold">Tổng quan tình trạng hệ thống Camera</p>
      </div>
      <hr />

      {/* --- SECTION 1: CÁC THẺ SỐ LIỆU TỔNG QUAN --- */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm border-start border-primary border-4 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted fw-bold mb-1">TỔNG SỐ QUẬN</h6>
                  <h3 className="fw-bold mb-0">{stats.totalAreas}</h3>
                </div>
                <FaMapMarkerAlt className="fs-1 text-primary opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm border-start border-info border-4 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted fw-bold mb-1">TỔNG SỐ CAMERA</h6>
                  <h3 className="fw-bold mb-0">{stats.totalCameras}</h3>
                </div>
                <FaCamera className="fs-1 text-info opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm border-start border-success border-4 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted fw-bold mb-1">ĐANG HOẠT ĐỘNG</h6>
                  <h3 className="fw-bold text-success mb-0">{stats.activeCameras}</h3>
                </div>
                <FaCheckCircle className="fs-1 text-success opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm border-start border-danger border-4 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted fw-bold mb-1">MẤT KẾT NỐI / LỖI</h6>
                  <h3 className="fw-bold text-danger mb-0">{stats.offlineCameras}</h3>
                </div>
                <FaExclamationTriangle className="fs-1 text-danger opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- SECTION 2: HIỆU SUẤT VÀ BẢNG CHI TIẾT --- */}
      <Row className="g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pt-3 pb-0">
              <h5 className="fw-bold">Độ ổn định hệ thống</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center text-center">
              <h1 className="display-4 fw-bold text-primary mb-3">{activePercentage}%</h1>
              <ProgressBar 
                now={activePercentage} 
                variant={activePercentage > 80 ? "success" : activePercentage > 50 ? "warning" : "danger"} 
                style={{ height: '15px' }} 
              />
              <p className="text-muted mt-3 small">
                Tỷ lệ camera đang hoạt động bình thường trên toàn hệ thống.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pt-3 pb-0">
              <h5 className="fw-bold">Danh sách Camera cần chú ý</h5>
            </Card.Header>
            <Card.Body className="p-0 mt-3">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 px-4">Mã Camera</th>
                    <th className="border-0">Vị trí</th>
                    <th className="border-0">Địa chỉ IP</th>
                    <th className="border-0 text-end px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {/* SỬA LỖI Ở ĐÂY: Dùng showAll để quyết định cắt 5 dòng hay lấy hết */}
                  {camerasData.length > 0 ? camerasData.slice(0, showAll ? camerasData.length : 5).map((cam) => {
                    const areaName = areasData.find(a => a.id === cam.area)?.area_name || 'Chưa rõ';
                    return (
                      <tr key={cam.id}>
                        <td className="px-4 fw-bold">{cam.code || `CAM_${cam.id}`}</td>
                        <td>{cam.location_name} (Q. {areaName})</td>
                        <td className="font-monospace">{cam.ip_address}</td>
                        <td className="text-end px-4">
                          {/* Đã giữ nguyên logic màu: ACTIVE màu xanh, còn lại (bao gồm MAINTENANCE) màu đỏ */}
                          <Badge bg={cam.status === 'ACTIVE' ? 'success' : 'danger'}>
                            {cam.status || 'OFFLINE'}
                          </Badge>
                        </td>
                      </tr>
                    )
                  }) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted p-4">Chưa có dữ liệu camera</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
            {/* SỬA LỖI Ở ĐÂY: Thêm sự kiện onClick để thay đổi biến showAll */}
            {camerasData.length > 5 && (
              <Card.Footer 
                className="bg-white text-center py-3" 
                style={{cursor: 'pointer'}}
                onClick={() => setShowAll(!showAll)}
              >
                <small className="text-primary fw-bold">
                  {showAll ? "Thu gọn danh sách" : "Xem toàn bộ danh sách..."}
                </small>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReportPage;