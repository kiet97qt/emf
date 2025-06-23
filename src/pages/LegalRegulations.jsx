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
  Divider,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Link
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchLegalDocuments } from '../services/api';
import './LegalRegulations.css';

const LegalRegulations = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const data = await fetchLegalDocuments();
        setDocuments(data);
      } catch (error) {
        console.error('Error loading legal documents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDocuments();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Filter documents based on selected tab
  const filteredDocuments = documents.filter(doc => {
    if (tabValue === 0) return true; // All documents
    if (tabValue === 1) return doc.type === 'international';
    if (tabValue === 2) return doc.type === 'eu';
    if (tabValue === 3) return doc.type === 'national';
    return true;
  });
  
  return (
    <Container maxWidth="xl" className="legal-regulations-page">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('legalRegulations.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {t('legalRegulations.description')}
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('legalRegulations.overview')}
        </Typography>
        
        <Typography variant="body1" paragraph>
          The legal framework for electromagnetic field (EMF) monitoring and protection consists of various international standards, European directives, and national laws and regulations. These legal instruments establish limits for human exposure to EMF, requirements for monitoring, and procedures for ensuring compliance.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Key aspects regulated by these documents include:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Exposure Limits
                </Typography>
                <Typography variant="body2">
                  Maximum permissible levels of EMF exposure for the general public and occupational settings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monitoring Requirements
                </Typography>
                <Typography variant="body2">
                  Procedures and methodologies for measuring and monitoring EMF levels in the environment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Equipment Standards
                </Typography>
                <Typography variant="body2">
                  Technical specifications and standards for EMF-emitting equipment and monitoring devices.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Public Information
                </Typography>
                <Typography variant="body2">
                  Requirements for informing the public about EMF levels and potential health impacts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="legal document tabs">
            <Tab label={t('legalRegulations.allDocuments')} />
            <Tab label={t('legalRegulations.international')} />
            <Tab label={t('legalRegulations.eu')} />
            <Tab label={t('legalRegulations.national')} />
          </Tabs>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {filteredDocuments.map((document, index) => (
              <React.Fragment key={document.id}>
                <ListItem 
                  secondaryAction={
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                      href={document.url}
                      target="_blank"
                    >
                      {t('legalRegulations.download')}
                    </Button>
                  }
                >
                  <ListItemText
                    primary={
                      <Link href={document.url} target="_blank" underline="hover">
                        <Typography variant="h6">{document.title}</Typography>
                      </Link>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary">
                          {document.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('legalRegulations.published')}: {document.date}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < filteredDocuments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            
            {filteredDocuments.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">
                  {t('legalRegulations.noDocuments')}
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default LegalRegulations;