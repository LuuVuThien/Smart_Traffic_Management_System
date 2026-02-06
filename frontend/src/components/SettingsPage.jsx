import React, { useState, useRef } from 'react'; // Nhớ import useRef
import { Row, Col, Card, Form, Button, Badge, Table, Modal } from 'react-bootstrap';
import { FaUserCircle, FaUsers, FaPlus, FaSave, FaBell, FaMoon, FaEdit, FaSignOutAlt, FaTimes, FaCamera, FaPhoneAlt, FaLock } from 'react-icons/fa';

function SettingsPage({ currentUser, allUsers, onAddPersonnel, onLogout }) {
  
  // --- STATE ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State form sửa hồ sơ (Khởi tạo bằng dữ liệu người dùng hiện tại)
  const [editForm, setEditForm] = useState({ ...currentUser });

  // State form thêm nhân sự mới
  const [newStaff, setNewStaff] = useState({
      name: '', username: '', password: '', email: '', role: 'Police'
  });

  // --- 1. LOGIC ĐỔI ẢNH ĐẠI DIỆN (ĐÃ KHÔI PHỤC) ---
  const fileInputRef = useRef(null); // Tạo tham chiếu đến thẻ input ẩn

  const handleTriggerFileSelect = () => {
    // Khi bấm vào icon Camera -> Kích hoạt thẻ input file
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Tạo URL ảo để xem trước ảnh
        const previewUrl = URL.createObjectURL(file);
        // Cập nhật vào form sửa đổi
        setEditForm({ ...editForm, avatar: previewUrl });
    }
  };
  // ------------------------------------------------

  // Logic sửa text (Tên, Email)
  const handleEditChange = (e) => {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  
  const handleSaveProfile = () => {
      setIsEditing(false);
      // Cập nhật lại thông tin hiển thị (Thực tế sẽ gọi API)
      currentUser.name = editForm.name;
      currentUser.email = editForm.email;
      currentUser.avatar = editForm.avatar; // Lưu ảnh mới
      alert("Đã cập nhật hồ sơ thành công!");
  };

  // Logic thêm nhân sự
  const handleModalChange = (e) => setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  const handleSavePersonnel = () => {
      if(!newStaff.name || !newStaff.username || !newStaff.password) return alert("Thiếu thông tin!");
      onAddPersonnel(newStaff);
      setShowModal(false);
      setNewStaff({ name: '', username: '', password: '', email: '', role: 'Police' });
      alert("Đã thêm nhân sự!");
  };

  const getRoleBadge = (role) => {
      if(role === 'Admin') return <Badge bg="danger">Admin</Badge>;
      if(role === 'Police') return <Badge bg="success">Police</Badge>;
      return <Badge bg="secondary">User</Badge>;
  };

  return (
    <div className="p-4 bg-light h-100 overflow-auto">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-bold m-0"><FaUserCircle className="me-2"/>Cài đặt & Quản trị</h2>
          <Button variant="outline-danger" onClick={onLogout}>
              <FaSignOutAlt className="me-2"/> Đăng xuất
          </Button>
      </div>

      <Row>
        {/* CỘT TRÁI: HỒ SƠ CÁ NHÂN */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0 text-center p-3">
             <Card.Body>
                
                {/* --- KHU VỰC ẢNH ĐẠI DIỆN --- */}
                <div className="position-relative d-inline-block mb-3">
                    <img 
                        // Nếu đang sửa thì lấy ảnh trong editForm, nếu không lấy ảnh gốc
                        src={isEditing ? editForm.avatar : currentUser.avatar} 
                        alt="Avatar" 
                        className="rounded-circle border border-3 border-light shadow-sm" 
                        style={{width:'120px', height:'120px', objectFit: 'cover'}}
                    />
                    
                    {/* Nút Camera chỉ hiện khi đang ở chế độ Sửa (isEditing = true) */}
                    {isEditing && (
                        <div 
                            className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow p-2 border"
                            style={{ cursor: 'pointer', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={handleTriggerFileSelect}
                        >
                            <FaCamera className="text-primary" size={16}/>
                        </div>
                    )}

                    {/* Input ẩn để chọn file */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                    />
                </div>
                {/* --------------------------- */}

                {/* FORM CHỈNH SỬA */}
                {isEditing ? (
                    <div className="text-start animate__animated animate__fadeIn">
                        <Form.Group className="mb-2">
                            <Form.Label className="small text-muted">Họ tên</Form.Label>
                            <Form.Control type="text" name="name" value={editForm.name} onChange={handleEditChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small text-muted">Email</Form.Label>
                            <Form.Control type="email" name="email" value={editForm.email} onChange={handleEditChange} />
                        </Form.Group>
                        
                        <div className="d-grid gap-2 d-flex">
                            <Button variant="secondary" size="sm" className="flex-fill" onClick={() => {
                                setIsEditing(false);
                                setEditForm({ ...currentUser }); // Reset lại nếu hủy
                            }}>
                                <FaTimes/> Hủy
                            </Button>
                            <Button variant="success" size="sm" className="flex-fill" onClick={handleSaveProfile}>
                                <FaSave/> Lưu
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h4 className="fw-bold">{currentUser.name}</h4>
                        <p className="text-muted mb-1">{currentUser.email}</p>
                        <div className="mb-3">{getRoleBadge(currentUser.role)}</div>
                        
                        <Button variant="outline-primary" size="sm" className="w-100" onClick={() => setIsEditing(true)}>
                            <FaEdit className="me-2"/> Chỉnh sửa hồ sơ
                        </Button>
                    </>
                )}
             </Card.Body>
          </Card>
        </Col>

        {/* CỘT PHẢI: QUẢN TRỊ (Giữ nguyên) */}
        <Col md={8}>
          {currentUser.role === 'Admin' ? (
              <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white fw-bold border-bottom d-flex justify-content-between align-items-center">
                    <span><FaUsers className="me-2 text-primary"/> Danh sách Tài khoản</span>
                    <Button size="sm" variant="primary" onClick={() => setShowModal(true)}><FaPlus className="me-1"/> Thêm nhân sự</Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light text-muted">
                        <tr><th className="ps-3">Họ tên</th><th>User</th><th>Role</th><th>TT</th></tr>
                    </thead>
                    <tbody>
                        {allUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="ps-3 fw-bold">{user.name}</td>
                                <td>{user.username}</td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td><span className={`text-${user.status==='Online'?'success':'secondary'} small`}>● {user.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
          ) : (
             <Card className="p-4 text-center text-muted mb-4"><h4>Khu vực dành cho Admin.</h4></Card>
          )}

          {/* Cấu hình chung */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-bold border-bottom"><FaBell className="me-2 text-warning"/> Cấu hình chung</Card.Header>
            <Card.Body>
               <Form>
                 <Form.Check type="switch" label="Nhận thông báo sự cố" defaultChecked className="mb-3"/>
                 <Form.Check type="switch" label={<span><FaMoon className="me-1"/> Chế độ tối</span>} />
               </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL THÊM NHÂN SỰ */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Thêm Nhân Sự</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
              <Form.Group className="mb-3"><Form.Label>Họ tên</Form.Label><Form.Control type="text" name="name" value={newStaff.name} onChange={handleModalChange}/></Form.Group>
              <Row>
                  <Col><Form.Group className="mb-3"><Form.Label>User</Form.Label><Form.Control type="text" name="username" value={newStaff.username} onChange={handleModalChange}/></Form.Group></Col>
                  <Col><Form.Group className="mb-3"><Form.Label>Pass</Form.Label><Form.Control type="password" name="password" value={newStaff.password} onChange={handleModalChange}/></Form.Group></Col>
              </Row>
              <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" value={newStaff.role} onChange={handleModalChange}>
                      <option value="Police">Cảnh sát (Police)</option>
                      <option value="Admin">Admin</option>
                  </Form.Select>
              </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSavePersonnel}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SettingsPage;