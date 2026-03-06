import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios'; 
import cameraIconImg from '../assets/camera.png';

// Định nghĩa Camera Icon mới
const cameraIcon = new L.Icon({
    iconUrl: cameraIconImg, 
    iconSize: [35, 35],    
    iconAnchor: [17, 35],   
    popupAnchor: [0, -35]   
});

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const LiveMap = () => {
    // Tọa độ trung tâm: Đà Nẵng
    const defaultPosition = [16.052106, 108.159145]; 
    const [cameras, setCameras] = useState([]);

    // Gọi API lấy dữ liệu Camera
    useEffect(() => {
        const fetchCameras = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/cameras/`);
                setCameras(response.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu bản đồ:", error);
            }
        };

        fetchCameras();
    }, []);

    return (
        // Sửa lại height của div ngoài cùng để khớp với bản đồ
        <div style={{ height: "500px", width: "100%", borderRadius: "8px", overflow: "hidden", zIndex: 0 }}>
            <MapContainer center={defaultPosition} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Lặp qua danh sách camera và hiển thị lên bản đồ */}
                {cameras.map((cam) => {
                    let lat = null;
                    let lng = null;

                    // Xử lý an toàn field tọa độ (JSONB) từ database
                    try {
                        const coords = typeof cam.coordinates === 'string' ? JSON.parse(cam.coordinates) : cam.coordinates;
                        if (coords && coords.lat && coords.lng) {
                            lat = parseFloat(coords.lat);
                            lng = parseFloat(coords.lng);
                        }
                    } catch (e) {
                        console.error("Lỗi định dạng tọa độ ở camera ID:", cam.id);
                    }

                    // Chỉ hiển thị Marker nếu lấy được tọa độ hợp lệ
                    if (lat && lng) {
                        return (
                            <Marker key={cam.id} position={[lat, lng]} icon={cameraIcon}>
                                <Popup>
                                    <div className="text-center">
                                        <h6 className="fw-bold mb-1">{cam.location_name}</h6>
                                        <p className="mb-1 text-muted small">IP: {cam.ip_address}</p>
                                        <span className={`badge bg-${cam.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                                            {cam.status === 'ACTIVE' ? 'Đang hoạt động' : 'Mất kết nối'}
                                        </span>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
};

export default LiveMap;