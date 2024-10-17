
const apiUrl = 'https://io.adafruit.com/api/v2/calderdigihub/feeds/course-plant-moisture/data';


async function fetchMoistureData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    
    const latestData = data[0];
    const moistureValue = latestData.value;
    const timestamp = new Date(latestData.created_at).toLocaleString();

    
    document.querySelector('.moisture-value').textContent = `${moistureValue}%`;
    document.getElementById('last-updated').textContent = timestamp;
  } catch (error) {
    console.error('Error fetching moisture data:', error);
    document.querySelector('.moisture-value').textContent = 'Failed to load data.';
  }
}


fetchMoistureData();


setInterval(fetchMoistureData, 60000);
