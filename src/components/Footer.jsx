import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer.about')}
            </Typography>
            <Typography variant="body2">
              {t('footer.aboutText')}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer.links')}
            </Typography>
            <Link href="/emf-info" color="inherit" display="block" sx={{ mb: 1 }}>
              {t('nav.emfInfo')}
            </Link>
            <Link href="/legal-regulations" color="inherit" display="block" sx={{ mb: 1 }}>
              {t('nav.legalRegulations')}
            </Link>
            <Link href="/open-data" color="inherit" display="block" sx={{ mb: 1 }}>
              {t('nav.openData')}
            </Link>
            <Link href="/contact" color="inherit" display="block">
              {t('nav.contact')}
            </Link>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer.contact')}
            </Typography>
            <Typography variant="body2" paragraph>
              Email: info@emf-monitoring.example
            </Typography>
            <Typography variant="body2">
              {t('footer.address')}
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, md: 0 } }}>
            © {currentYear} EMF Monitoring Network. {t('footer.rightsReserved')}
          </Typography>
          <Box>
            <Link href="/privacy-policy" color="inherit" sx={{ mr: 2 }}>
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="/terms-of-use" color="inherit">
              {t('footer.termsOfUse')}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;