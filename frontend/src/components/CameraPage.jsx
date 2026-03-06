import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Badge, Button, Modal, ListGroup, Form, Tabs, Tab, Spinner } from 'react-bootstrap';
import { FaVideo, FaMapMarkerAlt, FaArrowLeft, FaInfoCircle, FaHistory, FaCogs, FaSave, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Cấu hình URL cơ sở của Backend (Nên để trong file .env sau này)
const API_BASE_URL = 'http://127.0.0.1:8000/api';

function CameraPage() {
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [configCamera, setConfigCamera] = useState(null);
  
  // --- STATE LƯU DỮ LIỆU TỪ DATABASE ---
  const [districts, setDistricts] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE CHO THÊM MỚI & CHỈNH SỬA ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDistrict, setNewDistrict] = useState({ code: '', name: '', description: '' });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);

  // --- 1. LẤY DANH SÁCH QUẬN (AREAS) ---
  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/areas/`);
      const mappedData = response.data.map(item => ({
        id: item.id,
        name: item.area_name,
        code: item.area_code,
        status: 'Ổn định', // Có thể cập nhật logic status sau
        description: item.description
      }));
      setDistricts(mappedData);
    } catch (error) {
      console.error("Lỗi lấy danh sách quận:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LẤY DANH SÁCH CAMERA THEO QUẬN ---
  const fetchCamerasByDistrict = async (districtId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cameras/`);
      const filteredCameras = response.data.filter(cam => cam.area === districtId);
      setCameras(filteredCameras);
    } catch (error) {
      console.error("Lỗi lấy danh sách camera:", error);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (activeDistrict) {
      fetchCamerasByDistrict(activeDistrict.id);
    }
  }, [activeDistrict]);

  // --- 3. THÊM QUẬN MỚI ---
  const handleAddDistrict = async () => {
    if (newDistrict.name.trim() && newDistrict.code.trim()) {
      try {
        await axios.post(`${API_BASE_URL}/areas/`, {
          area_code: newDistrict.code,
          area_name: newDistrict.name,
          description: newDistrict.description
        });
        setShowAddModal(false);
        setNewDistrict({ code: '', name: '', description: '' });
        fetchDistricts();
      } catch (error) {
        alert("Lỗi khi thêm quận!");
      }
    }
  };

  // --- 4. XÓA QUẬN ---
  const handleDeleteDistrict = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quận này trên Database không?")) {
      try {
        await axios.delete(`${API_BASE_URL}/areas/${id}/`);
        fetchDistricts();
      } catch (error) {
        alert("Không thể xóa quận này (có thể do đang chứa Camera)");
      }
    }
  };

  // --- 5. CẬP NHẬT QUẬN ---
  const openEditModal = (district) => {
    setEditingDistrict(district);
    setShowEditModal(true);
  };

  const handleUpdateDistrict = async () => {
    try {
      await axios.put(`${API_BASE_URL}/areas/${editingDistrict.id}/`, {
        area_code: editingDistrict.code,
        area_name: editingDistrict.name,
        description: editingDistrict.description
      });
      setShowEditModal(false);
      setEditingDistrict(null);
      fetchDistricts();
    } catch (error) {
      alert("Lỗi khi cập nhật thông tin quận!");
    }
  };

  // --- HELPER: Ảnh giả lập ---
  const getCamImage = (id) => `https://images.unsplash.com/photo-${id % 2 === 0 ? '1566245904832-a279be6a113a' : '1549429781-8b093375618b'}?auto=format&fit=crop&w=600&q=80`;

  // --- GIAO DIỆN CÁC MODAL ---
  const renderAddDistrictModal = () => (
    <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-success">➕ Thêm Quận Mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Mã Quận (area_code)</Form.Label>
            <Form.Control type="text" placeholder="VD: Q_HV" value={newDistrict.code} onChange={(e) => setNewDistrict({...newDistrict, code: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Tên Quận (area_name)</Form.Label>
            <Form.Control type="text" placeholder="VD: Hòa Vang" value={newDistrict.name} onChange={(e) => setNewDistrict({...newDistrict, name: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Mô tả</Form.Label>
            <Form.Control as="textarea" rows={2} value={newDistrict.description} onChange={(e) => setNewDistrict({...newDistrict, description: e.target.value})} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Hủy</Button>
        <Button variant="success" onClick={handleAddDistrict}>Lưu lên Cloud</Button>
      </Modal.Footer>
    </Modal>
  );

  const renderEditDistrictModal = () => (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
      <Modal.Header closeButton className="bg-warning">
        <Modal.Title className="fw-bold text-dark">✏️ Chỉnh sửa thông tin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editingDistrict && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Mã Quận (area_code)</Form.Label>
              <Form.Control type="text" value={editingDistrict.code} onChange={(e) => setEditingDistrict({...editingDistrict, code: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tên Quận (area_name)</Form.Label>
              <Form.Control type="text" value={editingDistrict.name} onChange={(e) => setEditingDistrict({...editingDistrict, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Mô tả</Form.Label>
              <Form.Control as="textarea" rows={2} value={editingDistrict.description} onChange={(e) => setEditingDistrict({...editingDistrict, description: e.target.value})} />
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

  const renderConfigModal = () => (
    <Modal show={configCamera !== null} onHide={() => setConfigCamera(null)} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title><FaCogs className="me-2"/>Cấu hình hệ thống: {configCamera?.location_name || configCamera?.code}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="general" className="mb-3">
          <Tab eventKey="general" title="Thông tin chung">
            <Form className="p-2">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tên gợi nhớ</Form.Label>
                    <Form.Control type="text" defaultValue={configCamera?.location_name || configCamera?.code} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Địa chỉ IP tĩnh</Form.Label>
                    <Form.Control type="text" defaultValue={configCamera?.ip_address || `192.168.1.${100 + (configCamera?.id || 0)}`} />
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
      <Modal.Header closeButton className="bg-dark text-white border-0">
        <Modal.Title><FaInfoCircle className="me-2"/>{selectedCamera?.location_name || selectedCamera?.code}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 bg-black">
        <Row className="g-0">
          <Col md={8} className="position-relative">
            <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
               <img 
                 src={getCamImage(selectedCamera?.id)} 
                 alt="Camera Feed" 
                 style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
               />
               <div className="position-absolute top-0 start-0 w-100 p-3 d-flex justify-content-between text-white" 
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>
                  <span className="fw-bold font-monospace">
                      🔴 REC <span className="ms-2">{new Date().toLocaleTimeString()}</span>
                  </span>
                  <span className="font-monospace text-warning">CAM {selectedCamera?.id} - Q.{activeDistrict?.name.toUpperCase()}</span>
               </div>
               <div className="position-absolute border border-success border-2 rounded" 
                    style={{ top: '40%', left: '30%', width: '100px', height: '60px', opacity: 0.7 }}>
                   <span className="bg-success text-white px-1 small position-absolute top-0 start-0" style={{fontSize: '10px'}}>Car: 98%</span>
               </div>
            </div>
          </Col>
          <Col md={4} className="bg-light p-3 border-start">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Thông số kỹ thuật</h5>
            <ListGroup variant="flush" className="small mb-3">
              <ListGroup.Item className="bg-transparent px-0 py-2">
                  <strong>📍 Vị trí:</strong> Ngã tư {activeDistrict?.name}
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent px-0 py-2">
                  <strong>📡 IP Address:</strong> {selectedCamera?.ip_address || `192.168.1.${100 + (selectedCamera?.id || 0)}`}
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent px-0 py-2">
                  <strong>📐 Độ phân giải:</strong> 4K (3840x2160)
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent px-0 py-2">
                  <strong>💾 Lưu trữ:</strong> HDD 85% (Còn 2 ngày)
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent px-0 py-2">
                  <strong>⚡ Tình trạng:</strong> <Badge bg={selectedCamera?.status === 'ACTIVE' ? 'success' : 'secondary'}>{selectedCamera?.status || 'Tín hiệu tốt'}</Badge>
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

  // --- LƯỚI CAMERA ---
  const renderCameraGrid = () => (
    <div>
      <Button variant="link" className="mb-3 p-0 text-decoration-none fw-bold" onClick={() => setActiveDistrict(null)}>
        <FaArrowLeft className="me-2" /> Quay lại danh sách quận
      </Button>
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0"> Giám sát: {activeDistrict.name}</h4>
          <Badge bg="primary">{cameras.length} Camera Online</Badge>
      </div>
      
      <Row className="g-3">
        {cameras.length > 0 ? cameras.map((cam) => (
          <Col key={cam.id} xl={3} lg={4} md={6}>
            <Card className="border-0 shadow-sm overflow-hidden h-100 hover-card" 
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }} 
                  onClick={() => setSelectedCamera(cam)}>
              <div className="position-relative" style={{ height: '160px' }}>
                <img src={getCamImage(cam.id)} alt="Cam" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="position-absolute top-0 end-0 m-2">
                   <Badge bg="danger">● LIVE</Badge>
                </div>
                <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                   <small className="text-white font-monospace">{cam.location_name || cam.code}</small>
                </div>
              </div>
              <Card.Footer className="bg-white border-0 py-2 d-flex justify-content-between align-items-center">
                  <small className="text-muted"><FaMapMarkerAlt className="me-1"/>IP: {cam.ip_address}</small>
                  <Badge bg={cam.status === 'ACTIVE' ? 'success' : 'secondary'} style={{fontSize: '9px'}}>{cam.status}</Badge>
              </Card.Footer>
            </Card>
          </Col>
        )) : <div className="text-center p-5 text-muted w-100 border rounded bg-white">Chưa có camera nào được cấu hình tại khu vực này.</div>}
      </Row>
    </div>
  );

  return (
    <div className="p-4 h-100 overflow-auto bg-light">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-0">🎥 Hệ thống Camera Live</h2>
          <p className="text-muted fw-semibold">Dữ liệu trực tuyến từ Cloud Database (Neon)</p>
        </div>
        {!activeDistrict && (
          <Button variant="success" className="fw-bold shadow-sm" onClick={() => setShowAddModal(true)}>
            <FaPlus className="me-2"/> Thêm Quận
          </Button>
        )}
      </div>
      <hr />
      
      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" /> 
          <p className="mt-2 text-muted">Đang tải dữ liệu từ Database...</p>
        </div>
      ) : (
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
                      <h5 className="fw-bold">{d.name}</h5>
                      <p className="text-muted small mb-0">Mã: {d.code}</p>
                      <p className="text-muted small">{d.description || "Chưa có mô tả"}</p>
                      
                      <div className="d-flex gap-2 mt-3">
                        <Button variant="outline-primary" size="sm" className="flex-grow-1 fw-bold" onClick={() => setActiveDistrict(d)}>Xem</Button>
                        <Button variant="outline-warning" size="sm" onClick={() => openEditModal(d)} title="Sửa thông tin"><FaEdit /></Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDistrict(d.id)} title="Xóa quận"><FaTrash /></Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}

      {renderCameraInfo()}
      {renderConfigModal()}
      {renderAddDistrictModal()}
      {renderEditDistrictModal()}
    </div>
  );
}

export default CameraPage;