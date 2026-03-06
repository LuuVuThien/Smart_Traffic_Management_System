import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { FaVideo, FaMapMarkerAlt } from 'react-icons/fa';

// Cấu hình URL cơ sở của Backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const CameraDistricts = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách Quận và Camera cùng một lúc (Tối ưu tốc độ)
        const [areasResponse, camerasResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/areas/`),
          axios.get(`${API_BASE_URL}/cameras/`)
        ]);

        const areasData = areasResponse.data;
        const camerasData = camerasResponse.data;

        // Kết hợp dữ liệu: Đếm số camera tương ứng với mỗi quận
        const formattedDistricts = areasData.map(area => {
          // Lọc ra những camera có area bằng với id của quận hiện tại
          const count = camerasData.filter(cam => cam.area === area.id).length;
          
          return {
            id: area.id,
            name: area.area_name,
            cameraCount: count // Lưu số lượng đã đếm được
          };
        });

        setDistricts(formattedDistricts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu cho Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hiển thị vòng xoay xoay trong lúc chờ tải dữ liệu
  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" /> 
        <span className="ms-2">Đang tải dữ liệu khu vực...</span>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {districts.map((d) => (
        <div key={d.id} className="col-md-4">
          <div className="card h-100 shadow-sm border-0 border-top border-primary border-4">
            <div className="card-body">
               <h5 className="fw-bold">
                 <FaMapMarkerAlt className="text-primary me-2" />
                 {d.name}
               </h5>
               <p className="text-muted small mt-3 mb-3">
                 <FaVideo className="text-secondary me-2" />
                 Số lượng: <strong className="text-primary">{d.cameraCount}</strong> camera
               </p>
               <button className="btn btn-sm btn-outline-primary w-100 fw-bold">Xem chi tiết</button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Thông báo nếu chưa có dữ liệu quận nào */}
      {districts.length === 0 && (
        <div className="col-12 text-center text-muted p-4">
          Chưa có dữ liệu khu vực nào trên hệ thống.
        </div>
      )}
    </div>
  );
};

export default CameraDistricts;