import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
const LiveMap = () => {
    const position = [16.05210612495695, 108.15914545417087];
    return (
        <div style={{ height: "100px", width: "100%" }}>
            <MapContainer center={position} zoom={14} style={{ height: "500px", width: "100%" }}
            >
                <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marker ví dụ để test map hoạt động */}
        <Marker position={position}>
          <Popup>
            Trung tâm điều hành STMS <br /> (Vị trí Demo)
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveMap;