import React from 'react';
import { Card, Badge, ListGroup } from 'react-bootstrap';

// Nhận dữ liệu incidents (sự cố) và violations (vi phạm) từ App.jsx truyền vào
function RightPanel({ incidents, violations }) {
  return (
    <div className="d-flex flex-column gap-3 h-100">
      
      {/* --- PHẦN 1: CẢNH BÁO KHẨN CẤP (Ưu tiên cao nhất - Màu đỏ) --- */}
      <Card className="border-danger shadow-sm">
        <Card.Header className="bg-danger text-white fw-bold d-flex justify-content-between align-items-center">
          <span> Sự cố Khẩn cấp</span>
          <Badge bg="light" text="danger" pill>{incidents.length}</Badge>
        </Card.Header>
        <ListGroup variant="flush">
          {incidents.length > 0 ? (
            incidents.map((item, idx) => (
              <ListGroup.Item key={idx}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-danger">{item.type}</strong>
                  <Badge bg="warning" text="dark" style={{fontSize: '0.7rem'}}>{item.time}</Badge>
                </div>
                <div className="small text-muted">
                  <i className="bi bi-geo-alt-fill me-1"></i> {item.location}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-center text-muted">Không có sự cố nào</ListGroup.Item>
          )}
        </ListGroup>
      </Card>

      {/* --- PHẦN 2: DANH SÁCH VI PHẠM (Danh sách dài - Có thanh cuộn) --- */}
      <Card className="border-0 shadow-sm flex-grow-1" style={{minHeight: 0}}> 
        {/* minHeight: 0 là trick quan trọng để flex-grow hoạt động đúng với overflow */}
        <Card.Header className="bg-white fw-bold border-bottom">
           Vi phạm gần đây
        </Card.Header>
        
        <div className="p-2" style={{ overflowY: 'auto', flex: 1 }}>
           {violations.length > 0 ? (
             violations.map((v, idx) => (
               <div key={idx} className="alert alert-light border mb-2 shadow-sm py-2">
                 <div className="d-flex justify-content-between">
                    <strong>{v.plate}</strong>
                    <span className="badge bg-secondary">{v.time}</span>
                 </div>
                 <div className="text-danger small mt-1">
                    Lỗi: {v.error}
                 </div>
               </div>
             ))
           ) : (
             <div className="text-center text-muted mt-3">Chưa phát hiện vi phạm</div>
           )}
        </div>
      </Card>
    </div>
  );
}

export default RightPanel;
