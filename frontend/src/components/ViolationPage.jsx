import React, { useState, useMemo } from 'react';
import fireIcon from '../assets/tl.webp';
import carIcon from '../assets/red-vector-car-icon-emoji-600nw-2624240417.webp';
const ViolationPage = () => {
  // 1. DỮ LIỆU MẪU (Mock Data)
  const initialData = [
    // --- SỰ CỐ KHẨN CẤP (Chỉ còn Lũ lụt & Hỏa hoạn) ---
    { 
      id: 1, type: 'EMERGENCY', subType: 'Lũ lụt', 
      time: '2026-02-03 11:30', location: 'Đường Nguyễn Hữu Cảnh', 
      status: 'Đang diễn ra', // -> MÀU ĐỎ
      description: 'Ngập sâu 0.5m, kẹt xe nghiêm trọng, chưa có CSGT.'
    },
    { 
      id: 2, type: 'EMERGENCY', subType: 'Hỏa hoạn', 
      time: '2026-02-03 11:15', location: 'Khu công nghiệp A', 
      status: 'Đang xử lý', // -> MÀU VÀNG
      description: 'Đội PCCC đang dập lửa. Đám cháy đã được khoanh vùng.'
    },
    { 
      id: 6, type: 'EMERGENCY', subType: 'Hỏa hoạn', // Thay Sạt lở bằng Hỏa hoạn
      time: '2026-02-03 12:00', location: 'Chợ Lớn, Quận 5', 
      status: 'Đang diễn ra', // -> MÀU ĐỎ
      description: 'Cháy ki ốt số 5, lửa đang lan rộng.'
    },
    
    // --- VI PHẠM GIAO THÔNG ---
    { 
      id: 3, type: 'TRAFFIC', subType: 'Vượt đèn đỏ', plate: '29A-123.45', 
      time: '2026-02-03 10:30', location: 'Ngã tư Lê Văn Lương', 
      status: 'Chưa xử lý', img: 'https://via.placeholder.com/400x300',
      owner: 'Nguyễn Văn A', fine: '4.000.000 - 6.000.000 VNĐ', decree: 'Nghị định 100/2019/NĐ-CP'
    },
    { 
      id: 4, type: 'TRAFFIC', subType: 'Không mũ bảo hiểm', plate: '59X-999.99', 
      time: '2026-02-03 09:15', location: 'Quận 1, TP.HCM', 
      status: 'Đã gửi phạt', img: 'https://via.placeholder.com/400x300',
      owner: 'Trần Thị B', fine: '600.000 VNĐ', decree: 'Nghị định 100/2019/NĐ-CP',
      processedBy: 'Thượng úy Lê Văn X', processedTime: '2026-02-03 14:00'
    },
    { 
      id: 5, type: 'TRAFFIC', subType: 'Đi ngược chiều', plate: '30H-888.88', 
      time: '2026-02-03 11:05', location: 'Cầu Giấy', 
      status: 'Chưa xử lý', img: 'https://via.placeholder.com/400x300',
      owner: 'Lê Văn C', fine: '4.000.000 VNĐ', decree: 'Nghị định 100/2019/NĐ-CP'
    },
  ];

  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedViolation, setSelectedViolation] = useState(null);

  // 2. XỬ LÝ LOGIC
  const processedData = useMemo(() => {
    let sorted = [...initialData].sort((a, b) => b.time.localeCompare(a.time));

    // Lọc theo Dropdown
    if (filterStatus !== 'All') {
      sorted = sorted.filter(item => {
        if (filterStatus === 'New/Critical') {
          return item.status === 'Đang diễn ra' || item.status === 'Chưa xử lý';
        }
        if (filterStatus === 'Processing') {
          return item.status === 'Đang xử lý';
        }
        return true;
      });
    }
    return sorted;
  }, [filterStatus]);

  // Tách mảng và chỉ lấy đúng loại Lũ lụt/Hỏa hoạn (để an toàn logic)
  const emergencies = processedData.filter(i => 
    i.type === 'EMERGENCY' && ['Lũ lụt', 'Hỏa hoạn'].includes(i.subType)
  );
  const trafficViolations = processedData.filter(i => i.type === 'TRAFFIC');

  const getEmergencyColor = (status) => {
    if (status === 'Đang diễn ra') return 'bg-danger text-white'; 
    if (status === 'Đang xử lý') return 'bg-warning text-dark';   
    return 'bg-secondary text-white';
  };

  return (
    <div className="container-fluid p-4" style={{ height: '100%', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          <i className="bi bi-shield-exclamation text-warning me-2"></i>
          Trung tâm Giám sát & Cảnh báo
        </h2>
        
        <div style={{ width: '220px' }}>
          <select 
            className="form-select shadow-sm fw-bold text-primary" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="New/Critical">🔴 Đang diễn ra / Chưa xử lý</option>
            <option value="Processing">🟡 Đang xử lý</option>
          </select>
        </div>
      </div>

      {/* --- PHẦN 1: CẢNH BÁO THIÊN TAI (Chỉ Lũ lụt & Cháy) --- */}
      {emergencies.length > 0 && (
        <div className="mb-5">
          <h5 className="fw-bold text-danger mb-3 border-bottom pb-2">
            Cảnh báo Thiên tai & Sự cố ({emergencies.length})
          </h5>
          <div className="row g-3">
            {emergencies.map(item => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className={`card shadow border-0 h-100 ${getEmergencyColor(item.status)}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="card-title fw-bold m-0">
                        {item.subType === 'Hỏa hoạn' ? 
                        <img src={fireIcon} alt="Hình có cháy" style={{width:'20px', height:'20px'}} /> : '🌊'} {item.subType}
                      </h4>
                      <span className="badge bg-white text-dark fw-bold border">
                        {item.status}
                      </span>
                    </div>
                    <div className="mb-3">
                       <p className="mb-1"><i className="bi bi-geo-alt-fill me-1"></i> <strong>{item.location}</strong></p>
                       <p className="mb-1"><i className="bi bi-clock-fill me-1"></i> {item.time}</p>
                    </div>
                    <p className="card-text fst-italic border-top pt-2" style={{opacity: 0.9}}>
                      {item.description}
                    </p>
                    
                    {/* NÚT BẤM CỐ ĐỊNH CHỮ */}
                    <button className="btn btn-light w-100 fw-bold text-danger mt-2 shadow-sm">
                      Phát cảnh báo
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PHẦN 2: DANH SÁCH VI PHẠM (Giữ nguyên) --- */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold"><img src={carIcon} alt="Hình xe" style={{width:'30px', height:'30px'}} /> Nhật ký Vi phạm Giao thông</h5>
          <span className="badge bg-secondary">{trafficViolations.length} vi phạm</span>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Thời gian</th>
                <th>Hình ảnh</th>
                <th>Biển số</th>
                <th>Lỗi vi phạm</th>
                <th>Địa điểm</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {trafficViolations.map((item) => (
                <tr key={item.id}>
                  <td className="fw-bold text-secondary">{item.time}</td>
                  <td>
                    <img src={item.img} alt="evidence" className="rounded border" style={{width: '60px', height: '40px', objectFit: 'cover'}} />
                  </td>
                  <td className="fw-bold text-primary">{item.plate}</td>
                  <td>{item.subType}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`badge ${item.status === 'Chưa xử lý' ? 'bg-danger' : 'bg-success'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedViolation(item)}
                    >
                      {item.status === 'Chưa xử lý' ? 'Xử lý' : 'Xem HS'}
                    </button>
                  </td>
                </tr>
              ))}
              {trafficViolations.length === 0 && (
                <tr><td colSpan="7" className="text-center py-4 text-muted">Không có dữ liệu.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL CHI TIẾT (Giữ nguyên logic) --- */}
      {selectedViolation && (
        <>
          <div className="modal-backdrop show" style={{ opacity: 0.5 }}></div>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {selectedViolation.status === 'Đã gửi phạt' ? '✅ Hồ sơ Vi phạm' : '🔎 Xử lý Vi phạm'} #{selectedViolation.id}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedViolation(null)}></button>
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-7">
                      <div className="mb-2 position-relative">
                        <img src={selectedViolation.img} className="img-fluid rounded border shadow-sm w-100" alt="Evidence" />
                      </div>
                      
                      {selectedViolation.status === 'Đã gửi phạt' ? (
                        <div className="alert alert-success mt-3 p-2">
                           <div className="d-flex align-items-center">
                             <i className="bi bi-check-circle-fill me-3 fs-3 text-success"></i>
                             <div>
                                <strong>Đã xử lý xong.</strong>
                                <br/>
                                <small>Cán bộ: {selectedViolation.processedBy}</small><br/>
                                <small>Thời gian: {selectedViolation.processedTime}</small>
                             </div>
                           </div>
                        </div>
                      ) : (
                        <div className="alert alert-warning d-flex align-items-center mt-3 p-2">
                           <i className="bi bi-cpu-fill me-3 fs-4"></i>
                           <div>
                              <strong>AI Phân tích:</strong> Độ chính xác 98%.
                              <br/>
                              <small className="text-muted">Cần xác nhận từ con người.</small>
                           </div>
                        </div>
                      )}
                    </div>

                    <div className="col-md-5">
                      <h6 className="fw-bold text-primary border-bottom pb-2">📋 Thông tin phương tiện</h6>
                      <p className="mb-1"><strong>Biển số:</strong> <span className="fs-5 fw-bold text-dark">{selectedViolation.plate}</span></p>
                      <p className="mb-1"><strong>Lỗi:</strong> {selectedViolation.subType}</p>
                      <p className="mb-3"><strong>Thời gian:</strong> {selectedViolation.time}</p>

                      <h6 className="fw-bold text-primary border-bottom pb-2 mt-3">👤 Tra cứu chủ xe</h6>
                      <p className="mb-1"><strong>Tên:</strong> {selectedViolation.owner || 'Đang tra cứu...'}</p>
                      <p className="mb-1"><strong>Mức phạt:</strong></p>
                      <p className="text-danger fw-bold fs-5">{selectedViolation.fine}</p>
                      <p className="small text-muted fst-italic">({selectedViolation.decree})</p>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light d-flex justify-content-between">
                  <button className="btn btn-outline-secondary" onClick={() => setSelectedViolation(null)}>Đóng</button>
                  
                  {selectedViolation.status === 'Chưa xử lý' ? (
                    <div>
                      <button className="btn btn-danger me-2">
                        <i className="bi bi-x-circle me-1"></i> Báo sai (Hủy)
                      </button>
                      <button className="btn btn-success">
                        <i className="bi bi-check-circle me-1"></i> Xác nhận & Gửi phạt
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button className="btn btn-outline-primary me-2">
                        <i className="bi bi-printer me-1"></i> In biên bản
                      </button>
                      <button className="btn btn-primary">
                        <i className="bi bi-cash-coin me-1"></i> Cập nhật nộp phạt
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default ViolationPage;