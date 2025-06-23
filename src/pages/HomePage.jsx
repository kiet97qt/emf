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
  CardMedia,
  Button
} from '@mui/material';
import Map from '../components/Map';
import { fetchMeasurementPoints } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const { t } = useTranslation();
  const [measurementPoints, setMeasurementPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchMeasurementPoints();
        setMeasurementPoints(data);
      } catch (error) {
        console.error('Error loading measurement points:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return (
    <Container maxWidth="xl" className="home-page">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('home.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {t('home.description')}
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('home.mapTitle')}
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : (
          <Map points={measurementPoints} />
        )}
      </Paper>
      
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          {t('home.infoTitle')}
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="EMF visualization"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t('home.whatIsEmf')}
                </Typography>
                <Typography variant="body1" paragraph>
                  {t('home.emfDescription')}
                </Typography>
                <Button variant="outlined" color="primary" component="a" href="/emf-info">
                  {t('common.learnMore')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1581092921461-7d65ca45393a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="EMF measurement"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t('home.howMeasured')}
                </Typography>
                <Typography variant="body1" paragraph>
                  {t('home.measurementDescription')}
                </Typography>
                <Button variant="outlined" color="primary" component="a" href="/continuous-monitoring">
                  {t('common.learnMore')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;