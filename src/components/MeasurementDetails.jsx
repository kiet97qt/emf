import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Box,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchSensorData } from '../services/api';
import './MeasurementDetails.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MeasurementDetails = ({ point, onClose }) => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTimeSeriesData = async () => {
      setLoading(true);
      try {
        const data = await fetchSensorData(point.id);
        setTimeSeriesData(data);
      } catch (error) {
        console.error('Error loading time series data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTimeSeriesData();
  }, [point.id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Prepare chart data
  const chartData = {
    labels: timeSeriesData.map(item => {
      const date = new Date(item.timestamp);
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
    }),
    datasets: [
      {
        label: `EMF (${point.unit})`,
        data: timeSeriesData.map(item => item.value),
        borderColor: 'rgba(25, 118, 210, 1)',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        tension: 0.4
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'EMF Measurements Over Time'
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            if (tooltipItems.length > 0) {
              const index = tooltipItems[0].dataIndex;
              if (index >= 0 && index < timeSeriesData.length) {
                return new Date(timeSeriesData[index].timestamp).toLocaleString();
              }
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: point.unit
        }
      }
    }
  };
  
  // Get color based on EMF level
  const getLevelColor = (level) => {
    switch (level) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#1976d2';
    }
  };
  
  return (
    <Card className="measurement-details">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h5">
          {t('common.viewDetails')}
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Details" />
        <Tab label="Chart" />
      </Tabs>
      
      <CardContent>
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              EMF Measurement
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  bgcolor: getLevelColor(point.level),
                  mr: 1
                }} 
              />
              <Typography variant="h4">
                {point.value} {point.unit}
              </Typography>
            </Box>
            
            <Typography variant="body1" gutterBottom>
              <strong>Level:</strong> {point.level.toUpperCase()}
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>Location:</strong> {point.location.address || 'Unknown'}
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>Coordinates:</strong> {point.location.lat.toFixed(6)}, {point.location.lng.toFixed(6)}
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>Date:</strong> {new Date(point.timestamp).toLocaleString()}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>About this measurement:</strong> This reading represents the electromagnetic field strength at this location. Values are measured in {point.unit}.
              </Typography>
            </Box>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box sx={{ height: 300 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>{t('common.loading')}</Typography>
              </Box>
            ) : (
              timeSeriesData.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography>No historical data available</Typography>
                </Box>
              )
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MeasurementDetails;