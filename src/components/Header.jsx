import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleLanguageMenuOpen = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };
  
  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/continuous-monitoring', label: t('nav.continuousMonitoring') },
    { path: '/campaign-measurements', label: t('nav.campaignMeasurements') },
    { path: '/emf-info', label: t('nav.emfInfo') },
    { path: '/legal-regulations', label: t('nav.legalRegulations') },
    { path: '/open-data', label: t('nav.openData') }
  ];
  
  const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'sr-Latn', label: 'Srpski (latinica)' },
    { code: 'sr-Cyrl', label: 'Српски (ћирилица)' }
  ];
  
  const drawer = (
    <Box onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" className="logo-link">
            EMF Monitor
          </Link>
        </Typography>
        
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open language menu"
              onClick={handleLanguageMenuOpen}
              edge="start"
            >
              <LanguageIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{ 
                    mx: 1,
                    borderBottom: location.pathname === item.path ? '2px solid white' : 'none'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            <IconButton
              color="inherit"
              aria-label="language"
              aria-controls="language-menu"
              aria-haspopup="true"
              onClick={handleLanguageMenuOpen}
            >
              <LanguageIcon />
            </IconButton>
          </>
        )}
        
        <Menu
          id="language-menu"
          anchorEl={languageAnchorEl}
          keepMounted
          open={Boolean(languageAnchorEl)}
          onClose={handleLanguageMenuClose}
        >
          {languageOptions.map((option) => (
            <MenuItem 
              key={option.code} 
              onClick={() => changeLanguage(option.code)}
              selected={i18n.language === option.code}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;