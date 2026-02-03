// src/components/ReportPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Form, Badge } from 'react-bootstrap';
import { FaDownload, FaChartLine, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';
// Import thư viện biểu đồ
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

function ReportPage() {

  // --- 1. KHO DỮ LIỆU (STATE) ---
  const [hotspots, setHotspots] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- CẬP NHẬT DỮ LIỆU GIAO THÔNG (Thêm Xe tải & Xe Bus) ---
  const trafficData = [
    // Giờ thấp điểm sáng
    { time: '06:00', cars: 120, bikes: 200, trucks: 40, buses: 15 },
    // Giờ cao điểm sáng (Xe tải bị cấm hoặc ít hơn, xe máy tăng vọt)
    { time: '09:00', cars: 450, bikes: 800, trucks: 30, buses: 40 },
    // Giờ trưa (Xe tải bắt đầu chạy nhiều hơn)
    { time: '12:00', cars: 300, bikes: 500, trucks: 80, buses: 30 },
    // Giờ chiều
    { time: '15:00', cars: 250, bikes: 400, trucks: 90, buses: 35 },
    // Giờ cao điểm chiều
    { time: '17:00', cars: 600, bikes: 1100, trucks: 20, buses: 50 },
    // Giờ tối (Xe tải hoạt động mạnh)
    { time: '20:00', cars: 200, bikes: 300, trucks: 150, buses: 20 },
  ];

  const violationData = [
    { name: 'Vượt đèn đỏ', value: 40 },
    { name: 'Lấn làn', value: 30 },
    { name: 'Không mũ BH', value: 20 },
    { name: 'Ngược chiều', value: 10 },
  ];
  const COLORS = ['#dc3545', '#ffc107', '#0d6efd', '#6c757d'];

  // --- 2. GIẢ LẬP LẤY DỮ LIỆU TỪ SERVER ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockApiData = [
        { id: 1, location: "Ngã tư Điện Biên Phủ", traffic: "5,000 xe/h", count: 450, status: "critical", statusText: "Rất xấu" },
        { id: 2, location: "Cầu Rồng (Hướng biển)", traffic: "4,200 xe/h", count: 320, status: "warning", statusText: "Cảnh báo" },
        { id: 3, location: "Đường Nguyễn Văn Linh", traffic: "3,800 xe/h", count: 150, status: "stable", statusText: "Ổn định" },
        { id: 4, location: "Ngã ba Huế", traffic: "6,000 xe/h", count: 500, status: "critical", statusText: "Ùn tắc" },
        { id: 5, location: "Đường Bạch Đằng", traffic: "2,000 xe/h", count: 50, status: "stable", statusText: "Thông thoáng" },
      ];
      setHotspots(mockApiData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'critical') return 'danger';
    if (status === 'warning') return 'warning';
    return 'success';
  };

  return (
    // Style scrollbar để cuộn được trang này độc lập
    <div className="p-4 bg-light" style={{ height: '100vh', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark m-0">📊 Báo Cáo Thống Kê</h2>
          <p className="text-muted m-0">Tổng hợp dữ liệu giao thông tháng 10/2023</p>
        </div>
        <div className="d-flex gap-2">
           <Form.Select style={{ width: '150px' }}>
              <option>Tháng này</option>
              <option>Tuần này</option>
           </Form.Select>
           <Button variant="primary">
             <FaDownload className="me-2"/> Xuất Excel
           </Button>
        </div>
      </div>

      {/* 3 THẺ SỐ LIỆU */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-4 border-primary p-3">
             <div className="d-flex justify-content-between align-items-center">
                <div>
                   <div className="text-muted small fw-bold">TỔNG LƯỢT XE</div>
                   <h3 className="fw-bold text-primary m-0">158,200</h3>
                </div>
                <FaChartLine className="fs-1 text-primary opacity-25" />
             </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-4 border-danger p-3">
             <div className="d-flex justify-content-between align-items-center">
                <div>
                   <div className="text-muted small fw-bold">TỔNG VI PHẠM</div>
                   <h3 className="fw-bold text-danger m-0">1,245</h3>
                </div>
                <FaExclamationTriangle className="fs-1 text-danger opacity-25" />
             </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-4 border-success p-3">
             <div className="d-flex justify-content-between align-items-center">
                <div>
                   <div className="text-muted small fw-bold">ƯỚC TÍNH PHẠT</div>
                   <h3 className="fw-bold text-success m-0">3.5 Tỷ VNĐ</h3>
                </div>
                <FaMoneyBillWave className="fs-1 text-success opacity-25" />
             </div>
          </Card>
        </Col>
      </Row>

      {/* BIỂU ĐỒ */}
      <Row className="mb-4 g-3">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold py-3">
              📈 Lưu lượng giao thông theo giờ (Xe/Giờ)
            </Card.Header>
            <Card.Body>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* Đường Ô tô (Xanh dương) */}
                    <Line type="monotone" name="Ô tô" dataKey="cars" stroke="#0d6efd" strokeWidth={2} dot={false} />
                    {/* Đường Xe máy (Vàng) */}
                    <Line type="monotone" name="Xe máy" dataKey="bikes" stroke="#ffc107" strokeWidth={2} dot={false} />
                    {/* MỚI: Đường Xe tải (Tím đậm) */}
                    <Line type="monotone" name="Xe tải" dataKey="trucks" stroke="#6f42c1" strokeWidth={2} dot={false} />
                    {/* MỚI: Đường Xe Bus (Xanh lá) */}
                    <Line type="monotone" name="Xe Bus" dataKey="buses" stroke="#198754" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold py-3">
              🍰 Tỷ lệ các lỗi vi phạm
            </Card.Header>
            <Card.Body>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={violationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {violationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* BẢNG DỮ LIỆU ĐỘNG (TOP 5) */}
      <Card className="border-0 shadow-sm mb-5">
        <Card.Header className="bg-white fw-bold py-3">
           🚦 Top 5 Điểm nóng ùn tắc & Vi phạm
        </Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="m-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th>STT</th>
                <th>Khu vực / Tuyến đường</th>
                <th>Lưu lượng TB</th>
                <th>Số vi phạm (Tháng)</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="5" className="text-center p-3">⏳ Đang tải dữ liệu...</td></tr>
              ) : (
                 hotspots.map((item, index) => (
                    <tr key={item.id}>
                       <td>{index + 1}</td>
                       <td className="fw-bold">{item.location}</td>
                       <td>{item.traffic}</td>
                       <td className={item.count > 300 ? "text-danger fw-bold" : "text-dark"}>
                          {item.count}
                       </td>
                       <td>
                          <Badge bg={getStatusColor(item.status)} className="p-2">
                             {item.statusText}
                          </Badge>
                       </td>
                    </tr>
                 ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      <div style={{ height: '50px' }}></div> 
    </div>
  );
}

export default ReportPage;