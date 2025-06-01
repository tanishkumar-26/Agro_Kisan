// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('nav').classList.toggle('active');
});

// Fetch Popular Crops
async function fetchPopularCrops() {
    try {
        const response = await fetch('/api/crops/popular');
        const data = await response.json();
        
        const cropsContainer = document.getElementById('popular-crops');
        cropsContainer.innerHTML = '';
        
        data.forEach(crop => {
            const cropCard = document.createElement('div');
            cropCard.className = 'crop-card';
            cropCard.innerHTML = `
                <img src="/images/crops/${crop.image}" alt="${crop.name}" class="crop-img">
                <div class="crop-info">
                    <h3>${crop.name}</h3>
                    <p>${crop.short_description}</p>
                    <a href="/crops/${crop.id}" class="btn primary">Learn More</a>
                </div>
            `;
            cropsContainer.appendChild(cropCard);
        });
    } catch (error) {
        console.error('Error fetching popular crops:', error);
    }
}

// Fetch Market Prices
async function fetchMarketPrices() {
    try {
        const response = await fetch('/api/market/latest');
        const data = await response.json();
        
        const marketTable = document.querySelector('#market-data tbody');
        marketTable.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.commodity}</td>
                <td>₹${item.min_price}</td>
                <td>₹${item.max_price}</td>
                <td>${item.market}</td>
            `;
            marketTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching market prices:', error);
    }
}

// Fetch Weather Data
async function fetchWeather(location = 'Bangalore') {
    try {
        const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
        const data = await response.json();
        
        const weatherContainer = document.getElementById('weather-data');
        weatherContainer.innerHTML = '';
        
        data.forecast.forEach(day => {
            const weatherCard = document.createElement('div');
            weatherCard.className = 'weather-card';
            weatherCard.innerHTML = `
                <h3>${day.date}</h3>
                <div class="weather-icon">
                    <i class="fas ${getWeatherIcon(day.condition)}"></i>
                </div>
                <div class="weather-temp">${day.temp}°C</div>
                <div class="weather-desc">${day.condition}</div>
                <div>Humidity: ${day.humidity}%</div>
            `;
            weatherContainer.appendChild(weatherCard);
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

function getWeatherIcon(condition) {
    condition = condition.toLowerCase();
    if (condition.includes('sunny') || condition.includes('clear')) {
        return 'fa-sun';
    } else if (condition.includes('cloud')) {
        return 'fa-cloud';
    } else if (condition.includes('rain')) {
        return 'fa-cloud-rain';
    } else if (condition.includes('thunder') || condition.includes('storm')) {
        return 'fa-bolt';
    } else if (condition.includes('snow')) {
        return 'fa-snowflake';
    } else {
        return 'fa-cloud-sun';
    }
}

// Event Listeners
document.getElementById('get-weather').addEventListener('click', function() {
    const location = document.getElementById('location').value;
    if (location) {
        fetchWeather(location);
    } else {
        alert('Please enter a location');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchPopularCrops();
    fetchMarketPrices();
    fetchWeather();
});