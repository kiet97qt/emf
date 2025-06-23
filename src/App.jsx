import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ContinuousMonitoring from './pages/ContinuousMonitoring';
import CampaignMeasurements from './pages/CampaignMeasurements';
import EmfInfo from './pages/EmfInfo';
import LegalRegulations from './pages/LegalRegulations';
import OpenData from './pages/OpenData';

import './App.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/continuous-monitoring" element={<ContinuousMonitoring />} />
                <Route path="/campaign-measurements" element={<CampaignMeasurements />} />
                <Route path="/emf-info" element={<EmfInfo />} />
                <Route path="/legal-regulations" element={<LegalRegulations />} />
                <Route path="/open-data" element={<OpenData />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;