import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

const ViolationPage = () => {
  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedViolation, setSelectedViolation] = useState(null);

  useEffect(() => {
    const fetchViolationsAndIncidents = async () => {
      try {
        const [violationsRes, incidentsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/violations/'),
          axios.get('http://127.0.0.1:8000/api/incidents/')
        ]);

        // 1. XỬ LÝ DỮ LIỆU VI PHẠM (TRAFFIC)
        const formattedViolations = violationsRes.data.map(v => ({
          id: `v_${v.id}`,
          realId: v.id,
          type: 'TRAFFIC',
          subType: v.violation_type || 'Vi phạm giao thông', 
          plate: v.license_plate || 'Chưa rõ',
          time: v.occurred_at || 'Đang cập nhật',
          location: v.location || 'Chưa rõ địa điểm',
          status: v.status || 'Chưa xử lý',
          img: v.image_url || 'https://via.placeholder.com/400x300',
          owner: v.owner_name || 'Đang tra cứu...',
          fine: v.fine_amount || 'Chưa có',
          decree: 'Nghị định 100/2019/NĐ-CP',
          processedBy: v.processed_by || '',
          processedTime: v.processed_time || ''
        }));

        // 2. XỬ LÝ DỮ LIỆU SỰ CỐ (EMERGENCY)
        const formattedIncidents = incidentsRes.data.map(i => {
          let translatedType = i.type;
          if (i.type === 'FIRE') translatedType = 'Hỏa hoạn';
          if (i.type === 'FLOOD') translatedType = 'Lũ lụt';

          let translatedStatus = i.status;
          if (i.status === 'ONGOING') translatedStatus = 'Đang diễn ra';
          if (i.status === 'RESOLVED') translatedStatus = 'Đã xử lý';

          return {
            id: `i_${i.id}`,
            realId: i.id,
            type: 'EMERGENCY', 
            subType: translatedType, 
            status: translatedStatus, 
            time: i.detected_at || i.created_at || 'Vừa xong', 
            location: i.location || 'Đang xác định', 
            description: i.description || 'Không có mô tả chi tiết.',
            severity: i.severity 
          };
        });

        setInitialData([...formattedIncidents, ...formattedViolations]);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi kéo dữ liệu từ Backend:", error);
        setLoading(false);
      }
    };

    fetchViolationsAndIncidents();
  }, []);

  const processedData = useMemo(() => {
    let sorted = [...initialData].sort((a, b) => b.time.localeCompare(a.time));

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
  }, [filterStatus, initialData]);

  const emergencies = processedData.filter(i => 
    i.type === 'EMERGENCY' && ['Lũ lụt', 'Hỏa hoạn'].includes(i.subType)
  );
  const trafficViolations = processedData.filter(i => i.type === 'TRAFFIC');

  const getEmergencyColor = (status, severity) => {
    if (status === 'Đang diễn ra') {
        if (severity === 'CRITICAL') return 'bg-danger text-white border border-danger border-3';
        return 'bg-danger text-white';
    } 
    if (status === 'Đang xử lý') return 'bg-warning text-dark';   
    return 'bg-secondary text-white';
  };

  return (
    <div className="container-fluid p-4" style={{ height: '100%', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0 fs-3">
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

      {loading ? (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted fw-bold">Đang lấy dữ liệu từ hệ thống...</p>
        </div>
      ) : (
        <>
          {/* --- PHẦN 1: CẢNH BÁO THIÊN TAI (Dạng cuộn ngang, Card nhỏ) --- */}
          {emergencies.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-danger mb-2">
                SỰ CỐ KHẨN CẤP ({emergencies.length})
              </h6>
              
              {/* Vùng chứa cuộn ngang */}
              <div 
                className="d-flex flex-nowrap overflow-auto pb-3 pt-1" 
                style={{ gap: '15px', scrollbarWidth: 'thin' }} // scrollbarWidth: 'thin' làm thanh cuộn mỏng gọn hơn trên Firefox
              >
                {emergencies.map(item => (
                  // Ép kích thước cố định cho mỗi card
                  <div key={item.id} style={{ minWidth: '280px', maxWidth: '280px', flexShrink: 0 }}>
                    <div className={`card shadow-sm border-0 h-100 ${getEmergencyColor(item.status, item.severity)}`}>
                      <div className="card-body p-3"> {/* Padding p-3 nhỏ hơn p-4 */}
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="card-title fw-bold m-0 fs-6">
                            {item.subType === 'Hỏa hoạn' ? '🔥' : '🌊'} {item.subType}
                          </h6>
                          <span className="badge bg-white text-dark fw-bold border" style={{ fontSize: '0.7rem' }}>
                            {item.status}
                          </span>
                        </div>
                        
                        <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                           <p className="mb-1 text-truncate" title={item.location}>
                             <i className="bi bi-geo-alt-fill me-1"></i> <strong>{item.location}</strong>
                           </p>
                           <p className="mb-0">
                             <i className="bi bi-clock-fill me-1"></i> {item.time}
                           </p>
                        </div>
                        
                        <p className="card-text fst-italic border-top pt-2 m-0 text-truncate" style={{ opacity: 0.9, fontSize: '0.8rem' }} title={item.description}>
                          {item.description}
                        </p>
                        
                        <button className="btn btn-light btn-sm w-100 fw-bold text-danger mt-3 shadow-sm">
                          Phát cảnh báo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- PHẦN 2: DANH SÁCH VI PHẠM --- */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">🚗 Nhật ký Vi phạm Giao thông</h5>
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
                    <tr><td colSpan="7" className="text-center py-4 text-muted">Không có dữ liệu vi phạm.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* --- MODAL CHI TIẾT VI PHẠM (Giữ nguyên) --- */}
      {selectedViolation && (
        <>
          <div className="modal-backdrop show" style={{ opacity: 0.5 }}></div>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {selectedViolation.status === 'Đã gửi phạt' ? '✅ Hồ sơ Vi phạm' : '🔎 Xử lý Vi phạm'} #{selectedViolation.realId}
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
                      <p className="mb-1"><strong>Tên:</strong> {selectedViolation.owner}</p>
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