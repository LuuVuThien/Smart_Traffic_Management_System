import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUserPlus, FaSignInAlt, FaUser, FaStar, FaPhoneAlt, FaLock } from 'react-icons/fa';

// --- QUAN TRỌNG: Import logo bạn vừa lưu ---
// Nếu bạn để ảnh ở chỗ khác, hãy sửa đường dẫn này nhé
import logoStms from '../assets/logo-stms.png'; 

function LoginPage({ onLogin, onRegister }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
      username: '', password: '', name: '', email: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (isRegistering) {
        if (!formData.username || !formData.password || !formData.name) return setError("Vui lòng điền đủ thông tin!");
        if (!onRegister(formData)) setError("Tên đăng nhập đã tồn tại!");
    } else {
        if (!onLogin(formData.username, formData.password)) setError("Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  return (
    <div style={{ 
        minHeight: '100vh', 
        width: '100vw',
        backgroundColor: 'rgb(95, 0, 4)',
        backgroundImage: `url("https://vneid.gov.vn/_next/static/media/background-login.98683067.png?fbclid=IwY2xjawPu7ZlleHRuA2FlbQIxMABicmlkETE5djM2WjBsSzRycFp6YUU4c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHk0BYXXbhWzWIgWCGlShDSsVBqPyV4wNI4wHwogwZ3C-a3D5M1kLyiiylYC3_aem_LHSww51DKHwgFM32N5pD4g")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: "'Segoe UI', sans-serif"
    }}>
      
      {/* HEADER LOGO & TITLE */}
      <div className="text-center text-white mb-4 animate__animated animate__fadeInDown" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         
         {/* --- LOGO MỚI (Hình ngôi sao + bóng đèn) --- */}
         <img 
            src={logoStms} 
            alt="STMS Logo" 
            className="mb-3"
            style={{ 
                width: '180px', // Điều chỉnh to nhỏ tùy ý bạn
                height: 'auto', 
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))', // Đổ bóng cho logo nổi bật
                transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
         />
         {/* ------------------------------------------- */}

         <h2 className="fw-bold text-uppercase mt-2" style={{ letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            HỆ THỐNG CƠ SỞ DỮ LIỆU GIAO THÔNG
         </h2>
         <p className="text-white-50 fs-6 mb-0">STMS - Smart Traffic Management System</p>
         <div style={{ width: '60px', height: '3px', background: '#FFD700', margin: '15px auto', borderRadius: '2px' }}></div>
      </div>

      {/* CARD ĐĂNG NHẬP */}
      <Card className="shadow-lg border-0 animate__animated animate__fadeInUp" 
            style={{ 
                width: '100%', 
                maxWidth: '460px',
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
        
        <div className="pt-4 pb-3 text-center text-white" style={{ backgroundColor: 'rgb(95, 0, 4)' }}>
            <h5 className="fw-bold m-0 text-uppercase">
                {isRegistering ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập Hệ Thống'}
            </h5>
            <small style={{ fontSize: '0.85rem', opacity: 0.8 }}>Xác thực qua tài khoản định danh điện tử</small>
        </div>

        <Card.Body className="p-4 bg-white">
            {error && <Alert variant="danger" className="text-center small py-2 mb-3">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                {isRegistering && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Control size="lg" type="text" name="name" placeholder="Họ và tên" className="bg-light border-0" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control size="lg" type="email" name="email" placeholder="Email" className="bg-light border-0" onChange={handleChange} />
                        </Form.Group>
                    </>
                )}

                <Form.Group className="mb-3">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0"><FaUser style={{ color: 'rgb(95, 0, 4)' }}/></span>
                        <Form.Control size="lg" type="text" name="username" placeholder="Tên đăng nhập" className="bg-light border-0 fs-6" onChange={handleChange} />
                    </div>
                </Form.Group>

                <Form.Group className="mb-4">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0"><FaLock style={{ color: 'rgb(95, 0, 4)' }}/></span>
                        <Form.Control size="lg" type="password" name="password" placeholder="Mật khẩu" className="bg-light border-0 fs-6" onChange={handleChange} />
                    </div>
                </Form.Group>
                <Button type="submit" size="lg" className="w-100 fw-bold shadow-sm mb-3 text-uppercase text-white" 
                        style={{ backgroundColor: 'rgb(95, 0, 4)', border: 'none', padding: '12px', fontSize: '1rem' }}>
                    {isRegistering ? <><FaUserPlus className="me-2"/>Đăng ký ngay</> : <><FaSignInAlt className="me-2"/>Đăng nhập</>}
                </Button>

                <div className="d-flex justify-content-between mt-4 small">
                    <a href="#" className="text-decoration-none text-muted">Quên mật khẩu?</a>
                    <a href="#" className="fw-bold text-decoration-none" style={{ color: 'rgb(95, 0, 4)' }}
                       onClick={(e) => { e.preventDefault(); setIsRegistering(!isRegistering); setError(''); }}>
                        {isRegistering ? "Quay lại Đăng nhập" : "Đăng ký tài khoản mới"}
                    </a>
                </div>
            </Form>
        </Card.Body>
        
        <div className="bg-light p-3 text-center border-top">
            <small className="text-muted d-flex justify-content-center align-items-center">
                <FaPhoneAlt className="me-2 text-danger" size={12}/> Tổng đài hỗ trợ: <strong className="ms-1">1900 0000</strong>
            </small>
        </div>
      </Card>

      {/* FOOTER */}
      <div className="text-center text-white mt-4" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
        <p className="m-0 fw-bold">BỘ GIAO THÔNG VẬN TẢI - CỤC ĐƯỜNG BỘ VIỆT NAM</p>
        <p className="m-0">Bản quyền © 2026 Hệ thống STMS</p>
      </div>

    </div>
  );
}

export default LoginPage;