// URL to fetch the moisture data
const apiUrl = 'https://io.adafruit.com/api/v2/calderdigihub/feeds/course-plant-moisture/data';

// Adafruit IO key
const apiKey = ''; 

// Function to fetch data from Adafruit IO API
function fetchMoistureData() {
  fetch(apiUrl, {
    headers: {
      'X-AIO-Key': apiKey
    }
  })
  .then(response => {
    // Check if response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Assume the response contains an array of data points
    const moistureData = data.map(item => parseFloat(item.value));  // Parse values to numbers
    const lastUpdated = new Date().toLocaleTimeString();  // Get current time for last updated

    // Update the charts with the new data
    updateCharts(moistureData, lastUpdated);
  })
  .catch(error => {
    console.error('Error fetching moisture data:', error);
    document.querySelector('.moisture-value').textContent = 'Failed to load data.';
  });
}

// Function to update the charts
function updateCharts(moistureData, lastUpdated) {
  // Current moisture is the last value
  const currentMoisture = moistureData[moistureData.length - 1];  
  // Remaining dry percentage
  const dryValue = 100 - currentMoisture;  

  // Update the text and last updated time
  document.querySelector('.moisture-value').textContent = currentMoisture + '%';
  document.getElementById('last-updated').textContent = `Last updated: ${lastUpdated}`;

  // Update Line Chart (moisture over time)
  // Generate time labels (T-0, T-1, etc.)
  moistureLineChart.data.labels = Array(moistureData.length).fill('').map((_, i) => `T-${i}`);
  // Use all moisture data  
  moistureLineChart.data.datasets[0].data = moistureData;  
  moistureLineChart.update();

  // Update Pie Chart (current moisture vs dry)
  moisturePieChart.data.datasets[0].data = [currentMoisture, dryValue];
  moisturePieChart.update();
}

// Initialize the charts
const lineCtx = document.getElementById('moistureLineChart').getContext('2d');
const moistureLineChart = new Chart(lineCtx, {
  type: 'line',
  data: {
    // Placeholder labels (to be updated with real-time data)
    labels: [],  
    datasets: [{
      label: 'Moisture Level (%)',
      // Start with empty data
      data: [],  
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

const pieCtx = document.getElementById('moisturePieChart').getContext('2d');
const moisturePieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: ['Moisture', 'Dry'],
    datasets: [{
      // Placeholder data
      data: [0, 100],  
      // Green for moisture, red for dry
      backgroundColor: ['#4CAF50', '#FFCDD2'],  
      // Darker border colors
      borderColor: ['#388E3C', '#FF5252'],  
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.raw + '%';
          }
        }
      }
    }
  }
});

// Fetch and update data periodically (every 10 seconds in this case)
// Initial fetch
fetchMoistureData();  
// Fetch new data every 10 seconds
setInterval(fetchMoistureData, 10000);  

// Get the audio element
const audio = document.getElementById('background-music');




