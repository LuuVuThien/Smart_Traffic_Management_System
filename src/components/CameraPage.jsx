import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, Modal, ListGroup, Form, Tabs, Tab } from 'react-bootstrap';
// Thêm icon FaEdit (Sửa) và FaTrash (Xóa)
import { FaVideo, FaMapMarkerAlt, FaArrowLeft, FaInfoCircle, FaHistory, FaCogs, FaSave, FaPowerOff, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function CameraPage() {
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [configCamera, setConfigCamera] = useState(null);
  
  // 1. Quản lý danh sách quận
  const [districts, setDistricts] = useState([
    { id: 1, name: 'Hải Châu', cameraCount: 24, status: 'Ổn định' },
    { id: 2, name: 'Thanh Khê', cameraCount: 18, status: 'Cảnh báo' },
    { id: 3, name: 'Sơn Trà', cameraCount: 20, status: 'Ổn định' },
    { id: 4, name: 'Liên Chiểu', cameraCount: 15, status: 'Ổn định' },
    { id: 5, name: 'Cẩm Lệ', cameraCount: 12, status: 'Bảo trì' },
    { id: 6, name: 'Ngũ Hành Sơn', cameraCount: 16, status: 'Ổn định' },
  ]);

  // --- STATE CHO THÊM MỚI ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDistrict, setNewDistrict] = useState({ name: '', cameraCount: 0, status: 'Ổn định' });

  // --- STATE CHO CHỈNH SỬA (Mới thêm) ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null); // Lưu quận đang được sửa

  // --- HÀM XỬ LÝ (ACTIONS) ---

  // 1. Thêm quận
  const handleAddDistrict = () => {
    if (newDistrict.name.trim()) {
      setDistricts([...districts, { ...newDistrict, id: Date.now() }]); // Dùng Date.now() để tạo ID ko trùng
      setShowAddModal(false);
      setNewDistrict({ name: '', cameraCount: 0, status: 'Ổn định' });
    }
  };

  // 2. Xóa quận (Mới thêm)
  const handleDeleteDistrict = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quận này không? Hành động này không thể hoàn tác.")) {
      setDistricts(districts.filter(district => district.id !== id));
    }
  };

  // 3. Chuẩn bị dữ liệu để Sửa (Mới thêm)
  const openEditModal = (district) => {
    setEditingDistrict(district); // Nạp dữ liệu cũ vào form
    setShowEditModal(true);
  };

  // 4. Lưu cập nhật (Mới thêm)
  const handleUpdateDistrict = () => {
    setDistricts(districts.map(d => d.id === editingDistrict.id ? editingDistrict : d));
    setShowEditModal(false);
    setEditingDistrict(null);
  };

  // --- MODAL THÊM QUẬN (Giữ nguyên logic cũ) ---
  const renderAddDistrictModal = () => (
    <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-success">➕ Thêm Quận Quản Lý</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Tên Quận</Form.Label>
            <Form.Control type="text" placeholder="Ví dụ: Hòa Vang" onChange={(e) => setNewDistrict({...newDistrict, name: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Số lượng Camera</Form.Label>
            <Form.Control type="number" onChange={(e) => setNewDistrict({...newDistrict, cameraCount: parseInt(e.target.value) || 0})} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Trạng thái hệ thống</Form.Label>
            <Form.Select onChange={(e) => setNewDistrict({...newDistrict, status: e.target.value})}>
              <option value="Ổn định">Ổn định</option>
              <option value="Cảnh báo">Cảnh báo</option>
              <option value="Bảo trì">Bảo trì</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Hủy</Button>
        <Button variant="success" onClick={handleAddDistrict}>Xác nhận</Button>
      </Modal.Footer>
    </Modal>
  );

  // --- MODAL SỬA QUẬN (Mới thêm) ---
  const renderEditDistrictModal = () => (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
      <Modal.Header closeButton className="bg-warning">
        <Modal.Title className="fw-bold text-dark">✏️ Chỉnh sửa thông tin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editingDistrict && (
            <Form>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Tên Quận</Form.Label>
                <Form.Control 
                    type="text" 
                    value={editingDistrict.name} 
                    onChange={(e) => setEditingDistrict({...editingDistrict, name: e.target.value})} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Số lượng Camera</Form.Label>
                <Form.Control 
                    type="number" 
                    value={editingDistrict.cameraCount} 
                    onChange={(e) => setEditingDistrict({...editingDistrict, cameraCount: parseInt(e.target.value) || 0})} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Trạng thái hệ thống</Form.Label>
                <Form.Select 
                    value={editingDistrict.status} 
                    onChange={(e) => setEditingDistrict({...editingDistrict, status: e.target.value})}
                >
                <option value="Ổn định">Ổn định</option>
                <option value="Cảnh báo">Cảnh báo</option>
                <option value="Bảo trì">Bảo trì</option>
                </Form.Select>
            </Form.Group>
            </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
        <Button variant="warning" onClick={handleUpdateDistrict}>Lưu thay đổi</Button>
      </Modal.Footer>
    </Modal>
  );

  // --- (CÁC PHẦN CONFIG VÀ CAMERA INFO GIỮ NGUYÊN KHÔNG ĐỤNG TỚI) ---
  const renderConfigModal = () => (
    <Modal show={configCamera !== null} onHide={() => setConfigCamera(null)} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title><FaCogs className="me-2"/>Cấu hình hệ thống: {configCamera?.code}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="general" className="mb-3">
          <Tab eventKey="general" title="Thông tin chung">
            <Form className="p-2">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tên gợi nhớ</Form.Label>
                    <Form.Control type="text" defaultValue={configCamera?.code} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Địa chỉ IP tĩnh</Form.Label>
                    <Form.Control type="text" defaultValue={`192.168.1.${100 + (configCamera?.id || 0)}`} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Vị trí lắp đặt cụ thể</Form.Label>
                <Form.Control as="textarea" rows={2} defaultValue={`Ngã tư trung tâm Quận ${activeDistrict?.name}`} />
              </Form.Group>
            </Form>
          </Tab>
          <Tab eventKey="video" title="Video & AI">
             <div className="p-3 text-center text-muted">Nội dung cấu hình Video & AI...</div>
          </Tab>
          <Tab eventKey="maintenance" title="Bảo trì">
             <div className="p-3 text-center text-muted">Nội dung bảo trì...</div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setConfigCamera(null)}>Hủy bỏ</Button>
        <Button variant="primary" onClick={() => { alert('Đã lưu cấu hình!'); setConfigCamera(null); }}>
          <FaSave className="me-2"/>Lưu thay đổi
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderCameraInfo = () => (
    <Modal show={selectedCamera !== null} onHide={() => setSelectedCamera(null)} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title><FaInfoCircle className="me-2"/>Chi tiết Camera: {selectedCamera?.code}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={7}>
            <div style={{ width: '100%', height: '300px', background: '#000', borderRadius: '8px' }} className="d-flex align-items-center justify-content-center">
               <span className="text-success fw-bold animate-pulse">● STREAMING LIVE VIDEO...</span>
            </div>
          </Col>
          <Col md={5}>
            <h5 className="fw-bold mb-3">Thông số hiện tại</h5>
            <ListGroup variant="flush" className="small border rounded">
              <ListGroup.Item><strong>Vị trí:</strong> Quận {activeDistrict?.name}</ListGroup.Item>
              <ListGroup.Item><strong>IP:</strong> 192.168.1.{100 + (selectedCamera?.id || 0)}</ListGroup.Item>
              <ListGroup.Item><strong>Tình trạng:</strong> <Badge bg="success">Hoạt động tốt</Badge></ListGroup.Item>
            </ListGroup>
            <div className="mt-4 d-grid gap-2">
              <Button variant="outline-danger" size="sm"><FaHistory className="me-1"/> Xem lịch sử</Button>
              <Button variant="primary" size="sm" onClick={() => { setConfigCamera(selectedCamera); setSelectedCamera(null); }}>
                <FaCogs className="me-1"/> Cấu hình thiết bị
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );

  // --- LƯỚI CAMERA (GIỮ NGUYÊN) ---
  const renderCameraGrid = () => {
    const cameraArray = Array.from({ length: activeDistrict.cameraCount }, (_, i) => ({
        id: i + 1,
        code: `CAM_${activeDistrict.name.toUpperCase()}_${i + 1}`
    }));

    return (
      <div>
        <Button variant="link" className="mb-3 p-0 text-decoration-none" onClick={() => setActiveDistrict(null)}>
          <FaArrowLeft className="me-2" /> Quay lại danh sách quận
        </Button>
        <h4 className="fw-bold mb-4">📹 Quận {activeDistrict.name} ({activeDistrict.cameraCount} cam)</h4>
        <Row className="g-3">
          {cameraArray.map((cam) => (
            <Col key={cam.id} xl={3} lg={4} md={6}>
              <Card className="bg-dark text-white border-0 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => setSelectedCamera(cam)}>
                <div style={{ height: '140px', background: '#222' }} className="d-flex align-items-center justify-content-center border-bottom border-secondary">
                  <small className="text-muted">{cam.code}</small>
                </div>
                <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                  <span className="small">{cam.code}</span>
                  <Badge bg="success" pill style={{fontSize: '9px'}}>Live</Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div className="p-4 h-100 overflow-auto bg-light">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-0">🎥 Hệ thống Camera Live</h2>
          <p className="text-muted fw-semibold">Quản lý và thiết lập thông số kỹ thuật</p>
        </div>
        {!activeDistrict && (
          <Button variant="success" className="fw-bold shadow-sm" onClick={() => setShowAddModal(true)}>
            <FaPlus className="me-2"/> Thêm Quận
          </Button>
        )}
      </div>
      <hr />
      
      <div className="mt-4">
        {activeDistrict ? renderCameraGrid() : (
          <Row className="g-4">
            {districts.map((d) => (
              <Col key={d.id} md={4} sm={6}>
                <Card className="h-100 shadow-sm border-0 border-top border-primary border-4">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                      <FaMapMarkerAlt className="text-primary fs-4" />
                      <Badge bg={d.status === 'Ổn định' ? 'success' : 'warning'}>{d.status}</Badge>
                    </div>
                    <h5 className="fw-bold">Quận {d.name}</h5>
                    <p className="text-muted small">{d.cameraCount} Camera</p>
                    
                    {/* CẬP NHẬT GIAO DIỆN THẺ ĐỂ CÓ NÚT SỬA VÀ XÓA */}
                    <div className="d-flex gap-2 mt-3">
                        {/* Nút Xem chiếm phần lớn diện tích */}
                        <Button variant="outline-primary" size="sm" className="flex-grow-1 fw-bold" onClick={() => setActiveDistrict(d)}>
                            Xem
                        </Button>
                        
                        {/* Nút Sửa */}
                        <Button variant="outline-warning" size="sm" onClick={() => openEditModal(d)} title="Sửa thông tin">
                            <FaEdit />
                        </Button>

                        {/* Nút Xóa */}
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDistrict(d.id)} title="Xóa quận">
                            <FaTrash />
                        </Button>
                    </div>

                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {renderCameraInfo()}
      {renderConfigModal()}
      {renderAddDistrictModal()}
      {renderEditDistrictModal()} {/* Render modal sửa */}
    </div>
  );
}

// ... (Các phần import và state cũ giữ nguyên)

// --- HÀM HELPER: Lấy ảnh giao thông ngẫu nhiên theo ID camera ---
// Giúp mỗi camera có 1 hình ảnh khác nhau, không bị trùng lặp
const getCamImage = (id) => `https://images.unsplash.com/photo-${id % 2 === 0 ? '1566245904832-a279be6a113a' : '1549429781-8b093375618b'}?auto=format&fit=crop&w=600&q=80`;

// --- MODAL THÔNG TIN CHI TIẾT (Có hình ảnh thực tế) ---
const renderCameraInfo = () => (
  <Modal show={selectedCamera !== null} onHide={() => setSelectedCamera(null)} size="lg" centered>
    <Modal.Header closeButton className="bg-dark text-white border-0">
      <Modal.Title><FaInfoCircle className="me-2"/>{selectedCamera?.code}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-0 bg-black">
      <Row className="g-0">
        <Col md={8} className="position-relative">
          {/* MÀN HÌNH CAMERA CHÍNH */}
          <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
             {/* Ảnh giả lập luồng video */}
             <img 
               src={getCamImage(selectedCamera?.id)} 
               alt="Camera Feed" 
               style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
             />
             
             {/* Lớp phủ thông tin trên video (OSD) */}
             <div className="position-absolute top-0 start-0 w-100 p-3 d-flex justify-content-between text-white" 
                  style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>
                <span className="fw-bold font-monospace">
                   🔴 REC <span className="ms-2">{new Date().toLocaleTimeString()}</span>
                </span>
                <span className="font-monospace text-warning">CAM {selectedCamera?.id} - Q.{activeDistrict?.name.toUpperCase()}</span>
             </div>

             {/* Khung nhận diện AI (Giả lập) */}
             <div className="position-absolute border border-success border-2 rounded" 
                  style={{ top: '40%', left: '30%', width: '100px', height: '60px', opacity: 0.7 }}>
                  <span className="bg-success text-white px-1 small position-absolute top-0 start-0" style={{fontSize: '10px'}}>Car: 98%</span>
             </div>
          </div>
        </Col>

        {/* CỘT THÔNG TIN BÊN CẠNH */}
        <Col md={4} className="bg-light p-3 border-start">
          <h5 className="fw-bold mb-3 border-bottom pb-2">Thông số kỹ thuật</h5>
          <ListGroup variant="flush" className="small mb-3">
            <ListGroup.Item className="bg-transparent px-0 py-2">
                <strong>📍 Vị trí:</strong> Ngã tư {activeDistrict?.name}
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent px-0 py-2">
                <strong>📡 IP Address:</strong> 192.168.1.{100 + (selectedCamera?.id || 0)}
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent px-0 py-2">
                <strong>📐 Độ phân giải:</strong> 4K (3840x2160)
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent px-0 py-2">
                <strong>💾 Lưu trữ:</strong> HDD 85% (Còn 2 ngày)
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent px-0 py-2">
                <strong>⚡ Tình trạng:</strong> <Badge bg="success">Tín hiệu tốt</Badge>
            </ListGroup.Item>
          </ListGroup>

          <div className="d-grid gap-2">
            <Button variant="outline-dark" size="sm"><FaHistory className="me-2"/>Xem lại (Playback)</Button>
            <Button variant="primary" size="sm" onClick={() => { setConfigCamera(selectedCamera); setSelectedCamera(null); }}>
               <FaCogs className="me-2"/>Cấu hình thiết bị
            </Button>
          </div>
        </Col>
      </Row>
    </Modal.Body>
  </Modal>
);

// --- LƯỚI CAMERA (Hiển thị ảnh thu nhỏ thay vì màu đen) ---
const renderCameraGrid = () => {
  const cameraArray = Array.from({ length: activeDistrict.cameraCount }, (_, i) => ({ 
      id: i + 1, 
      code: `CAM_${activeDistrict.name.toUpperCase()}_${i + 1}` 
  }));

  return (
    <div>
      <Button variant="link" className="mb-3 p-0 text-decoration-none fw-bold" onClick={() => setActiveDistrict(null)}>
        <FaArrowLeft className="me-2" /> Quay lại danh sách quận
      </Button>
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">📹 Giám sát: Quận {activeDistrict.name}</h4>
          <Badge bg="primary">{activeDistrict.cameraCount} Camera Online</Badge>
      </div>
      
      <Row className="g-3">
        {cameraArray.map((cam) => (
          <Col key={cam.id} xl={3} lg={4} md={6}>
            <Card className="border-0 shadow-sm overflow-hidden h-100 hover-card" 
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }} 
                  onClick={() => setSelectedCamera(cam)}>
              
              {/* PHẦN HÌNH ẢNH CAMERA */}
              <div className="position-relative" style={{ height: '160px' }}>
                <img 
                   src={getCamImage(cam.id)} 
                   alt="Cam Thumbnail" 
                   style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }} 
                />
                
                {/* Nhãn LIVE đè lên ảnh */}
                <div className="position-absolute top-0 end-0 m-2">
                   <Badge bg="danger" className="animate-pulse">● LIVE</Badge>
                </div>
                
                {/* Tên Cam đè lên ảnh (Góc dưới) */}
                <div className="position-absolute bottom-0 start-0 w-100 p-2" 
                     style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                   <small className="text-white font-monospace">{cam.code}</small>
                </div>
              </div>

              {/* PHẦN FOOTER CARD */}
              <Card.Footer className="bg-white border-0 py-2 d-flex justify-content-between align-items-center">
                 <small className="text-muted"><FaMapMarkerAlt className="me-1"/>Ngã tư {cam.id}</small>
                 <small className="text-success fw-bold" style={{fontSize: '11px'}}>120 Kbps</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CameraPage;