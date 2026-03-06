import React, { useState } from 'react';
import axios from 'axios'; // Import thêm axios
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUserPlus, FaSignInAlt, FaUser, FaPhoneAlt, FaLock } from 'react-icons/fa';

import logoStms from '../assets/logo-stms.png'; 

function LoginPage({ onLogin, onRegister }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Thêm hiệu ứng loading
  
  const [formData, setFormData] = useState({
      username: '', password: '', name: '', email: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegistering) {
        if (!formData.username || !formData.password || !formData.name) {
            setLoading(false);
            return setError("Vui lòng điền đủ thông tin!");
        }
        try {
            // Gọi API Đăng ký
            await axios.post('http://127.0.0.1:8000/api/register/', formData);
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            setIsRegistering(false); // Chuyển về form đăng nhập
        } catch (err) {
            setError("Tên đăng nhập đã tồn tại hoặc có lỗi xảy ra!");
        }
    } else {
        if (!formData.username || !formData.password) {
            setLoading(false);
            return setError("Vui lòng nhập tài khoản và mật khẩu!");
        }
        try {
            // Gọi API Đăng nhập
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username: formData.username,
                password: formData.password
            });
            // Nếu thành công, báo cho file App.jsx biết để chuyển trang
            onLogin(response.data); 
        } catch (err) {
            setError("Sai tên đăng nhập hoặc mật khẩu!");
        }
    }
    setLoading(false);
  };

  return (
    <div style={{ 
        minHeight: '100vh', 
        width: '100vw',
        backgroundColor: 'rgb(95, 0, 4)',
        backgroundImage: `url("https://vneid.gov.vn/_next/static/media/background-login.98683067.png")`,
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
         <img 
            src={logoStms} 
            alt="STMS Logo" 
            className="mb-3"
            style={{ width: '180px', height: 'auto', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))', transition: 'transform 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
         />
         <h2 className="fw-bold text-uppercase mt-2" style={{ letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            HỆ THỐNG CƠ SỞ DỮ LIỆU GIAO THÔNG
         </h2>
         <p className="text-white-50 fs-6 mb-0">STMS - Smart Traffic Management System</p>
         <div style={{ width: '60px', height: '3px', background: '#FFD700', margin: '15px auto', borderRadius: '2px' }}></div>
      </div>

      {/* CARD ĐĂNG NHẬP */}
      <Card className="shadow-lg border-0 animate__animated animate__fadeInUp" style={{ width: '100%', maxWidth: '460px', borderRadius: '12px', overflow: 'hidden' }}>
        <div className="pt-4 pb-3 text-center text-white" style={{ backgroundColor: 'rgb(95, 0, 4)' }}>
            <h5 className="fw-bold m-0 text-uppercase">{isRegistering ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập Hệ Thống'}</h5>
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

                <Button type="submit" size="lg" disabled={loading} className="w-100 fw-bold shadow-sm mb-3 text-uppercase text-white" 
                        style={{ backgroundColor: 'rgb(95, 0, 4)', border: 'none', padding: '12px', fontSize: '1rem' }}>
                    {loading ? 'Đang xử lý...' : (isRegistering ? <><FaUserPlus className="me-2"/>Đăng ký ngay</> : <><FaSignInAlt className="me-2"/>Đăng nhập</>)}
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