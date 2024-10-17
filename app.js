// Global variable to hold all moisture data
let allMoistureData = [];

// Function to fetch data from Adafruit IO API
function fetchMoistureData() {
  // Adafruit IO API URL
  const apiUrl = 'https://io.adafruit.com/api/v2/calderdigihub/feeds/course-plant-moisture/data';

  // Your Adafruit IO key
  const apiKey = 'YOUR_ADAFRUIT_IO_KEY_HERE'; // Insert your API key here

  fetch(apiUrl, {
    headers: {
      'X-AIO-Key': apiKey,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // Parse values to numbers and assume the response contains an array of data points
      const moistureData = data.map((item) => parseFloat(item.value));
      const lastUpdated = new Date().toLocaleTimeString(); // Get current time for last updated

      // Update the global data array with the new data
      allMoistureData = allMoistureData.concat(moistureData);

      // Update the charts with the new data
      updateCharts(allMoistureData, lastUpdated);
    })
    .catch((error) => {
      console.error('Error fetching moisture data:', error);
    });
}

// Function to update the charts
function updateCharts(moistureData, lastUpdated) {
  const currentMoisture = moistureData[moistureData.length - 1]; // Current moisture is the last value
  const dryValue = 100 - currentMoisture; // Remaining dry percentage

  // Update the text and last updated time
  document.querySelector('.moisture-value').textContent = `${currentMoisture}%`;
  document.getElementById('last-updated').textContent = lastUpdated;

  // Update Line Chart (moisture over time)
  moistureLineChart.data.labels = Array.from({ length: moistureData.length }, (_, i) => `T-${i}`); // Generate time labels
  moistureLineChart.data.datasets[0].data = moistureData; // Use all moisture data
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
    labels: [], // Placeholder labels (to be updated with real-time data)
    datasets: [{
      label: 'Moisture Level (%)',
      data: [], // Start with empty data
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: true,
    }],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Initialize Pie Chart
const pieCtx = document.getElementById('moisturePieChart').getContext('2d');
const moisturePieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: ['Moisture', 'Dry'],
    datasets: [{
      data: [0, 100], // Placeholder data
      backgroundColor: ['#4CAF50', '#FFCDD2'], // Green for moisture, red for dry
      borderColor: ['#388E3C', '#FF5252'], // Darker border colors
      borderWidth: 1,
    }],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
    },
  },
});

// Fetch and update data periodically (every 10 seconds)
fetchMoistureData(); // Initial fetch
setInterval(fetchMoistureData, 10000); // Fetch new data every 10 seconds
