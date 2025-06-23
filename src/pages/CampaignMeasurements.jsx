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
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Map from '../components/Map';
import { fetchCampaigns, fetchCampaignDetails } from '../services/api';
import './CampaignMeasurements.css';

const CampaignMeasurements = () => {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [filters, setFilters] = useState({
    region: 'all',
    dateFrom: null,
    dateTo: null,
    thresholdLevel: 'all'
  });
  const [showRoutes, setShowRoutes] = useState(true);
  
  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
        if (data.length > 0) {
          setSelectedCampaign(data[0]);
        }
      } catch (error) {
        console.error('Error loading campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCampaigns();
  }, []);
  
  useEffect(() => {
    const loadCampaignDetails = async () => {
      if (!selectedCampaign) return;
      
      setDetailsLoading(true);
      try {
        const data = await fetchCampaignDetails(selectedCampaign.id);
        setCampaignDetails(data);
      } catch (error) {
        console.error('Error loading campaign details:', error);
      } finally {
        setDetailsLoading(false);
      }
    };
    
    loadCampaignDetails();
  }, [selectedCampaign]);
  
  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
  };
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleShowRoutesToggle = () => {
    setShowRoutes(prev => !prev);
  };
  
  // Filter points based on threshold level
  const filteredPoints = campaignDetails?.points.filter(point => {
    if (filters.thresholdLevel === 'all') return true;
    if (filters.thresholdLevel === 'low') return point.level === 'low';
    if (filters.thresholdLevel === 'medium') return point.level === 'medium';
    if (filters.thresholdLevel === 'high') return point.level === 'high';
    return true;
  }) || [];
  
  return (
    <Container maxWidth="xl" className="campaign-measurements-page">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('campaignMeasurements.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {t('campaignMeasurements.description')}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('filters.filters')}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="region-label">{t('filters.region')}</InputLabel>
                <Select
                  labelId="region-label"
                  value={filters.region}
                  label={t('filters.region')}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                >
                  <MenuItem value="all">{t('filters.allRegions')}</MenuItem>
                  <MenuItem value="Belgrade">Belgrade</MenuItem>
                  <MenuItem value="Novi Sad">Novi Sad</MenuItem>
                  <MenuItem value="Niš">Niš</MenuItem>
                  <MenuItem value="Kragujevac">Kragujevac</MenuItem>
                </Select>
              </FormControl>
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ mb: 2 }}>
                  <DatePicker
                    label={t('filters.dateFrom')}
                    value={filters.dateFrom}
                    onChange={(date) => handleFilterChange('dateFrom', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <DatePicker
                    label={t('filters.dateTo')}
                    value={filters.dateTo}
                    onChange={(date) => handleFilterChange('dateTo', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Box>
              </LocalizationProvider>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="threshold-label">{t('filters.thresholdLevel')}</InputLabel>
                <Select
                  labelId="threshold-label"
                  value={filters.thresholdLevel}
                  label={t('filters.thresholdLevel')}
                  onChange={(e) => handleFilterChange('thresholdLevel', e.target.value)}
                >
                  <MenuItem value="all">{t('filters.allLevels')}</MenuItem>
                  <MenuItem value="low">{t('filters.lowLevel')}</MenuItem>
                  <MenuItem value="medium">{t('filters.mediumLevel')}</MenuItem>
                  <MenuItem value="high">{t('filters.highLevel')}</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={showRoutes} 
                    onChange={handleShowRoutesToggle}
                    color="primary"
                  />
                }
                label={t('filters.showRoutes')}
              />
            </Box>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('campaignMeasurements.campaigns')}
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {campaigns.map((campaign) => (
                  <React.Fragment key={campaign.id}>
                    <ListItem disablePadding>
                      <ListItemButton 
                        selected={selectedCampaign?.id === campaign.id}
                        onClick={() => handleCampaignSelect(campaign)}
                      >
                        <ListItemText 
                          primary={campaign.name} 
                          secondary={`${campaign.region} - ${campaign.date}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>
          {detailsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : campaignDetails ? (
            <>
              <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {campaignDetails.name}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('campaignMeasurements.region')}
                        </Typography>
                        <Typography variant="h6">
                          {campaignDetails.region}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('campaignMeasurements.date')}
                        </Typography>
                        <Typography variant="h6">
                          {campaignDetails.date}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('campaignMeasurements.duration')}
                        </Typography>
                        <Typography variant="h6">
                          {campaignDetails.duration}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('campaignMeasurements.pointsCount')}
                        </Typography>
                        <Typography variant="h6">
                          {campaignDetails.stats.pointsCount}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('campaignMeasurements.maxValue')}
                        </Typography>
                        <Typography variant="h5">
                          {campaignDetails.stats.maxValue} {campaignDetails.stats.unit}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('campaignMeasurements.avgValue')}
                        </Typography>
                        <Typography variant="h5">
                          {campaignDetails.stats.avgValue} {campaignDetails.stats.unit}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" color="primary">
                    {t('campaignMeasurements.downloadReport')}
                  </Button>
                </Box>
              </Paper>
              
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('campaignMeasurements.mapTitle')}
                </Typography>
                
                <Map 
                  points={filteredPoints}
                  routes={showRoutes ? [{ points: campaignDetails.points }] : []}
                  showRoutes={showRoutes}
                  center={filteredPoints.length > 0 ? 
                    [filteredPoints[0].location.lat, filteredPoints[0].location.lng] : 
                    [44.787197, 20.457273]
                  }
                />
              </Paper>
            </>
          ) : (
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">
                {t('campaignMeasurements.selectCampaign')}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CampaignMeasurements;
