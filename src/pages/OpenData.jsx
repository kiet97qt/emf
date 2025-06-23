import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DownloadIcon from '@mui/icons-material/Download';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TableChartIcon from '@mui/icons-material/TableChart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { downloadData } from '../services/api';
import './OpenData.css';

const OpenData = () => {
  const { t } = useTranslation();
  const [dataType, setDataType] = useState('continuous');
  const [region, setRegion] = useState('all');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [format, setFormat] = useState('json');
  
  const handleDownload = () => {
    const filters = {
      dataType,
      region: region === 'all' ? undefined : region,
      dateFrom: dateFrom ? dateFrom.toISOString() : undefined,
      dateTo: dateTo ? dateTo.toISOString() : undefined
    };
    
    downloadData(format, filters);
  };
  
  const datasetExamples = [
    {
      title: 'Continuous Monitoring Data - Belgrade',
      description: 'EMF measurements from fixed monitoring stations in Belgrade, 2023',
      format: 'CSV',
      size: '2.4 MB',
      icon: <TableChartIcon />
    },
    {
      title: 'Campaign Measurements - Novi Sad',
      description: 'Data from measurement campaign in Novi Sad, Summer 2023',
      format: 'JSON',
      size: '1.8 MB',
      icon: <DataObjectIcon />
    },
    {
      title: 'Annual EMF Report 2022',
      description: 'Comprehensive analysis of EMF levels across Serbia',
      format: 'PDF',
      size: '4.2 MB',
      icon: <PictureAsPdfIcon />
    },
    {
      title: 'EMF Monitoring Network Metadata',
      description: 'Information about monitoring stations, equipment specifications, and calibration data',
      format: 'JSON',
      size: '0.5 MB',
      icon: <DataObjectIcon />
    }
  ];
  
  return (
    <Container maxWidth="xl" className="open-data-page">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('openData.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {t('openData.description')}
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {t('openData.downloadData')}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="data-type-label">{t('openData.dataType')}</InputLabel>
                <Select
                  labelId="data-type-label"
                  value={dataType}
                  label={t('openData.dataType')}
                  onChange={(e) => setDataType(e.target.value)}
                >
                  <MenuItem value="continuous">{t('openData.continuousMonitoring')}</MenuItem>
                  <MenuItem value="campaign">{t('openData.campaignMeasurements')}</MenuItem>
                  <MenuItem value="all">{t('openData.allData')}</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="region-label">{t('filters.region')}</InputLabel>
                <Select
                  labelId="region-label"
                  value={region}
                  label={t('filters.region')}
                  onChange={(e) => setRegion(e.target.value)}
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
                    value={dateFrom}
                    onChange={setDateFrom}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <DatePicker
                    label={t('filters.dateTo')}
                    value={dateTo}
                    onChange={setDateTo}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Box>
              </LocalizationProvider>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="format-label">{t('openData.format')}</InputLabel>
                <Select
                  labelId="format-label"
                  value={format}
                  label={t('openData.format')}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <MenuItem value="json">JSON</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                  <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                {t('openData.download')}
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              {t('openData.apiAccess')}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {t('openData.apiDescription')}
            </Typography>
            
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" component="code" sx={{ fontFamily: 'monospace' }}>
                GET https://api.emf-monitoring.example/measurements?region=Belgrade&from=2023-01-01&to=2023-01-31
              </Typography>
            </Box>
            
            <Button variant="outlined" color="primary">
              {t('openData.apiDocumentation')}
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {t('openData.availableDatasets')}
            </Typography>
            
            <List>
              {datasetExamples.map((dataset, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {dataset.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={dataset.title}
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {dataset.description}
                          </Typography>
                          <br />
                          <Typography variant="caption" component="span">
                            {dataset.format} • {dataset.size}
                          </Typography>
                        </>
                      }
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<DownloadIcon />}
                    >
                      {t('openData.download')}
                    </Button>
                  </ListItem>
                  {index < datasetExamples.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              {t('openData.dataLicense')}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {t('openData.licenseDescription')}
            </Typography>
            
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="body1">
                Creative Commons Attribution 4.0 International (CC BY 4.0)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You are free to:
              </Typography>
              <ul>
                <li>Share — copy and redistribute the material in any medium or format</li>
                <li>Adapt — remix, transform, and build upon the material for any purpose, even commercially</li>
              </ul>
              <Typography variant="body2" color="text.secondary">
                Under the following terms:
              </Typography>
              <ul>
                <li>Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made</li>
              </ul>
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary" 
              href="https://creativecommons.org/licenses/by/4.0/" 
              target="_blank"
            >
              {t('openData.viewLicense')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper elevation={3} sx={{ p: 3, my: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('openData.dataUsage')}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('openData.research')}
                </Typography>
                <Typography variant="body2">
                  Our open data is used by researchers to study EMF distribution patterns, analyze temporal trends, and investigate potential correlations with various environmental and social factors.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('openData.policyMaking')}
                </Typography>
                <Typography variant="body2">
                  Government agencies and regulatory bodies use this data to inform policy decisions, establish safety standards, and plan infrastructure development with EMF considerations in mind.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('openData.publicAwareness')}
                </Typography>
                <Typography variant="body2">
                  Journalists, educators, and community organizations use our data to raise public awareness about EMF levels in different areas and promote informed discussions about electromagnetic radiation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('openData.citingData')}
        </Typography>
        
        <Typography variant="body1" paragraph>
          When using our data in publications, presentations, or other materials, please cite it as follows:
        </Typography>
        
        <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" component="code" sx={{ fontFamily: 'monospace' }}>
            EMF Monitoring Network (2023). Electromagnetic Field Measurement Data [Data set]. Retrieved from https://emf-monitoring.example/open-data
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default OpenData;
