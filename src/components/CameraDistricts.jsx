import React from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaVideo, FaMapMarkerAlt } from 'react-icons/fa';

const cameraDistricts = () => {
  const districts = [
    { name: 'Quận Hải Châu', cameras: 12 },
    { name: 'Quận Thanh Khê', cameras: 9 },
    { name: 'Quận Sơn Trà', cameras: 7 },
    { name: 'Quận Liên Chiểu', cameras: 8 },
    { name: 'Quận Cẩm Lệ', cameras: 5 },
    { name: 'Quận Ngũ Hành Sơn', cameras:  3},
  ];
    return (
    <div className="row g-4">
      {districts.map((d) => (
        <div key={d.id} className="col-md-4">
          <div className="card h-100 shadow-sm border-0 border-top border-primary border-4">
            <div className="card-body">
               <h5 className="fw-bold">{d.name}</h5>
               <p className="text-muted small">Số lượng: {d.cameraCount} cam</p>
               <button className="btn btn-sm btn-outline-primary w-100">Xem</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};