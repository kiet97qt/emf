import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import Map from '../components/Map';
import { fetchMonitoringStations, fetchSensorData } from '../services/api';
import './ContinuousMonitoring.css';

const ContinuousMonitoring = () => {
  const { t } = useTranslation();
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  
  useEffect(() => {
    const loadStations = async () => {
      setLoading(true);
      try {
        const data = await fetchMonitoringStations();
        setStations(data);
        if (data.length > 0) {
          setSelectedStation(data[0]);
        }
      } catch (error) {
        console.error('Error loading stations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStations();
  }, []);
  
  useEffect(() => {
    const loadSensorData = async () => {
      if (!selectedStation) return;
      
      setDataLoading(true);
      try {
        // Convert timeRange to actual date range
        let fromDate = new Date();
        switch (timeRange) {
          case '24h':
            fromDate.setDate(fromDate.getDate() - 1);
            break;
          case '7d':
            fromDate.setDate(fromDate.getDate() - 7);
            break;
          case '30d':
            fromDate.setDate(fromDate.getDate() - 30);
            break;
          default:
            fromDate.setDate(fromDate.getDate() - 1);
        }
        
        const data = await fetchSensorData(selectedStation.id, {
          from: fromDate.toISOString(),
          to: new Date().toISOString()
        });
        
        setSensorData(data);
      } catch (error) {
        console.error('Error loading sensor data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    loadSensorData();
  }, [selectedStation, timeRange]);
  
  const handleStationSelect = (station) => {
    setSelectedStation(station);
  };
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  // Prepare chart data
  const chartData = {
    labels: sensorData.map(item => {
      const date = new Date(item.timestamp);
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
    }),
    datasets: [
      {
        label: `EMF (${sensorData[0]?.unit || 'V/m'})`,
        data: sensorData.map(item => item.value),
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
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: sensorData[0]?.unit || 'V/m'
        }
      }
    }
  };
  
  return (
    <Container maxWidth="xl" className="continuous-monitoring-page">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('continuousMonitoring.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {t('continuousMonitoring.description')}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('continuousMonitoring.stationsList')}
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <List>
                  {stations.map((station) => (
                    <React.Fragment key={station.id}>
                      <ListItem disablePadding>
                        <ListItemButton 
                          selected={selectedStation?.id === station.id}
                          onClick={() => handleStationSelect(station)}
                        >
                          <ListItemText 
                            primary={station.name} 
                            secondary={station.location.address}
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {selectedStation ? selectedStation.name : t('continuousMonitoring.selectStation')}
              </Typography>
              
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="time-range-label">{t('continuousMonitoring.timeRange')}</InputLabel>
                <Select
                  labelId="time-range-label"
                  value={timeRange}
                  label={t('continuousMonitoring.timeRange')}
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="24h">{t('continuousMonitoring.last24Hours')}</MenuItem>
                  <MenuItem value="7d">{t('continuousMonitoring.last7Days')}</MenuItem>
                  <MenuItem value="30d">{t('continuousMonitoring.last30Days')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {selectedStation && (
              <Map 
                points={[{
                  id: selectedStation.id,
                  location: selectedStation.location,
                  value: sensorData.length > 0 ? sensorData[sensorData.length - 1].value : 0,
                  unit: sensorData.length > 0 ? sensorData[sensorData.length - 1].unit : 'V/m',
                  level: sensorData.length > 0 ? 
                    (sensorData[sensorData.length - 1].value < 2 ? 'low' : 
                     sensorData[sensorData.length - 1].value < 6 ? 'medium' : 'high') : 'low',
                  timestamp: sensorData.length > 0 ? sensorData[sensorData.length - 1].timestamp : new Date().toISOString()
                }]}
                center={[selectedStation.location.lat, selectedStation.location.lng]}
                zoom={14}
              />
            )}
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('continuousMonitoring.title')} - {selectedStation?.name}
            </Typography>
            
            {dataLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : sensorData.length > 0 ? (
              <Box sx={{ height: 400 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Typography>{t('continuousMonitoring.noData')}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContinuousMonitoring;