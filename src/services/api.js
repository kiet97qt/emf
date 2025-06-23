import axios from 'axios';
import { 
  generateMockData, 
  generateTimeSeriesData, 
  generateMockStations, 
  generateMockCampaigns,
  generateMockLegalDocuments
} from '../utils/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.emf-monitoring.example';

// Use mock data for development
const USE_MOCK = true; // Set to false when real API is available

export const fetchMeasurementPoints = async (filters = {}) => {
  if (USE_MOCK) {
    return generateMockData(50);
  }
  
  try {
    const response = await axios.get(`${API_URL}/measurements`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching measurement points:', error);
    return [];
  }
};

export const fetchSensorData = async (sensorId, timeRange = {}) => {
  if (USE_MOCK) {
    return generateTimeSeriesData(30);
  }
  
  try {
    const response = await axios.get(`${API_URL}/sensors/${sensorId}/data`, { params: timeRange });
    return response.data;
  } catch (error) {
    console.error(`Error fetching sensor data for sensor ${sensorId}:`, error);
    return [];
  }
};

export const fetchMonitoringStations = async () => {
  if (USE_MOCK) {
    return generateMockStations(10);
  }
  
  try {
    const response = await axios.get(`${API_URL}/stations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching monitoring stations:', error);
    return [];
  }
};

export const fetchCampaigns = async (filters = {}) => {
  if (USE_MOCK) {
    return generateMockCampaigns(5);
  }
  
  try {
    const response = await axios.get(`${API_URL}/campaigns`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
};

export const fetchCampaignDetails = async (campaignId) => {
  if (USE_MOCK) {
    const campaigns = generateMockCampaigns(5);
    return campaigns.find(campaign => campaign.id === parseInt(campaignId)) || null;
  }
  
  try {
    const response = await axios.get(`${API_URL}/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching campaign details for campaign ${campaignId}:`, error);
    return null;
  }
};

export const fetchLegalDocuments = async () => {
  if (USE_MOCK) {
    return generateMockLegalDocuments();
  }
  
  try {
    const response = await axios.get(`${API_URL}/legal-documents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching legal documents:', error);
    return [];
  }
};

export const downloadData = async (format = 'json', filters = {}) => {
  if (USE_MOCK) {
    // For mock mode, generate a sample file with mock data
    let data;
    
    switch (filters.dataType) {
      case 'continuous':
        data = generateMockStations(5).map(station => ({
          stationId: station.id,
          stationName: station.name,
          location: station.location,
          measurements: generateTimeSeriesData(7)
        }));
        break;
      case 'campaign':
        data = generateMockCampaigns(2);
        break;
      default:
        data = generateMockData(100);
    }
    
    // Create a blob and download it
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `emf-data-${new Date().toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return;
  }
  
  try {
    const response = await axios.get(`${API_URL}/download`, {
      params: { format, ...filters },
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `emf-data.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading data:', error);
  }
};

export const submitContactForm = async (formData) => {
  if (USE_MOCK) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form submitted:', formData);
        resolve({ success: true, message: 'Thank you for your message!' });
      }, 1000);
    });
  }
  
  try {
    const response = await axios.post(`${API_URL}/contact`, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};
