// Generate random EMF measurement points
export const generateMockData = (count = 20) => {
  // Center coordinates (Belgrade, Serbia)
  const centerLat = 44.787197;
  const centerLng = 20.457273;
  
  return Array.from({ length: count }, (_, i) => {
    // Random coordinates around center
    const lat = centerLat + (Math.random() - 0.5) * 0.2;
    const lng = centerLng + (Math.random() - 0.5) * 0.2;
    
    // Random EMF value between 0.1 and 10 V/m
    const value = +(Math.random() * 9.9 + 0.1).toFixed(2);
    
    // Determine level based on value
    let level;
    if (value < 2) {
      level = 'low';
    } else if (value < 6) {
      level = 'medium';
    } else {
      level = 'high';
    }
    
    return {
      id: i + 1,
      location: {
        lat,
        lng,
        address: `Sample Location ${i + 1}`
      },
      value,
      unit: 'V/m',
      level,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString()
    };
  });
};

// Generate time series data for a sensor
export const generateTimeSeriesData = (days = 30) => {
  const now = new Date();
  const data = [];
  
  // Base value between 0.5 and 5
  const baseValue = Math.random() * 4.5 + 0.5;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - i));
    
    // Generate 24 hourly readings for each day
    for (let hour = 0; hour < 24; hour++) {
      const hourDate = new Date(date);
      hourDate.setHours(hour);
      
      // Random fluctuation around base value
      const fluctuation = Math.sin(hour / 3.82) * 1.5 + (Math.random() - 0.5);
      const value = +(Math.max(0.1, baseValue + fluctuation)).toFixed(2);
      
      data.push({
        timestamp: hourDate.toISOString(),
        value,
        unit: 'V/m'
      });
    }
  }
  
  return data;
};

// Generate mock fixed monitoring stations
export const generateMockStations = (count = 10) => {
  // Cities in Serbia
  const cities = [
    { name: 'Belgrade', lat: 44.787197, lng: 20.457273 },
    { name: 'Novi Sad', lat: 45.267136, lng: 19.833549 },
    { name: 'Niš', lat: 43.320904, lng: 21.895761 },
    { name: 'Kragujevac', lat: 44.012794, lng: 20.926010 },
    { name: 'Subotica', lat: 46.100376, lng: 19.667587 },
    { name: 'Zrenjanin', lat: 45.381432, lng: 20.385647 },
    { name: 'Pančevo', lat: 44.870461, lng: 20.644131 },
    { name: 'Čačak', lat: 43.891598, lng: 20.349762 },
    { name: 'Kraljevo', lat: 43.724088, lng: 20.687652 },
    { name: 'Leskovac', lat: 42.998932, lng: 21.944761 }
  ];
  
  return cities.slice(0, count).map((city, i) => {
    // Small random offset to avoid stations at exact city centers
    const lat = city.lat + (Math.random() - 0.5) * 0.01;
    const lng = city.lng + (Math.random() - 0.5) * 0.01;
    
    return {
      id: i + 1,
      name: `${city.name} Monitoring Station`,
      location: {
        lat,
        lng,
        address: `${city.name}, Serbia`
      },
      status: Math.random() > 0.1 ? 'active' : 'maintenance',
      installDate: new Date(Date.now() - Math.random() * 86400000 * 365 * 3).toISOString().split('T')[0]
    };
  });
};

// Generate mock measurement campaigns
export const generateMockCampaigns = (count = 5) => {
  const campaigns = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Random date within the last year
    const campaignDate = new Date(now);
    campaignDate.setDate(now.getDate() - Math.floor(Math.random() * 365));
    
    // Random duration between 1 and 5 days
    const duration = Math.floor(Math.random() * 5) + 1;
    
    // Random region
    const regions = ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica'];
    const region = regions[Math.floor(Math.random() * regions.length)];
    
    // Generate route points
    const routePoints = generateMockRoutePoints(region, 50);
    
    // Calculate stats
    const values = routePoints.map(point => point.value);
    const maxValue = Math.max(...values).toFixed(2);
    const avgValue = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2);
    
    campaigns.push({
      id: i + 1,
      name: `${region} Area Campaign ${i + 1}`,
      region,
      date: campaignDate.toISOString().split('T')[0],
      duration: `${duration} day${duration > 1 ? 's' : ''}`,
      points: routePoints,
      stats: {
        maxValue,
        avgValue,
        unit: 'V/m',
        pointsCount: routePoints.length
      }
    });
  }
  
  return campaigns;
};

// Generate route points for a campaign
const generateMockRoutePoints = (region, count) => {
  // Base coordinates for different regions
  const regionCoords = {
    'Belgrade': { lat: 44.787197, lng: 20.457273 },
    'Novi Sad': { lat: 45.267136, lng: 19.833549 },
    'Niš': { lat: 43.320904, lng: 21.895761 },
    'Kragujevac': { lat: 44.012794, lng: 20.926010 },
    'Subotica': { lat: 46.100376, lng: 19.667587 }
  };
  
  const baseCoords = regionCoords[region] || regionCoords['Belgrade'];
  const points = [];
  
  // Create a somewhat realistic route
  let currentLat = baseCoords.lat;
  let currentLng = baseCoords.lng;
  
  for (let i = 0; i < count; i++) {
    // Move in a somewhat continuous direction
    currentLat += (Math.random() - 0.5) * 0.005;
    currentLng += (Math.random() - 0.5) * 0.005;
    
    // Random EMF value between 0.1 and 10 V/m
    const value = +(Math.random() * 9.9 + 0.1).toFixed(2);
    
    // Determine level based on value
    let level;
    if (value < 2) {
      level = 'low';
    } else if (value < 6) {
      level = 'medium';
    } else {
      level = 'high';
    }
    
    points.push({
      id: i + 1,
      location: {
        lat: currentLat,
        lng: currentLng
      },
      value,
      unit: 'V/m',
      level,
      timestamp: new Date().toISOString()
    });
  }
  
  return points;
};

// Generate mock legal documents
export const generateMockLegalDocuments = () => {
  return [
    {
      id: 1,
      title: 'ITU-T K.83 Recommendation',
      description: 'Monitoring of electromagnetic field levels',
      type: 'international',
      url: '#',
      date: '2011-03-22'
    },
    {
      id: 2,
      title: 'ICNIRP Guidelines',
      description: 'Guidelines for limiting exposure to electromagnetic fields (100 kHz to 300 GHz)',
      type: 'international',
      url: '#',
      date: '2020-03-11'
    },
    {
      id: 3,
      title: 'EU Directive 2013/35/EU',
      description: 'Minimum health and safety requirements regarding the exposure of workers to risks arising from electromagnetic fields',
      type: 'eu',
      url: '#',
      date: '2013-06-26'
    },
    {
      id: 4,
      title: 'EU Recommendation 1999/519/EC',
      description: 'Limitation of exposure of the general public to electromagnetic fields (0 Hz to 300 GHz)',
      type: 'eu',
      url: '#',
      date: '1999-07-12'
    },
    {
      id: 5,
      title: 'Law on Non-Ionizing Radiation Protection',
      description: 'National law regulating protection from non-ionizing radiation including EMF',
      type: 'national',
      url: '#',
      date: '2019-05-10'
    },
    {
      id: 6,
      title: 'Rulebook on Limits of Exposure to Non-Ionizing Radiation',
      description: 'Detailed technical standards and exposure limits for various frequency ranges',
      type: 'national',
      url: '#',
      date: '2020-02-15'
    },
    {
      id: 7,
      title: 'Rulebook on Sources of Non-Ionizing Radiation of Special Interest',
      description: 'Criteria for determining EMF sources that require special monitoring and assessment',
      type: 'national',
      url: '#',
      date: '2020-03-01'
    },
    {
      id: 8,
      title: 'WHO Environmental Health Criteria 238',
      description: 'Extremely Low Frequency Fields',
      type: 'international',
      url: '#',
      date: '2007-06-01'
    }
  ];
};
