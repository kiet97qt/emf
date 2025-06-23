import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons based on EMF level
const createLevelIcon = (level) => {
  const color = level === 'low' ? '#4caf50' : level === 'medium' ? '#ff9800' : '#f44336';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Component to handle map view changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const Map = ({ 
  points = [], 
  routes = [], 
  center = [44.787197, 20.457273], // Default to Belgrade
  zoom = 10,
  height = 500,
  showRoutes = true,
  onPointClick = null
}) => {
  const { t } = useTranslation();
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  const handlePointClick = (point) => {
    setSelectedPoint(point);
    if (onPointClick) {
      onPointClick(point);
    }
  };
  
  return (
    <Box sx={{ height, width: '100%', position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {points.map((point) => (
          <Marker 
            key={point.id} 
            position={[point.location.lat, point.location.lng]}
            icon={createLevelIcon(point.level)}
            eventHandlers={{
              click: () => handlePointClick(point)
            }}
          >
            <Popup>
              <Typography variant="subtitle2">
                {point.location.address || `Location ${point.id}`}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                <strong>{t('map.value')}:</strong> {point.value} {point.unit}
              </Typography>
              <Typography variant="body2">
                <strong>{t('map.level')}:</strong> {t(`map.level${point.level.charAt(0).toUpperCase() + point.level.slice(1)}`)}
              </Typography>
              <Typography variant="body2">
                <strong>{t('map.timestamp')}:</strong> {new Date(point.timestamp).toLocaleString()}
              </Typography>
            </Popup>
          </Marker>
        ))}
        
        {showRoutes && routes.map((route, index) => (
          <Polyline 
            key={index}
            positions={route.points.map(point => [point.location.lat, point.location.lng])}
            color="#3388ff"
            weight={3}
            opacity={0.7}
            dashArray="5, 10"
          />
        ))}
      </MapContainer>
      
      {selectedPoint && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            zIndex: 1000, 
            p: 2, 
            maxWidth: 300,
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            {selectedPoint.location.address || `Location ${selectedPoint.id}`}
          </Typography>
          <Typography variant="body2">
            <strong>{t('map.value')}:</strong> {selectedPoint.value} {selectedPoint.unit}
          </Typography>
          <Typography variant="body2">
            <strong>{t('map.level')}:</strong> {t(`map.level${selectedPoint.level.charAt(0).toUpperCase() + selectedPoint.level.slice(1)}`)}
          </Typography>
          <Typography variant="body2">
            <strong>{t('map.timestamp')}:</strong> {new Date(selectedPoint.timestamp).toLocaleString()}
          </Typography>
        </Paper>
      )}
      
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 1000, 
          p: 1, 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 1
        }}
      >
        <Typography variant="caption" display="block">
          <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4caf50', mr: 1 }} />
          {t('map.levelLow')} (&lt; 2 V/m)
        </Typography>
        <Typography variant="caption" display="block">
          <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff9800', mr: 1 }} />
          {t('map.levelMedium')} (2-6 V/m)
        </Typography>
        <Typography variant="caption" display="block">
          <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f44336', mr: 1 }} />
          {t('map.levelHigh')} (&gt; 6 V/m)
        </Typography>
      </Box>
    </Box>
  );
};

export default Map;
